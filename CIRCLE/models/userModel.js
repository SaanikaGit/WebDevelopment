const mongoose = require('mongoose');
var slugify = require('slugify');

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
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    lastLogin: {
        type: Date,
        default: Date.now(),
    },
    myBidItems: [
        {
                itemName: String,
            subject: String,
            grade: String,
            image: String,
            bidDate: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

// Middleware to populate Slug...
userSchema.pre('save', function (next) {
    this.nameSlug = slugify(this.name);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
