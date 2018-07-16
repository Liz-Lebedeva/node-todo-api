const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        minlength: 1,
        maxlength: 1000,
        trim: true,  // removes spaces in the beg and end
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        maxlength: 1000,

    },

    // name: {
    //     type: String,
    //     minlength: 1,
    //     maxlength: 1000,
    //     trim: true,
    // },

    tokens: [{
        access: {
            type: String,
            required: true,

        },
        token: {
            type: String,
            required: true,

        },
    }],

});

UserSchema.methods.toJSON = function() {
    let user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;

    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc1234').toString(); // todo: move value to config file

    user.tokens = user.tokens.concat( [{access, token}] );
    user.save().then( () => {
        return token;
    });
};

const User = mongoose.model('User', UserSchema, 'Users');

module.exports = {User};