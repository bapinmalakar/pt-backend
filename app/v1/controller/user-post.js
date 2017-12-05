'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserPost = mongoose.model('UserPost');
const response = require('../../response/response');
const E = require('../../response/error');
const validation = require('../../validation');

module.exports = {
    async postSave(req, res) {
        try {
            let user;
            if (validation.bodyCheck(req.body) && validation.presentData(req.body.id, 'User Identification') && validation.presentAnyOne([req.body.caption, req.body.postText, req.body.PostImage]))
                user = await User.findOne({ _id: req.params.id });
            if (validation.userFound(user)) {
                let userPost = new UserPost();
                user.user_id = req.body.id;
                user.caption = req.body.caption || '';
                user.post_text = req.body.postText || '';
                user.post_image = req.body.postImage || '';
                user.post_location = req.body.postLocation || '';
                user.post_tag= req.body.postTag || '';
                await user.save();
                response.create(res, user);
            }
        }
        catch (err) {
            console.log('Eroor=> ', err);
            response.error(res, err);
        }
    }
}