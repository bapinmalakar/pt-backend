'use strict';

module.exports = {
    receiveUserDetails: (data) => {
        console.log('User Details::: ', data);
    },
    disconnect: (socket) => {
        return () => {
            console.log('Disconnect Socket Id is: ', socket.id);
        }
    }
}