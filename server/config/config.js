const env = process.env.NODE_ENV || 'development';
console.log('env ****', env); // todo: remove this later

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://liz:new121@ds125381.mlab.com:25381/todos';

} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://liz:new121@ds137611.mlab.com:37611/test-todos';
}