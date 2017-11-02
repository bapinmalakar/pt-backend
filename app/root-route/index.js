'use strict';
const seed = require('../seed');
const router = require('express').Router();

router.use(function (req, res, next) {
    res._json = res.json;
    res._json = function (data) {
        data['API'] = 'v1';
        res._json = data;
    }
    next();
})

router.put('/seed', seed);
module.exports = router;