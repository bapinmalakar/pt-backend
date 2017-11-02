'use strict';
module.exports = {
    pinGenerater() {
        return (Math.random() * 1e32).toString(36).substr(0,6);
    },

    securityKey() {
        return Math.random().toString(36).substr(2, 6);
    }
}