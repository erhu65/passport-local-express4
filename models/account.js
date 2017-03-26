const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    account: String,
    password: String
});

Account.plugin(passportLocalMongoose, {usernameField: 'account'});

module.exports = mongoose.model('account_auth', Account);
