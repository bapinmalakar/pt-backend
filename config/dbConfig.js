'use strict';

const mongoose = require('mongoose');
require('colors');

module.exports = async function () {
    mongoose.Promise = global.Promise;
    let envConfig = (process.env.STATUS === 'DEV') ? process.env.DEV_DB : process.env.PROD_DB;
    console.log('Db path::: ', envConfig);
    if (process.env.ENV === 'DEV')
        mongoose.set('debug', true);
    mongoose.connect(envConfig, {
        useMongoClient: true
    });
    //mongoose.createConnection(envConfig);
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to '.green + envConfig.green);
    });

    mongoose.connection.once('open', async () => {
        console.log('Connected to mongodb!'.green);
    });

    await mongoose.connection.on('error', function (err) {
        console.error('Mongoose default connection error: ' + err, ''.red);
    });

    await mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected', ''.red);
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination', ''.red);
            process.exit(0);
        });
    });
}
