'use strict';
const response = require('../../response/response');
const E = require('../../response/error');
const classFinder = require('../../services/interface');
module.exports = {
    appp(req, res) {
        let err = E.createError(E.getError('INTERNAL_SERVER'), 'Error due to insert');
        response.ok(res, { msg: '83414942f019169f416a130cf0b817d16262d33ea7282e846013c08a9249ff562fa9074b191edb14c91aab1e207bf91a61e1d997595599702eb276a6f8819965b0596d3074f17e93f2d7d40dcd38b2071290542d945921cee0785e63940ed45d4b5940512cc98c21b8f63501355d4b3a2458e8e7e2bd5699c374'});
    },

    async testService(req, res) {
        try {
            const myObject = new classFinder('nexmo');
            await myObject.action({ recipient: '9592350924', message: 'Test Nexmo API' });
            response.ok(res, { msg: 'Successfully Done' });
        }
        catch (err) {
            console.log('Error is:: ', err);
            if (err.stack === 'Invalid Class Name')
                response.error(res, E.getError('INTERNAL_SERVER'));
            if (err.message == 'Recipient or Message Required')
                response.error(res, err)
            else
                response.error(res, E.createError(E.getError('INTERNAL_SERVER')));
        }
    },

    async checkToken(req, res) {
        console.log('Here');
        response.ok(res, { msg: 'done' });
    }
}