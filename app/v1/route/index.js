'use strict';

const [fs, path] = [require('fs'), require('path')];

module.exports = () => {
    let files = fs.readdirSync(path.resolve(__dirname, './route'));
    let routeList = [];
    for (let d of files) {
        for (let i of require('./route/' + d))
            routeList.push(i);
    }
    console.log('Done1');
    return routeList;
}