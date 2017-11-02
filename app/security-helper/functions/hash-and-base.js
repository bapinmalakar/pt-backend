'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    getHash(data) {
        return bcrypt.hashSync(data, 15);
    },
    hashCompare(data1, data2) {
        return bcrypt.compareSync(data1, data2);
    }
}