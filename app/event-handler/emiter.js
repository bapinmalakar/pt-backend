'use strict';

module.exports = {
    sendSocketId: (socket) => {
        console.log('Id is: ', socket.id);
        socket.emit('socket-id', socket.id);
    }
}