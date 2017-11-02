'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _hashPassword = require('./../../security-helper');

module.exports = new Schema({
    user_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    security_key: { type: String, default: null },
    access_token: { type: String, default: null },
    refresh_token: { type: String, default: null },
    login_pin: { type: String, default: null },
    verify_pin: { type: String, default: null },
    password: { type: String, required: true, set: hashPassword }
}, {
        timestamps: true,
        autoIndex: true,
        versionKey: false
    })

function hashPassword(password) {
    return _hashPassword.getHash(password);
}