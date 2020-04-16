const cryptosxws = require('./lib/cryptosxfeed');
const logger = require('./lib/logger');
const request = require('axios');
const PORT = process.env.PORT ||5000;
const stoadminurl = process.env.STOADMINURL || `http://127.0.0.1:${PORT}`;



const getdata = async function(){
	let tokensinforequest=null;
	let tokens=null;
	try{
			tokensinforequest = request.post(`${stoadminurl}/tokensinfo/getTokensinfo`).then((response)=>{
			tokens=response.data;

		});// request then end
	}catch(error){
		//getprice error
		logger.error(`-- 1. PriceModule main getdata - tokens-info error : ${error}}`);
	}	
	await request.all([tokensinforequest]);
	return [tokens];

}

//main start
getdata().then((a)=>{
			let tokens=a[0];
			for(var i=0;i<tokens.length;i++){
				logger.info(`PriceModule tokens ${tokens[i].SYMBOL}`);
				let symbol = tokens[i].SYMBOL;
				let url = tokens[i].pricehost;
				if(tokens[i].pricefeedmode=="WS"){
					// WebStocket implementation
					if(tokens[i].priceAPIname=="cryptosx"){
						// cryptosx implementation
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
						let obj = new cryptosxws(symbol,"cryptosx",msgstruct,url,securitypayload,true,tokens[i].basecurrency,stoadminurl);
						logger.info(`PriceModule start webstocket with ${tokens[i].priceAPIname}`);
						obj.start();

					}else{
						// others API spec
						logger.info(`PriceModule the API spec is not implemented yet :  ${tokens[i].priceAPIname}`);
					}	
				}else{
					// others pricefeed mode
					logger.info(`PriceModule the pricefeedmode is not implemented yet :  ${tokens[i].pricefeedmode}`);
				}
	
			}

});// main getdata then end
