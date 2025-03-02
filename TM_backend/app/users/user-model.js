const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // name: {
    //     type: String,
    //     default: " "
    // },
    email: {
        type: String,
        default: " "
    },
    password: {
        type: String,
        default: " "
    },
    tokens: [{
        type: mongoose.Schema.Types.ObjectId,
        default: " ",
        ref: 'Refresh'
    }],
    tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            default: " ",
            ref: 'task'
    }],
}, { timestamps: true })

module.exports = mongoose.model('usermaster', userSchema, 'usermasters');

