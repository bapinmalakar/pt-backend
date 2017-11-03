'use strict';

const mongoose = require('mongoose');
const UserAuth = mongoose.model('UserAuth');
const jwt = require('../security-helper/jwt');
const validation = require('../validation');
const E = require('../response/error');
const response = require('../response/response');

module.exports = {
    async accessTokenVerify(req, res, next) {
        try {
            if (!req.headers.auth_header || req.headers.auth_header == 'undefined')
                throw E.createError(E.getError('CREDANTIAL_MISMATCH'), 'Credantial required');
            let [user, token] = req.headers.auth_header.split(' ', 2);
            let data = await UserAuth.findOne({ user_id: req.params.id, access_token: token }).populate({ path: 'user_id' });
            if (!data)
                throw E.createError(E.getError('CREDANTIAL_MISMATCH'), 'Invalid Token');
            let decodeData = await jwt.decodeAccessToken(token, data.security_key);
            if ('User' == decodeData.userType && decodeData.userType == user && decodeData.type == 'access-token' && data.user_id.email == decodeData.user)
                next();
            else
                throw E.createError(E.getError('CREDANTIAL_MISMATCH'), 'Invalid Token');
        }
        catch (err) {
            response.error(res, err);
        }

    },

    async refreshTokenVerify(req, res, next) {
        try {
            if (!req.headers.auth_header || req.headers.auth_header == 'undefined')
                throw E.createError(E.getError('CREDANTIAL_MISMATCH'), 'Credantial required');
            let [user, token] = req.headers.auth_header.split(' ', 2);
            let data = await UserAuth.findOne({ user_id: req.params.id, refresh_token: token }).populate({ path: 'user_id' });
            if (!data)
                throw E.createError(E.getError('CREDANTIAL_MISMATCH'), 'Invalid Token');
            let decodeData = await jwt.decodeAccessToken(token, data.security_key);
            if ('User' == decodeData.userType && decodeData.userType == user && decodeData.type == 'refresh-token' && data.user_id.email == decodeData.user)
                next();
            else
                throw E.createError(E.getError('CREDANTIAL_MISMATCH'), 'Invalid Token');
        }
        catch (err) {
            response.error(res, err);
        }
    }
}