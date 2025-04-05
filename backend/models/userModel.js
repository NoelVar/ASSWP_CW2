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
    apikeys: [{
        key: {
            type: String,
        },
        status: {
            type: String,
            enum: ['active', 'not-active'],
            require: true,
        }
    }],
    role: {
        type: String,
        enum: ['admin', 'user'],
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model('userModel', userSchema)
// END OF DOCUMENT --------------------------------------------------------------------------------