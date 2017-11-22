'use strict';

module.exports = class Details {
    constructor() { }

    formateData(userInfo) {
       let data = {
           _id: userInfo._id,
           access_token: userInfo.auth.access_token,
           refresh_token: userInfo.auth.refresh_token,
           email: userInfo.email
       }
        return data;
    }

    mailFormatData(data, type) {
        let sendData = {
            to: '',
            subject: '',
            text: '',
            html: ''
        };
        if (type == 'signin') {
            sendData.to = data.email;
            sendData.subject = '6-Character activation code for activate your account of Problem-Tracker :)';
            sendData.text = 'User this code ' + data.code;
            sendData.html = '<h1>Your Problem Tracker Account Activatiov Code</h1><br><h3>' + data.code + '</h3>';
        }
        else if (type == 'resend') {
            sendData.to = data.email;
            sendData.subject = 'New 6-Character activation code for activate your account of Problem-Tracker :)';
            sendData.text = 'User this code ' + data.code;
            sendData.html = '<h1>Your Problem Tracker Account Activatiov Code</h1><br><h3>' + data.code + '</h3>';
        }
        else if(type == 'later'){
            sendData.to = data.email;
            sendData.subject = '6-Character activation code for activate your account of Problem-Tracker now :)';
            sendData.html = '<h1>Your Problem Tracker Account Activatiov Code</h1><br><h3>' + data.code + '</h3>';
        }
        return sendData;
    }
}