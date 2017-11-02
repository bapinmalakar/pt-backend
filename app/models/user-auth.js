'use strict';

const mongoose = require('mongoose');
const UserAuth = require('./schemas/user-auth');

module.exports = mongoose.model('UserAuth', UserAuth, 'user-auth');