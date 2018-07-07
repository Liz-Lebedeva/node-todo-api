
const mongoose = require('mongoose');

const ToDo = mongoose.model('ToDo', {
    text: {
        type: String,
        required: [true, 'ToDo cannot be empty'],
        minlength: 1,
        maxlength: 1000,
        trim: true  // removes spaces in the beg and end
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
}, 'Records');

module.exports = {ToDo};