const config = require('config.js');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI + "/user-audit-app" || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
// || config.connectionString,
console.log("hello");
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};