'use strict';

const errors = require('./errorList');
module.exports = {
    getError(errorName) {
        return errors[errorName];
    },
    createError(e, message = null, code = null, status = null) {
        let error = new Error();
        error.code = code || e.code;
        error.status = status || e.status;
        error.message = message || e.message;
        return error;
    }
}