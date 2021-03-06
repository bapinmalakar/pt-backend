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
                await serviceCaller.mailSend(sendData, 'mailgun');
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
                if (validation.userFound(user)) {
                    if (validation.verifyPin(req.body.pin, user.verify_pin)) {
                        await UserAuth.findOneAndUpdate({ user_id: req.params.id }, { $set: { verify_pin: '' } });
                        await User.findOneAndUpdate({ _id: req.params.id }, { $set: { verified_email: true, active: true } });
                        const userInfo = await User.findOne({ _id: user.user_id });
                        await jwt.generateTokenAndStore(userInfo);
                        const userDetails = await User.findOne({ _id: userInfo._id }).populate({ path: 'auth' });
                        response.update(res, detailsFormat.formateData(userDetails));
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
                if (validation.userFound(user)) {
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
            if (validation.userFound(user)) {
                const code = securityHelper.pinGenerater();
                const sendData = detailsFormat.mailFormatData({ email: user.email, code }, 'resend');
                await serviceCaller.mailSend(sendData, 'mailgun');
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
            if (validation.bodyCheck(req.body) && validation.presentData(req.body.username, 'username') && validation.presentData(req.body.password, 'password')) {
                let user = await User.findOne({ email: req.body.username }).populate({ 'path': 'auth' });
                if (!user)
                    throw E.createError(E.getError('USER_NOT_FOUND'), 'Invalid username');
                if (!securityHelper.hashCompare(req.body.password, user.auth.password))
                    throw E.createError(E.getError('USER_NOT_FOUND'), 'Invalid password');
                await jwt.generateTokenAndStore(user);
                let userInfo = await User.findOne({ _id: user._id }).populate({ path: 'auth' });
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
            if (validation.userFound(data)) {
                const code = securityHelper.pinGenerater();
                const sendData = detailsFormat.mailFormatData({ email, code }, 'later');
                await serviceCaller.mailSend(sendData, 'mailgun');
                await UserAuth.findOneAndUpdate({ user_id: data._id }, { $set: { verify_pin: code } }, { new: true });
                response.update(res, { _id: data._id });
            }
        }
        catch (err) {
            console.log('Later pin send error: ', err);
            response.error(res, err);
        }
    },

    async getUserData(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.id }).populate({ path: 'auth' });
            response.ok(res, user ? user : {});
        }
        catch (err) {
            response.error(res, err);
        }
    },

    async logOut(req, res) {
        try {
            let userAuth = await UserAuth.findOne({ user_id: req.params.id });
            userAuth.access_token = '';
            userAuth.refresh_token = '';
            userAuth.security_key = '';
            await userAuth.save();
            response.update(res, { masg: 'done' });
        }
        catch (err) {
            console.log('Error: ', err);
            response.error(res, E.createError(E.getError('INTERNAL_SERVER')));
        }
    },

    async uploadeImage(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.id });
            if (validation.userFound(user)) {
                user.profile_image = req.body.url;
                await user.save();
                response.update(res, user);
            }
        }
        catch (err) {
            console.log('Uplaod Error: ', err);
            response.error(res, err);
        }
    },

    async updateAddess(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.id });
            if (validation.userFound(user)) {
                user.address = req.body.address || user.address;
                await user.save();
                response.update(res, user);
            }
        }
        catch (err) {
            console.log('Description update error: ', err);
            response.error(res, err);
        }
    },
    async updateDescription(req, res) {
        try {
            let user = await User.findOne({ _id: req.params.id });
            if (validation.userFound(user)) {
                user.description = req.body.description || user.description;
                await user.save();
                response.update(res, user);
            }
        }
        catch (err) {
            console.log('Description update error: ', err);
            response.error(res, err);
        }
    },
    async updateEmailVerify(req, res) {
        try {
            let user = await UserAuth.findOne({ user_id: req.params.id });
            if (validation.userFound(user)) {
                const emailExist = await User.findOne({ email: req.params.email.trim().toLowerCase() });
                if (emailExist)
                    throw E.createError(E.getError('DUPLICATE_RESOURCE'), 'email already exist');
                const code = securityHelper.pinGenerater();
                const sendData = detailsFormat.mailFormatData({ email: req.params.email, code }, 'emailchange');
                await serviceCaller.mailSend(sendData, 'mailgun');
                user.verify_pin = code;
                await user.save();
                response.ok(res, { msg: 'done' });
            }
        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    },
    async updateEmail(req, res) {
        try {
            let userAuth = await UserAuth.findOne({ user_id: req.params.id });
            if (validation.userFound(userAuth)) {
                if (userAuth.verify_pin != req.params.pin)
                    throw E.createError(E.getError('INVALID_PIN'));
                userAuth.verify_pin = '';
                await userAuth.save();
                await User.findOneAndUpdate({ _id: req.params.id }, { $set: { email: req.params.email } });
                let user = await User.findOne({_id: req.params.id});
                await jwt.generateTokenAndStore(user);
                const userDetails = await User.findOne({ _id: req.params.id}).populate({ path: 'auth' });
                response.update(res, detailsFormat.formateData(userDetails));
            }
        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    }
}