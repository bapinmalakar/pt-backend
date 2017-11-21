'use strict';
const E = require('../response/error');
const response = require('../response/response');
const mongoose = require('mongoose');
const _hash = require('../security-helper');
const AppSecret = mongoose.model('AppSecret');

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let data = req.headers.authorization.split(' ');
            data = new Buffer(data[1], 'base64').toString().split(':');
            // console.log('Secret are: ', data);
            let credential = await AppSecret.findOne({ client_id: data[0] });
            if (credential && data[1] == credential.client_secret) {
                //console.log('Done....');
                next();
            }
            else
                throw new Error('Authentication Failed');
        }
        else
            throw new Error('Authentication Failed');
    }
    catch (err) {
        if (err = 'Authentication Failed'){
            response.error(res, E.createError(E.getError('CREDANTIAL_MISMATCH'), err));
        }   
        else{
            response.error(res, E.getError('INTERNAL_SERVER'));
        }
    }

}