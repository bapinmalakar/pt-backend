'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserAuth = mongoose.model('UserAuth');
const validation = require('../../validation');
const response = require('../../response/response');
const E = require('../../response/error');
const securityHelper = require('../../security-helper');
const Jwt = require('../../helper/token-generate');
const UserDetailsFormat = require('../../helper/user-details-send');
const serviceCaller = require('../../helper/services-call');

const jwt = new Jwt();
const detailsFormat = new UserDetailsFormat();
module.exports = {
    async signUp(req, res) {
        try {
            if (validation.bodyCheck(req.body) && validation.validName(req.body.firstName.trim()) && (!req.body.lastName || validation.validName(req.body.lastName.trim())) && validation.presentData(req.body.password, 'password') && validation.validEmail(req.body.email.trim()) && validation.genderCheck(req.body.gender, 'gender')) {
                //console.log('Valid');
                //console.log('=====', data);
                console.log('Email: ', req.body.email);
                let data = await User.findOne({ 'email': req.body.email });
                if (data)
                    throw E.createError(E.getError('DUPLICATE_RESOURCE'), 'This email already exist');

                const code = securityHelper.pinGenerater();
                const sendData = detailsFormat.mailFormatData({ email: req.body.email, code: code }, 'signin');
                console.log('Send data: ', sendData);
                await serviceCaller.mailSend(sendData);
                let userAuth = new UserAuth();
                userAuth.password = req.body.password;
                userAuth.verify_pin = code;
                let authData = await userAuth.save();

                let user = new User();
                user.first_name = req.body.firstName.toUpperCase();
                user.last_name = req.body.lastName.toUpperCase();
                user.email = req.body.email.trim();
                user.auth = authData._id;
                let userDetails = await user.save();

                authData.user_id = userDetails._id;
                await authData.save();

                response.create(res, { _id: userDetails._id });
            }
        }
        catch (err) {
            response.error(res, err);
        }

    },

    async acitivateAccount(req, res) {
        try {
            if (validation.bodyCheck(req.body) && validation.presentData(req.body.pin, 'pin')) {
                let user = await UserAuth.findOne({ user_id: req.params.id });
                if (validation.usernotFound(user)) {
                    if (validation.verifyPin(req.body.pin, user.verify_pin)) {
                        await UserAuth.findOneAndUpdate({ user_id: req.params.id }, { $set: { verify_pin: '' } });
                        await User.findOneAndUpdate({ _id: req.params.id }, { $set: { verified_email: true, active: true } });
                        const userInfo = await User.findOne({ _id: user.user_id });
                        await jwt.generateTokenAndStore(userInfo);
                        const userDetails = await User.findOne({ _id: userInfo._id }).populate({ path: 'auth' });
                        response.update(res, userDetails);
                    }
                }
            }
        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    },

    async updateDetails(req, res) {
        try {
            if (validation.bodyCheck(req.body) && validation.genderCheck(req.body.gender.trim().toLowerCase(), validation.presentData(req.body.address, 'address'))) {
                let user = await User.findOne({ '_id': req.params.id });
                if (validation.usernotFound(user)) {
                    let address = req.body.address;
                    for (let key in address)
                        address[key] = address[key].toUpperCase();
                    //console.log('User Data: ', address, gender);
                    await User.findOneAndUpdate({ '_id': req.params.id }, { $set: { address: address, gender: req.body.gender.trim().toUpperCase() } }, { new: true });
                    jwt.generateTokenAndStore();
                    let userInfo = await User.findOne({ '_id': req.params.id }).populate({ path: 'auth' });
                    let data = await detailsFormat(userInfo);
                    response.update(res, data);
                }
            }

        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    },

    async resendVerifiedCode(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.id });
            if (validation.usernotFound(user)) {
                const code = securityHelper.pinGenerater();
                const sendData = detailsFormat.mailFormatData({ email: user.email, code }, 'resend');
                await serviceCaller.mailSend(sendData);
                let data = await UserAuth.findOneAndUpdate({ user_id: req.params.id }, { $set: { verify_pin: code } }, { new: true });
                response.update(res, { _id: user._id });
            }
        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    },

    async login(req, res) {
        try {
            if (validation.bodyCheck(req.body) && validation.presentData(req.body.userName, 'username') && validation.presentData(req.body.password, 'password')) {
                let user = await User.findOne({ email: req.body.email }).populate({ 'path': auth });
                if (!user)
                    throw E.createError(E.getError('USER_NOT_FOUND', 'Invalid username'));
                if (!securityHelper.hashCompare(req.body.password, user.auth.password))
                    throw E.createError(E.getError('USER_NOT_FOUND', 'Invalid password'));
                await jwt.generateTokenAndStore(user);
                let userInfo = await User.findOne({ _id: user._id }).populate({ path: 'auth' });
                userInfo.auth.password = '';
                response.ok(res, detailsFormat.formateData(userInfo));
            }
        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    },
    async laterPinRequest(req, res) {
        try {
            let email = req.params.email;
            let data = await User.findOne({ email: email });
            if (validation.usernotFound(data)) {
                const code = securityHelper.pinGenerater();
                const sendData = detailsFormat.mailFormatData({ email, code }, 'later');
                await serviceCaller.mailSend(sendData);
                await UserAuth.findOneAndUpdate({ user_id: data._id }, { $set: { verify_pin: code } }, { new: true });
                response.update(res, { _id: data._id });
            }
        }
        catch (err) {
            console.log('Later pin send error: ', err);
            response.error(res, err);
        }
    }

}