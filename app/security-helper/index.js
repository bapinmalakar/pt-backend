'use strict';

const fs = require('fs');
const path = require('path');
let fileList = {};

(function () {
    let files = fs.readdirSync(path.resolve(__dirname, './functions'));
    //console.log('Files::: ', files);
    files.forEach(f => {
        let funList = require('./functions/' + f);
        //console.log(funList);
        for (let item in funList) {
            //console.log('Item:::: ', item);
            fileList[item] = funList[item];
        }
    })
    //console.log('File List:: ', fileList);
})()

module.exports = fileList;