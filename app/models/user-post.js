'use strict';
const mongoose = require('mongoose');
const UserPost = require('./schemas/user-post');
module.exports = mongoose.model('UserPost', UserPost, 'user-post');