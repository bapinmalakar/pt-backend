'use strict';
const handler = require('./handler');
const emiter = require('./emiter');

module.exports = {
    socketOnline: (socket) => {
        emiter.sendSocketId(socket);
        socket.on('user-Details', handler.receiveUserDetails);
        socket.on('disconnect', handler.disconnect(socket));
    }
}