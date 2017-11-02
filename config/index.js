'use strict'

const dbConfig = require('./dbConfig');
const cluster = require('./cluster');
const setup = require('./setAppUse');
const models = require('./models');
const routeConfigure = require('./routeConfig');
require('colors');
const version = process.env.VERSION;

module.exports = async (app) => {
    try {
        //console.log('App Configure');
        await setup(app);
        await models();
        await dbConfig();
        app.use('/api/config/root', require('../app/root-route'));
        await routeConfigure(app);
        console.log('Done4');
        app.all('*', (req, res) => res.status(404).send({ 'API': 'isavier', 'VERSION': 1, 'MESSAGE': 'Invalid API Request' }));
        console.log('App Configure Fininsh'.green);
    }
    catch (err) {
        console.log("Server Can't run due to error: ".red, err.red);
        console.log('Error: ', err);
        throw new Error(err.message);
    }

}