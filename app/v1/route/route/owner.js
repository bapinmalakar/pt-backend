'use strict';

const auth = require('../../../middleware/basic-auth');
const token = require('../../../middleware/verify-token');
const defa = require('../../controller/default');
module.exports = [
    { api: '/owner/test', method: 'GET', actions: [auth, defa.appp] },
    { api: '/owner/class', method: 'GET', actions: [defa.testService] },
    { api: '/owner/token-check/:id', method: 'GET', actions: [token.refreshTokenVerify, defa.checkToken] }
]
