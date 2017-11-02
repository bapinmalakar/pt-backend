'use strict';

const base64 = require('base-64');
const utf = require('utf8');
const stringFun = require('./../../javascript-function-build/string-function');
const crypto = require('crypto');
const algo = process.env.ALGORITHM;
const password = process.env.STATUS === 'DEV' ? process.env.DEV_CRYPTO_PAS : process.env.PROD_CRYPTO_PAS;
const decipher = crypto.createDecipher(algo, password);
module.exports = {
    decryptData(data) {
        let decodeText = decipher.update(data, 'hex', 'utf8');
        decodeText += decipher.final('utf8');
        return JSON.parse(decodeText);
    },

    decryptToken(token) {
        let decodeToken = decipher.update(token, 'utf8', 'hex');
        decodeToken += decipher.final('utf8');
        return decodeToken;
    }
}