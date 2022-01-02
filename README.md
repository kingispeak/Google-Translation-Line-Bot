# Google Translation Line Bot

<p align="center">
    <img width="360" src="https://github.com/kingispeak/Google-Translation-Line-Bot/raw/main/screenshots/001.jpg">
</p>

## Overview
A translation line bot made by [Google apps script](https://www.google.com/script/start/) and [LINE messaging API](https://developers.line.biz/zh-hant/docs/messaging-api/overview/).
>Line Bot: [https://lin.ee/HbxIUA3](https://lin.ee/HbxIUA3)

## Requirement
- [Google Apps Script](https://www.google.com/script/start/)
- [LINE Developers](https://developers.line.biz/zh-hant/)
- [Detect Language API](https://www.detectlanguage.com)

## Features

1. The Translation function is implemented by [LanguageApp](https://developers.google.com/apps-script/reference/language/language-app)  
```
translate(text, sourceLanguage, targetLanguage)
```  
> The language code in which text is written. If it is set to the empty string, the source language code will be auto-detected

2. The detectLanguage function is implemented by [DetectLanguage](https://www.detectlanguage.com)
> Free plan 1,000 requests/day

3. The Bot is implemented by [Line Message API](https://developers.line.biz/zh-hant/docs/messaging-api/overview/)

## License
[MIT](https://en.wikipedia.org/wiki/MIT_License).
