const tokeninfo = require('./model/tokens-info.model');
const cryptosxws = require('./lib/cryptosxfeed');
const logger = require('./lib/logger');
const db = require('./lib/db');


var tokens=[];


tokeninfo.find({},null,function(err,docs){
		if(err){
			logger.error(`PriceModule get Tokens info error : ${err}`);
			console.log(err);
		}else{
			tokens=JSON.parse(JSON.stringify(docs));
			logger.info(`PriceModule tokens length: ${tokens.length}`);

			for(var i=0;i<tokens.length;i++){
				logger.info(`PriceModule tokens ${tokens[i].SYMBOL}`);
				let symbol = tokens[i].SYMBOL;
				let url = tokens[i].pricehost;
				if(tokens[i].pricefeedmode=="WS"){
					if(tokens[i].priceAPIname=="cryptosx"){
						logger.info(`PriceModule create webstocket with ${tokens[i].priceAPIname}`);
						let msgstruct={
							  "m":0,
							  "i":0,
							  "n":"AuthenticateUser",
							  "o":""
						};
						let securitypayload={
							"APIKey": "aafcf3f3b555382be48b7a7841748765",
				"Signature": "e552887f8cd3c7cecf2df4cc46d2c9ff5a74d2dfa8d8f6d148e380805454d618",
					"UserId": "3138",
					"Nonce": "1300231004"
						};
						let obj = new cryptosxws(symbol,"cryptosx",msgstruct,url,securitypayload,true,tokens[i].basecurrency);
						logger.info(`PriceModule start webstocket with ${tokens[i].priceAPIname}`);
						obj.start();

					}	
				}
	

			}
		}
		
		});
