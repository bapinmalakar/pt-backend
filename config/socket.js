'use strict';
const handler = require('../app/event-handler/connection-handler');
module.exports = (io)=>{
    io.set("origins", "*:*");
    io.on('connection', handler.socketOnline);
}