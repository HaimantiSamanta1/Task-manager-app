const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    category: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
    task_assign_date:{
        type:Date,
        default:null,
        validate: {
            validator: function (date) {
                return moment(date, 'YYYY-MM-DD', true).isValid();
            },
            message: 'Invalid date format for proj_end_date',
        },
    },
    usermasters: { 
        type: mongoose.Schema.Types.ObjectId,
        default:null, 
        ref: 'usermaster' 
    }

}, { timestamps: true })

module.exports = mongoose.model('task', taskSchema, 'tasks');

