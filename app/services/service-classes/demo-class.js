'use strict'
module.exports = class DemoClass {
    constructor(configData = null) {
        this.configData = configData;
    }

    async action(data = null) {
        //console.log('Demo Class Performed');
        await { data: 'Performed' };
    }
}