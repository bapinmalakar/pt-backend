'use strict';
const encrypt = require('./../security-helper');
const E = require('./error');
module.exports = {
    ok(res, data) {
        if (process.env.ENCRYPT == 'true')
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'ok' });
        else
            res.status(200).send({ data: data, success: true, type: 'ok' });
    },

    update(res, data) {
        if (process.env.ENCRYPT == 'true')
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'updated' });
        else
            res.status(200).send({ data: data, success: true, type: 'created' });
    },

    create(res, data) {
        if (process.env.ENCRYPT == 'true')
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'created' });
        else
            res.status(200).send({ data: data, success: true, type: 'created' });
    },

    delete(res, data) {
        if (process.env.ENCRYPT == 'true')
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'deleted' });
        else
            res.status(200).send({ data: data, success: true, type: 'deleted' });
    },
    error(res, err) {
        let error = err;
        let errCodes = ['E_INTERNAL SERVER_ERROR', 'E_DUPLICACY_ERROR', 'E_NOT_FOUND_ERROR', 'E_USER_NOT_FOUND_ERROR',
            'E_INVALID_DATA', 'E_DATA_MISSSING_ERROR', 'E_CREDANTIAL_NOT_MATCH_ERROR', 'E_TOKEN_EXPIRE_ERROR', 'E_PIN_MISMATCH_ERROR'];
        if (errCodes.findIndex(d => d == err.code) == -1) {
            error = E.createError(E.getError('INTERNAL_SERVER'));
        }
        else error = err;
        res.status(error.status).send({
            error: {
                code: error.code,
                message: error.message
            },
            success: false
        });
    }
}