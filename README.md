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
The communiction between server and host is based on the following message format :
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

The server will response the following message on auth result:
```javascript
{"m":1,"i":0,"n":"AuthenticateUser","o":"{\"User\":{\"UserId\":3138,\"UserName\":\"CCTmarketdata\",\"Email\":\"cct@cct.com\",\"EmailVerified\":true,\"AccountId\":3141,\"OMSId\":1,\"Use2FA\":false},\"Authenticated\":true,\"Locked\":false,\"Requires2FA\":false,\"EnforceEnable2FA\":false,\"TwoFAType\":null,\"TwoFAToken\":null}"}
```
The status of  o.Authenticated indicate if the logon is success or not, after that, it can proceed to subscription with the following message:

|Property|Value|
|--------|-----|
|m|0|
|i|2|
|n|SubscribeLevel1|
|o|```{"OMSId": 1,"instrumentID": 4}```|

After the message is deliveried to server, it will start pushing price with the message structure in field "o" :
```javascript
{"m":1,"i":2,"n":"SubscribeLevel1","o":"{ \"OMSId\":1, \"InstrumentId\":4, \"BestBid\":7279.77, \"BestOffer\":7362.54, \"LastTradedPx\":7362.54, \"LastTradedQty\":0.07699999, \"LastTradeTime\":1586322125714, \"SessionOpen\":7140.04, \"SessionHigh\":7450.46, \"SessionLow\":7099.04, \"SessionClose\":7362.54, \"Volume\":0.07699999, \"CurrentDayVolume\":21.45001190, \"CurrentDayNumTrades\":1511, \"CurrentDayPxChange\":222.50, \"Rolling24HrVolume\":104.57449258, \"Rolling24NumTrades\":7026, \"Rolling24HrPxChange\":0.7292139812073485068215026500, \"TimeStamp\":\"1586322125717\" }"}
```
Current, After the price message is received, the LastTradedPx is used as token price for keeping, furthermore, in order to reduce the record keep in database, if LastTradedPx doesn't change in compare to the latest updated price, the message will be discard.
