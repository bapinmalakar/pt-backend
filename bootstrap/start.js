'use strict';
const express = require('express');
let app = express();
require('./../config')(app);
const port = process.env.PORT || 8100;
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const socket = require('../config/socket');

module.exports = () => {
    try {
        server.listen(port, () => console.log('App Is Running on Port: ', port));
        socket(io);
    }
    catch (err) {
        console.log("Server Can't run due to error:: ", err);
    }
}