'use strict';

let router = require('express').Router();
const version = process.env.VERSION;
const [fs,path] = [require('fs'), require('path')];

module.exports = async () => {
    const routeFile = '../' + version + '/route';
    if (fs.existsSync(path.resolve(__dirname, routeFile))) {
        let routes = require(routeFile)();
        try {
            router.use((req, res, next) => {
                res._json = res.json;
                res.json = function (data) {
                    data['API'] = version.toUpperCase();
                    res._json(data);
                };
                next();
            });
            for (let route of routes) {
                if (checkAction(route.actions)) {
                    switch (route.method) {
                        case 'GET':
                            router.get(route.api, route.actions);
                            break;
                        case 'POST':
                            router.post(route.api, route.actions);
                            break;
                        case 'PUT':
                            router.put(route.api, route.actions);
                            break;
                        case 'DELETE':
                            router.delete(route.api, route.action);
                            break;
                    }
                }
            }
            console.log('Done2');
            return router;
        }
        catch (err) {
            console.log('Errrrrrr=====>', err);
        }
    }
}

function checkAction(actions) {
    for (let action of actions) {
        if (typeof action != 'function')
            return false;
    }
    return true;
}