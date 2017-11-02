'use strict';
const name = /^[a-zA-Z]*$/;
const mobile = /^[7-9][0-9]{9}$/;
const E = require('../response/error');

module.exports = {
    validName(data) {
        if (!data || data == 'undefined') throw E.createError(E.getError('DATA_REQUIRED'), 'name');
        console.log((name.exec(data)));
        if (!(name.exec(data))) throw E.createError(E.getError('DATA_FORMAT'), 'name');
        else return true;
    },
    validNumber(data) {
        if (!data || data == 'undefined') throw E.createError(E.getError('DATA_REQUIRED'), 'mobile');
        if (!mobile.exec(data)) throw E.createError(E.getError('DATA_FORMAT'), 'mobile');
        return true;
    },
    presentData(data, type) {
        if (!data || data == 'undefined') throw E.createError(E.getError('DATA_REQUIRED'), type);
        return true;
    },
    verifyPin(pin, data) {
        if (pin != data) throw E.createError(E.getError('INVALID_PIN'));
        return true;
    },

    usernotFound(user) {
        if (!user)
            throw E.createError(E.getError('USER_NOT_FOUND'), 'User not found');
        return true;
    },

    bodyCheck(body) {
        if (!body)
            throw E.createError(E.getError('DATA_REQUIRED'), 'Data required in request');
        return true;
    },
    genderCheck(data) {
        if (!data || data == 'undefined') throw E.createError(E.getError('DATA_REQUIRED'), 'gender');
        if (!(['male', 'female'].find(d => d == data))) throw E.createError(E.getError('DATA_FORMAT'), 'gender');
        return true;
    }
}