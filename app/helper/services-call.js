'use strict';
const classFinder = require('../services/interface');
const E = require('../response/error');
module.exports = {
    async mailSend(data, serviceClassName) {
        try {
            const clssInstance = new classFinder(serviceClassName);
            return await clssInstance.action(data);
        }
        catch (err) {
            console.log(err);
            throw E.createError(E.getError('INTERNAL_SERVER'), "Not able to send mail, try again");
        }
    }
}