'use strict';
const mongoose = require('mongoose');
const AppSecret = mongoose.model('AppSecret');
const response = require('./../response/response');
const E = require('./../response/error');
const [fs, path] = [require('fs'), require('path')];

module.exports = async (req, res) => {
    //console.log(' Models: ', models);
    if (process.env.SEED == 'true') {
        try {
            let models = [];
            let files = fs.readdirSync(path.resolve(__dirname, '../models'));
            files = files.filter(d => d != 'schemas');
            //console.log('Files: ', files);
            for (let f of files) {
                let mongooseSchema = require('../models/' + f);
                models.push({ modelName: mongooseSchema.modelName, collectionName: mongooseSchema.collection.collectionName });
            }
            try {
                let collectionExist = await checkExistance();
                if (!collectionExist.length) {
                    console.log('No collection');
                    createCollection(models);
                }
                else {
                    for (let item of collectionExist) {
                        let ff = models.findIndex(d => d.collectionName == item.name);
                        if (ff != -1) {
                            //console.log('Model name is: ', models[ff].collectionName);
                            await mongoose.model(models[ff].modelName).collection.drop();
                        }
                    }
                    createCollection(models);
                }
                let AppSecret = mongoose.model('AppSecret');
                let app = new AppSecret();
                app.client_id = process.env.APP_CLIENT_ID;
                app.client_secret = process.env.APP_CLIENT_SECRET;
                let data = await app.save();
                response.ok(res, {
                    msg: 'Seed Done',
                    secret_details: data
                })
            }
            catch (err) {
                console.log('Error is: ', err);
                throw E.createError(E.getError('INTERNAL_SERVER'), 'Seed failed');
            }
        }
        catch (err) {
            response.error(res, err);
        }

    }
    if (process.env.SEED != 'true') {
        let error = new Error();
        error.status = 401;
        error.code = 'E_RESOURCE_BLOCKED_ERROR';
        error.message = 'Not allow to seed';
        response.error(res, error);
    }
}

function checkExistance() {
    return new Promise((resolve, reject) => {
        mongoose.connection.db.listCollections().toArray((err, names) => {
            if (err) reject(err);
            else {
                console.log('Names: ', names);
                if (!names.length) resolve([]);
                else resolve(names);
            }
        })
    });
}

async function createCollection(models) {
    for (let item of models) {
        console.log('inside=> ', item.collectionName);
        await mongoose.connection.db.createCollection(item.collectionName, (err) => {
            console.log('Inside error');
            if (err) throw E.createError(E.getError('INTERNAL_SERVER'), 'Seed failed');
        });
    }
}