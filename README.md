# STO-admin-Price-Module
## Summary
This module is to use with STO-admin purpose for token's price feed and tracking from thirdy party.

## Prerequisite
Environment Variable STOADMINURL is set to the url of STO-Admin API </br>
PriceFeed class implemented with start() function.

## Basic Flow 
The Module will get all tokens-info data by STA-Admin API call, then, for each tokens returned, it examinate the field
pricefeedmode, priceAPIname and hosturl to create assoicate price feed object and call start() for each pricefeed object.

## Current Implementation of Price Feed 

|Token Symbol|APIname|PriceFeedMode|Reference Price Field from source|
|------------|-------|-------------|---------------------------------|
|CCT|CryptoSX|Websocket|LastTradedPx|

### CryptoSX implementation
The communiction between server and host is base on the following message format :
```javascript
msgstruct={
 "m":0,
 "i":0,
 “n":"",
 "o":""
};
```
There is no explaination on those filed meaning.</br>
After the webstocket is established with server, it is required to send auth info first before subscription as follow : 
|Property|Value|
|--------|-----|
|m|0|
|i|0|
|n|AuthenticateUser|
|o|```{"APIKey": "aafcf3f3b555382be48b7a7841748765","Signature": "e552887f8cd3c7cecf2df4cc46d2c9ff5a74d2dfa8d8f6d148e380805454d618","UserId": "3138","Nonce": "1300231004"}```|

