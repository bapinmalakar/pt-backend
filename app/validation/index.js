'use strict';
const name = /^[a-zA-Z]*$/;
const mobile = /^[7-9][0-9]{9}$/;
const E = require('../response/error');

module.exports = {
    validName(data) {
        if (!data || data == 'undefined') throw E.createError(E.getError('DATA_REQUIRED'), 'name');
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
    validEmail(email) {
        if (!email || email == 'undefined') throw E.createError(E.getError('DATA_REQUIRED'), type);
        const emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailExp.test(email))  throw E.createError(E.getError('DATA_FORMAT'), 'email');
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
        if (!(['MALE', 'FEMALE', 'OTHERS'].find(d => d == data))) throw E.createError(E.getError('DATA_FORMAT'), 'gender');
        return true;
    }
}