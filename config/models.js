'use strict';
const fs = require('fs');
const path = require('path');
module.exports = async () => {
    try {
        let models = fs.readdirSync(path.resolve(__dirname, '../app/models'));
        let schemas = models.filter(d => d != 'schemas');
        //console.log('Models Are: ', schemas);
        let requireSchema = [];
        schemas.forEach(file => requireSchema.push(require('../app/models/' + file)));
        return requireSchema;
    }
    catch(err){
        console.log('Models Required Error:: ', err);
    }
  
}