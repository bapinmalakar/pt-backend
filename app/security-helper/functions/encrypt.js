'use strict';
const base64 = require('base-64');
const utf = require('utf8');
const stringFun = require('./../../javascript-function-build/string-function');
const crypto = require('crypto');
const algo = process.env.ALGORITHM;
const password = process.env.STATUS === 'DEV' ? process.env.DEV_CRYPTO_PAS : process.env.PROD_CRYPTO_PAS;
const cipher = crypto.createCipher(algo, password);

module.exports = {
    encodeData(data) {
        let str = JSON.stringify(data);
        let cryptedText = cipher.update(str, 'utf8', 'hex');
        cryptedText += cipher.final('hex');
        return cryptedText;
    },

    encodeToken(token) {
        let cryptedToken = cipher.update(token, 'utf8', 'hex');
        cryptedToken += cipher.final('hex');
        return cryptedToken;
    }
}