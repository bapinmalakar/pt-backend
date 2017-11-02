'use strict';

module.exports = {
    reverse(str) {
        let str1 = str.split('');
        str1 = str1.reverse();
        str = str1.join('');
        return str;
    }
}