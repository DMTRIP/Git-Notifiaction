const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
    login: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 24
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 24
    },

    commitHistory: [{
        commit: String,
        author: String,
        avatarUrl: String
    }],

    reposList: [String]




});

const user = mongoose.model('Users',UserSchema);

module.exports = user;