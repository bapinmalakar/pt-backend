'use strict';

const mongoose = require('mongoose');
const AppSecret = require('./schemas/app-secret');

module.exports = mongoose.model('AppSecret', AppSecret, 'app-secret');