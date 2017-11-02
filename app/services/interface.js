'use strict';
const classes = require('./collect-classes')();

module.exports = class Interface {
    constructor(className, data = null) {
        //console.log('Inside Service Interface');
        this.classInstance = Interface.selectClass(className);
        if (this.classInstance) {
            this.myObject = new this.classInstance(data);
        }
        else {
            let error = new Error();
            error.code = 404;
            error.message = 'Class "' + className + '" Not Found';
            error.stack = 'Invalid Class Name';
            throw error;
        }
    }

    static selectClass(className) {
        // console.log('Inside Interface SelectClass');
        // console.log('Class is: ', classes.find(c => c.name == className) ? classes.find(c => c.name == className).inst : null);
        return classes.find(c => c.name == className) ? classes.find(c => c.name == className).inst : null;
    }

    async action(data) {
        await this.myObject.action(data);
    }
}