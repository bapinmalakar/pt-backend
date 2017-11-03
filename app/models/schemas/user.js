'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

module.exports = new Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, default: null, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    mobile: { type: String, trim: true, default: '' },
    address: {
        area: { type: String, trim: true, default: null },
        city: { type: String, trim: true, default: null },
        state: { type: String, trim: true, default: null },
        country: { type: String, trim: true, default: 'INDIA' }
    },
    profile_image: { type: String, default: null },
    gender: { type: String, trim: true, enum: ['MALE', 'FEMALE', 'OTHERS'] },
    auth: { type: mongoose.SchemaTypes.ObjectId, ref: 'UserAuth' },
    active: { type: Boolean, default: false },
    verified_mobile: { type: Boolean, default: false },
    verified_email: { type: Boolean, default: false }
}, {
        timestamps: true,
        autoIndex: true,
        versionKey: false
    })