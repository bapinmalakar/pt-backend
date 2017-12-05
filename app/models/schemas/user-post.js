'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = new Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
    },
    caption:{
        type: String,
        default: ''
    },
    post_text:{
        type: String,
        default: ''
    },
    post_image:{
        type: String,
        default: ''
    },
    post_location:{
        type: String,
        default: ''
    },
    post_tag:{
        type: String,
        default: 'PUBLIC',
        enum:['PUBLIC', 'NGO', 'GOVT']
    }
},{
    timestamps: true,
    autoIndex: true,
    versionKey: false
});