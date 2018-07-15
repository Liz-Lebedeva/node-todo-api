const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://liz:new121@ds137611.mlab.com:37611/test-todos');

module.exports = {mongoose};