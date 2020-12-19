const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    image:{
        name:String,
        data:Buffer,
        contentType:String
    }
});

module.exports = mongoose.model('User', UserSchema);