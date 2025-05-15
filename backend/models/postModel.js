// NOTE: IMPORTS ----------------------------------------------------------------------------------
const mongoose = require('mongoose')

// NOTE: ESTABLISHING SCHEMA
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    country: {
        type: String,
        require: true,
    },
    comments: [{
        poster: {
            type: [mongoose.Types.ObjectId],
            ref: 'userModel'
        },
        content: {
            type: String,
        }
    }],
    likes: [{
        type: [mongoose.Types.ObjectId],
        ref: 'userModel'
    }],
    dislikes: [{
        type: [mongoose.Types.ObjectId],
        ref: 'userModel'
    }],
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    }
}, {timestamps: true})

module.exports = mongoose.model('postModel', postSchema)
// END OF DOCUMENT --------------------------------------------------------------------------------