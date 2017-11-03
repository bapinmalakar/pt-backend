'use strict';
const mongoose = require('mongoose');
const jwt = require('../security-helper/jwt');
const securityHelper = require('../security-helper');
const UserAuth = mongoose.model('UserAuth');

module.exports = class Jwt {
    constructor() { }
    async generateTokenAndStore(user) {
        let key = securityHelper.securityKey();
        let accessToken = await jwt.generateAccessToken({ user: user.email, name: user.first_name, type: 'access-token', userType: 'User' }, key);
        let refreshToken = await jwt.generateRefreshToken({ user: user.email, name: user.first_name, type: 'refresh-token', userType:'User'}, key);
        await UserAuth.findOneAndUpdate({ 'user_id': user._id }, { $set: { access_token: accessToken, refresh_token: refreshToken, security_key: key } }, { new: true });
    }
}