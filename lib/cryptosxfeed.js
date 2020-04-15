const WebSocket = require('ws');
const logger = require('./logger');
const pricehistory = require('../model/price_history.model');
const db = require('./db');


module.exports =  class CRYPTOSXWS {
	
	constructor(symbol,name,msgstruct,hosturl,securitypayload,needauth,currency){
		this.symbol=symbol;
		this.name=name;
		this.msgstruct=msgstruct;
		this.hosturl=hosturl;
		this.securitypayload=securitypayload;
		this.needauth=needauth;
		this.currency=currency;
		this._authcompleted=false;
		this.lastprice=0;

	}
	
	saverecord(objc,price){
		if(objc.lastprice!=price){
			let obj = {"SYMBOL":this.symbol,"MANUAL":false,"PRICE":price*1,
						"CURRENCY":this.currency };
			pricehistory.insertMany(obj,function(err){
					if(err){
						logger.error(`PriceModule - insert price histroy fail Symbol : ${objc.symbol} Price : ${price} Error : ${err}`);

					}else{
						logger.info(`PriceModule - insert price histroy success Symbol : ${objc.symbol} Price : ${price}`);
						objc.lastprice=price;

					}
			}); // insert end
		
		}else{
			//drop;
			logger.debug(`PriceModule - insert price histroy - price unchange,drop `);
		}
		

	}
	
	start(){

		var _ws = new WebSocket(this.hosturl);	
		
		_ws.onopen = ()=>{
		//	logger.debug(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Host: ${this._ws.url} Status : ${this._ws.readyState}`);
			logger.info(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} connection ready`);
			if(this.needauth){
				this.msgstruct.n="AuthenticateUser";
				this.msgstruct.o=JSON.stringify(this.securitypayload);
				logger.info(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Authenticating`);
				logger.debug(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Send : ${JSON.stringify(this.msgstruct)}`);
				_ws.send(JSON.stringify(this.msgstruct));

			}else{
				
			}
			
		}; // onopen end


		_ws.onmessage = (e)=>{
			logger.debug(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Msg Rec:${JSON.stringify(e.data)}`);
			if(this._authcompleted){
				// process price feed data
				let data = JSON.parse(JSON.parse(e.data).o);
				this.saverecord(this,data.LastTradedPx*1);

			}else{
				// Authentication and subscription
				let authrawresp = JSON.parse(e.data);
				let authresp= JSON.parse(authrawresp.o);
				logger.debug(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Auth Response:${JSON.stringify(authresp)}`);
    			if (authresp.Authenticated === true) {
					logger.info(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Authentication success`);
					//prepare subscribe msg
					this._authcompleted = true;
					this.msgstruct.i=2;
					this.msgstruct.n="SubscribeLevel1";
					this.msgstruct.o=JSON.stringify({
   											 "OMSId": 1,
										   	 "instrumentID": 4,
									});
					logger.debug(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Send : ${JSON.stringify(this.msgstruct)}`);
					_ws.send(JSON.stringify(this.msgstruct));
					logger.info(`PriceModule - Symbol : ${this.symbol} Spec: ${this.name} Subscribe`);
			
				}
			}; // onmessage end
	
		} //onmessage end

		_ws.onclose = function(event){
			if (event.wasClean) {
				console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
			} else {
				console.log('[close] Connection died');
			}
		};

		_ws.onerror = function(error){
			console.log(`[error] ${error.message}`);
		}



	}// start end 


}
