
const mongoose = require('mongoose');

const plm = require("passport-local-mongoose")  // to create Login+Register authentication

mongoose.connect("mongodb://127.0.0.1:27017/firstproject")

const UserSchema = new  mongoose.Schema({
    // 1. Username
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    dp: {
        type: String,
    },
    email: {
        type: String,
    },
    fullName: {
        type: String,
    }
});

UserSchema.plugin(plm)

module.exports = mongoose.model('User', UserSchema);











//


