'use strict';
const apiKey = process.env.STATUS == 'DEV' ? process.env.DEV_MAILGUN_API_KEY : '';
const domain = process.env.STATUS == 'DEV' ? process.env.DEV_MAILGUN_DOMAIN : '';
const mailgun = require('mailgun-js');

module.exports = class Mailgun {
    constructor(data = null) {
        this.mailgun = mailgun({ apiKey, domain });
    }
    action(data) {
        return new Promise((resolve, reject) => {
            let msg = {
                from: 'Problem Tracker<bapinmalakar383@gmail.com>',
                to: data.to,
                subject: data.subject,
                text: data.text ? data.text : '',
                html: data.html ? data.html : ''
            };
            this.mailgun.messages().send(msg, (err, res) => {
                console.log('Mail gun Error is: ', err);
                console.log('Mail gun response is: ', res);
                if (!err) resolve(res);
                else reject(err);
            });
        });

    }
}