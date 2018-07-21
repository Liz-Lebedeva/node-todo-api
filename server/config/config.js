const env = process.env.NODE_ENV || 'development';
console.log('env ****', env); // todo: remove this later

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];

    Object.keys(envConfig).forEach( (key) => {
        process.env[key] = envConfig[key];
    });
}
