
const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        required: [true, 'Email is required'],
        minlength: 1,
        maxlength: 100,
        trim: true  // removes spaces in the beg and end
    },
    name: {
        type: String,
        minlength: 1,
        maxlength: 100,
        trim: true  // removes spaces in the beg and end
    }
}, 'Users');

module.exports = {User};