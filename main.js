var channelToken = yourLineChannelToken;
var LineHelpers = (function (helpers) {
  "use strict";
  helpers.getSourceId = function (source) {
    try {
      switch (source.type) {
        case "user":
          return source.userId;
          break;
        case "group":
          return source.groupId;
          break;
        case "room":
          return source.roomId;
          break;
        default:
          Logger.log("LineHelpers, getSourceId, invalid source type!");
          break;
      }
    } catch (e) {
      Logger.log("LineHelpers, getSourceId:" + e);
    }
  };
  return helpers;
})(LineHelpers || {});

function doGet(e) {}

// e 是Line 給我們的資料
function doPost(e) {
  Logger.log("info:" + e.postData.contents);
  var value = JSON.parse(e.postData.contents);
  try {
    var events = value.events;
    if (events != null) {
      for (var i in events) {
        var event = events[i];
        var type = event.type;
        var replyToken = event.replyToken; // 要回復訊息 reToken
        if (typeof replyToken === "undefined") {
          continue;
        }
        var sourceType = event.source.type;
        var sourceId = LineHelpers.getSourceId(event.source);
        var userId = event.source.userId; // 取得個人userId
        var userProfile = getUserProfile(userId);
        var nickname = userProfile.displayName; // 取得個人名稱
        var userLanguage = userProfile.language; // 取得個人語系
        var groupId = event.source.groupId; // 取得群組Id
        var timeStamp = event.timestamp;
        switch (type) {
          case "postback":
            break;
          case "message":
            var messageType = event.message.type;
            if (messageType !== "text") {
              continue;
            }
            var messageId = event.message.id;
            var messageText = event.message.text; // 使用者的 Message 字串
            var sourceLanguage = ""; // 空值自動判斷語系
            var targetLanguage = "vi"; // 預設要翻譯的語系
            if (userLanguage === "vi" || userLanguage === "en") {
              targetLanguage = "zh-TW";
            }
            // var regax = /[a-z]/g; // 正規式
            // if (regax.test(messageText)) {
            //   targetLanguage = "vi";
            // }
            // var language = detectLanguage(messageText);
            // if (language === "zh-Hant") {
            //   targetLanguage = "vi";
            // }
            var replyMessage = LanguageApp.translate(
              messageText,
              sourceLanguage,
              targetLanguage
            );
            replyMsg(replyToken, replyMessage, channelToken);
            break;
          case "join":
            pushMsg(channelToken, "Hello", sourceId);
            break;
          case "leave":
            pushMsg(channelToken, "Good Bye", sourceId);
            break;
          case "memberLeft":
            pushMsg(channelToken, "Bye", sourceId);
            break;
          case "memberJoined":
            pushMsg(channelToken, "Hello", sourceId);
            break;
          case "follow":
            pushMsg(channelToken, "Hello", sourceId);
            break;
          case "unfollow":
            pushMsg(channelToken, "Bye bye", sourceId);
            break;
          default:
            break;
        }
      }
    }
  } catch (ex) {
    Logger.log(ex);
  }
}

// 回覆訊息
function replyMsg(replyToken, userMsg, channelToken) {
  var url = "https://api.line.me/v2/bot/message/reply";
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + channelToken,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: [{ type: "text", text: userMsg }],
    }),
  });
}
// 發送訊息
function pushMsg(channelToken, message, usrId) {
  var url = "https://api.line.me/v2/bot/message/push";
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + channelToken,
    },
    method: "post",
    payload: JSON.stringify({
      to: usrId,
      messages: [{ type: "text", text: message }],
    }),
  });
}

// 取得使用者資料
function getUserProfile(userId) {
  var url = "https://api.line.me/v2/bot/profile/" + userId;
  var userProfile = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + channelToken,
    },
  });
  // Logger.log(userProfile);
  // response: {"userId":"","displayName":"","pictureUrl":"","language":"vi"}"
  return JSON.parse(userProfile);
}

// Get your APIkey at https://www.detectlanguage.com, and
// Replace it in 'yourApiKeyHere'
function detectLanguage(text) {
  var url = "https://ws.detectlanguage.com/0.2/detect";
  var response = UrlFetchApp.fetch(url, {
    method: "post",
    payload: {
      q: text,
    },
    headers: {
      Authorization: "Bearer " + yourApiKeyHere,
    },
  });
  // Logger.log(response.getContentText());
  // response: {"data":{"detections":[{"language":"nl","isReliable":true,"confidence":11}]}}
  return JSON.parse(response.getContentText()).data.detections[0].language;
}
