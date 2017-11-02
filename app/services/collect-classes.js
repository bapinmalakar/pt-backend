'use strict';
const fs = require('fs');
const path = require('path');

module.exports = () => {
    const files = fs.readdirSync(path.resolve(__dirname, './service-classes'));
    //console.log('Service Files are: ', files);
    const fileInstace = [];
    for (let f of files) {
        //console.log('File Name:: ', f);
        // let name = f.split('.')[0];
        // console.log('Name is::: ', name);
        fileInstace.push({ name: f.split('.')[0], inst: require('./service-classes/' + f) });
    }
    //console.log('File Instance Are: ', fileInstace);
    return fileInstace;
}