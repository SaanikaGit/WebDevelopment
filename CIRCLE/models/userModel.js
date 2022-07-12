const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User must have a Name'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A User must have an Email Address'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'A User must have a Password'],
        trim: true,
    },
    nameSlug: {
        type: String,
        trin : true,
        default : this.name.replace( " ", "-"),
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    lastLogin: {
        type: Date,
        default: Date.now(),
    },
    myItems: [
        {
            itemName: String,
            subject: String,
            grade: String,
            image: String,
        },
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
