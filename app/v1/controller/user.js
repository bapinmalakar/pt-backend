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

const jwt = new Jwt();
const detailsFormat = new UserDetailsFormat();
module.exports = {
    async signUp(req, res) {
        try {
            if (validation.bodyCheck(req.body) && validation.validName(req.body.firstName.trim()) && validation.validName(req.body.lastName.trim()) && validation.presentData(req.body.password, 'password') && validation.validEmail(req.body.email.trim()) && validation.genderCheck(req.body.gender, 'gender')) {
                //console.log('Valid');
                //console.log('=====', data);
                let data = await User.findOne({ 'email': req.body.email });
                if (data)
                    throw E.createError(E.getError('DUPLICATE_RESOURCE'), 'This email already exist');
                let userAuth = new UserAuth();
                userAuth.password = req.body.password;
                userAuth.verify_pin = securityHelper.pinGenerater();
                let authData = await userAuth.save();
                let user = new User();
                user.first_name = req.body.firstName.toUpperCase();
                user.last_name = req.body.lastName.toUpperCase();
                user.auth = authData._id;
                let userDetails = await user.save();
                authData.user_id = userDetails._id;
                await authData.save();
                let result = User.findOne({email: userDetails.email}).populate({path: 'auth'});
                response.create(res, result);
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
                        await User.findOneAndUpdate({ _id: req.params.id }, { $set: { verified_mobile: true, active: true } });
                        response.update(res, { msg: 'Account Activation Done' });
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
                let data = await UserAuth.findOneAndUpdate({ user_id: req.params.id }, { $set: { verify_pin: securityHelper.pinGenerater() } }, { new: true });
                response.update(res, { id: user._id, pin: data.verify_pin, mobile: user.mobile })
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
                let user = await User.findOne({ mobile: req.body.userName }).populate({ 'path': auth });
                if (!user)
                    throw E.createError(E.getError('USER_NOT_FOUND', 'Invalid username'));
                if (!securityHelper.hashCompare(req.body.password, user.auth.password))
                    throw E.createError(E.getError('USER_NOT_FOUND', 'Invalid password'));
                await jwt.generateTokenAndStore();
                let userInfo = await User.findOne({ _id: user._id });
                response.ok(res, await detailsFormat(userInfo));
            }
        }
        catch (err) {
            console.log('Error is: ', err);
            response.error(res, err);
        }
    }
}