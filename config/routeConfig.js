'use strict';
const router = require('../app/route-config');
require('colors');

module.exports = async (app) => {
    try {
        app.use('/api/v1', await router());
        console.log('Done3');
    }
    catch (err) {
        console.log('Error::: ', err, ''.red);
    }

}