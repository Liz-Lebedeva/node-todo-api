const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://liz:new121@ds125381.mlab.com:25381/todos');

module.exports = {mongoose};