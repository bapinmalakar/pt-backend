'use strict';
const userPost = require('./../../controller/user-post');
const tokenAuth = require('./../../../middleware/verify-token');
module.exports = [
    { api: '/user_post/:id/post_save', method: 'POST', actions: [tokenAuth.accessTokenVerify, userPost.postSave] }
];