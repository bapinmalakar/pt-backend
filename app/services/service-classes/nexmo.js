'use strict'
const nexmo = require('nexmo');
const E = require('../../response/error');
module.exports = class Nexmo {
    constructor(data = null) {
        this.nexmoConfig = (process.env.STATUS == 'DEV') ? { apiKey: process.env.DEV_NEXMO_APIKEY, secretKey: process.env.DEV_NEXMO_SECRETKEY, fromNumber: process.env.DEV_NEXMO_FORM } : { apiKey: process.env.PROD_NEXMO_APIKEY, secretKey: process.env.PROD_NEXMO_SECRETKEY, fromNumber: process.env.PROD_NEXMO_FORM };
        //console.log('Nexa Config :: ', this.nexmoConfig);
        this.nexmoObj = this.init();
    }

    init() {
        let debug = (process.env.STATUS == 'DEV') ? true : false;
        return new nexmo({
            apiKey: this.nexmoConfig.apiKey,
            apiSecret: this.nexmoConfig.secretKey
        }, { debug: debug });
    }
    action(data) {
        if (!data || data.recipient == 'undefine' || data.message == 'undefine' || !data.recipient || !data.message)
            throw E.createError(E.getError('DATA_REQUIRED'), 'Recipient or Message Required');
        return new Promise((resolve, reject) => {
            this.nexmoObj.message.sendSms(this.nexmoConfig.fromNumber, data.recipient, data.message, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        })

    }
}