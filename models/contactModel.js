
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    gender:{
        type:String,
        enum:['male','female'],
        required:[true,"Gender is required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;