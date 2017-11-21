'use strict';
const encrypt = require('./../security-helper');
module.exports = {
    ok(res, data) {
        if (process.env.ENCRYPT)
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'ok' });
        else
            res.status(200).send({ data: data, success: true, type: 'ok' });
    },

    update(res, data) {
        if (process.env.ENCRYPT)
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'updated' });
        else
            res.status(200).send({ data: data, success: true, type: 'created' });
    },

    create(res, data) {
        if (process.env.ENCRYPT)
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'created' });
        else
            res.status(200).send({ data: data, success: true, type: 'created' });
    },

    delete(res, data) {
        if (process.env.ENCRYPT)
            res.status(200).send({ data: encrypt.encodeData(data), success: true, type: 'deleted' });
        else
            res.status(200).send({ data: data, success: true, type: 'deleted' });
    },
    error(res, err) {
        res.status(err.status).send({
            error: {
                code: err.code,
                message: err.message
            },
            success: false
        });
    }
}