const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facebookSchema = new Schema({
    username: String,
    facebookId: String,

});

const User_facebook = mongoose.model('facebook_auth', facebookSchema);

module.exports = User_facebook; 