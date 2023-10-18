const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    thumbnail:String

});

const User = mongoose.model('userAuths', userSchema);

module.exports = User; 