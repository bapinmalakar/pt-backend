'use strict';

const user = require('../../controller/user');
const auth = require('../../../middleware/basic-auth');
const tokenAuth = require('../../../middleware/verify-token');

module.exports = [
    { api: '/user/:id/resend_code', method: 'GET', actions: [auth, user.resendVerifiedCode] },
    { api: '/user/:email/get_code_active', method: 'GET', actions: [auth, user.laterPinRequest] },
    { api: '/user/:id/get_details', method: 'GET', actions: [tokenAuth.accessTokenVerify, user.getUserData] },
    { api: '/user/:id/log_out', method: 'GET', actions: [user.logOut] },

    { api: '/user/sign', method: 'POST', actions: [auth, user.signUp] },
    { api: '/user/login', method: 'POST', actions: [auth, user.login] },
    { api: '/user/:id/activate-account', method: 'POST', actions: [auth, user.acitivateAccount] },
    { api: '/user/:id/details-save', method: 'PUT', actions: [auth, user.updateDetails] },

    {api: '/user/:id/update_image', method: 'PUT', actions: [tokenAuth.accessTokenVerify, user.uploadeImage]},
    {api: '/user/:id/update_address', method: 'PUT', actions: [tokenAuth.accessTokenVerify, user.updateAddess]},
    {api: '/user/:id/update_description', method: 'PUT', actions: [tokenAuth.accessTokenVerify, user.updateDescription]},
    {api: '/user/:id/verify_email/:email', method: 'PUT', actions: [tokenAuth.accessTokenVerify, user.updateEmailVerify]},
    {api: '/user/:id/update_email/:pin/:email', method: 'PUT', actions: [tokenAuth.accessTokenVerify, user.updateEmail]}

]