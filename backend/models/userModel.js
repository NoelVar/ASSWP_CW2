// NOTE: IMPORTS ----------------------------------------------------------------------------------
const mongoose = require('mongoose')

// NOTE: ESTABLISHING SCHEMA
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    following: [{
        type: [mongoose.Types.ObjectId],
        ref: 'userModel'
    }],
    followers: [{
        type: [mongoose.Types.ObjectId],
        ref: 'userModel'
    }],
    role: {
        type: String,
        enum: ['admin', 'user'],
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model('userModel', userSchema)
// END OF DOCUMENT --------------------------------------------------------------------------------