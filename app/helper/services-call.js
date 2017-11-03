'use strict';
const classFinder = require('../services/interface');
const E = require('../response/error');
module.exports = {
    async mailSend(data) {
        try {
            const mailgun = new classFinder('mailgun');
            return await mailgun.action(data);
        }
        catch (err) {
            console.log('Mail error: ', err);
            throw E.createError(E.getError('INTERNAL_SERVER'), "Not able to send mail, try again");
        }
    }
}