const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc1234').toString();
    // todo: move value to config file

    user.tokens = user.tokens.concat( [{access, token}] );
    return user.save().then( () => {
        return token;
    });
};

UserSchema.methods.removeToken= function(token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc1234'); // todo: move value to config file
    } catch(e) {
        return Promise.reject({message: 'Unknown authentication error'});
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;

    return User.findOne({email}).then( (user) => {
        if (!user) {
            return Promise.reject({message: 'User not found'});
        }

        return new Promise( (resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    // todo: generate token
                    resolve(user);
                } else {
                    reject({message: 'Unknown authentication error'});
                }
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    let user = this;

    if ( user.isModified('password') ) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


const User = mongoose.model('User', UserSchema, 'Users');

module.exports = {User};