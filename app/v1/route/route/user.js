'use strict';

const user = require('../../controller/user');
const auth = require('../../../middleware/basic-auth');

module.exports = [
    { api: '/user/:id/resend_code', method: 'GET', actions: [auth, user.resendVerifiedCode] },
    { api: '/user/:email/get_code_active', method: 'GET', actions: [auth, user.laterPinRequest] },

    { api: '/user/sign', method: 'POST', actions: [auth, user.signUp] },
    { api: '/user/:id/activate-account', method: 'POST', actions: [auth, user.acitivateAccount] },
    { api: '/user/:id/details-save', method: 'PUT', actions: [auth, user.updateDetails] }

]