'use strict'
const bodyparser = require('body-parser');
const cors= require('cors');
module.exports = async (app)=>{
    //console.log('Setup App Use');
    app.use(cors());
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: false}));
    return app;
}