'use strict';

const mongoose = require('mongoose').Schema;
const _hash = require('../../security-helper');

module.exports = new mongoose({
    client_id: {
        type: String,
        required: true,
        unique: true
    },
    client_secret: {
        type: String,
        required: true,
        set: hashValue
    }
}, {
        timestamps: true,
        autoIndex: true,
        versionKey: false
    })

function hashValue(client_secret) {
    console.log('client secret: ', _hash.getHash(client_secret))
    return _hash.getHash(client_secret);
}