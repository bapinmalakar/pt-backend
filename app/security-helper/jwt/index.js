'use strict';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserAuth = mongoose.model('UserAuth');
const E = require('../../response/error');

module.exports = {
    generateAccessToken: (payload, key) => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, key, { expiresIn: 172800 }, (err, data) => {
                if (err) {
                    console.log('Error Token: ', err);
                    reject(E.createError(E.getError('INTERNAL_SERVER'), 'Access Token Generate'));
                }
                else resolve(data);
            })
        })
    },

    generateRefreshToken: (payload, key) => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, key, (err, data) => {
                if (err) reject(E.createError(E.getError('INTERNAL_SERVER'), 'Refresh Token Generate'));
                else resolve(data);
            })
        })
    },

    decodeAccessToken: (token, key) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, key, (err, data) => {
                if (err) {
                    console.log('Error is:: ', err.name);
                    if (err.name == 'TokenExpiredError')
                        reject(E.createError(E.getError('TOKEN_EXPIRE'), 'Access Token'));
                    else reject(E.createError(E.getError('INTERNAL_SERVER'), 'Decode Access Token'));
                }
                else resolve(data);
            })
        })
    },

    decodeRefreshToken: (token, key) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, key, (err, data) => {
                if (err)
                    reject(E.createError(E.getError('INTERNAL_SERVER'), 'Decode Refresh Token'));
                else resolve(data);
            })
        })
    }
}