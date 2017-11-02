'use strict';
const encrypt = require('./../security-helper');
module.exports = {
    ok(res, data) {
        res.status(200).send({ data: data, success: true, type: 'ok' });
        //res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'ok' });
    },

    update(res, data) {
        //res.status(200).send({ data:  encrypt.encodeData(data), success: true, type: 'updated' });
        res.status(200).send({ data: data, success: true, type: 'created' });
    },

    create(res, data) {
        //res.status(200).send({ data:  encrypt.encodeData(data), success: true, type: 'created' })
        res.status(200).send({ data: data, success: true, type: 'created' });
    },

    delete(res, data) {
        res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'deleted' });
    },
    error(res, err) {
        console.log('errrrrrr', err.code, typeof err.status, err.message);
        res.status(err.status).send({
            error: {
                code: err.code,
                message: err.message
            },
            success: false
        });
    }
}