const crypto = require('crypto');
const mongoose = require('mongoose');
var slugify = require('slugify');
const validator = require('validator');
// validator package has several STRING validators like, checkc alpha, check alphanumeric for passowrds, check email and also checkISBN...

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'A User must have an Email Address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },

    name: {
        type: String,
        required: [true, 'A User must have a Name'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'A User must have a Password'],
        trim: true,
        minlength: [8, 'Password needs to be at least 8 chars'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    passwordChangedAt: Date,
    nameSlug: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    lastLogin: {
        type: Date,
        default: Date.now(), 
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    myBidItems: [
        {
            itemName: String,
            subject: String,
            category: String,
            grade: String,
            vendor: String,
            image: String,
            bidDate: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

// Middleware to populate Slug...
userSchema.pre('save', async function (next) {
    // Slugify name
    this.nameSlug = slugify(this.name);

    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.passowrdMatches = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfterToken = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.getPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //  Expires in 20 minutes
    this.passwordResetExpires = Date.now() + 20 * 60 * 1000;

    console.log({ resetToken }, this.passwordResetToken);
    //Return unencrypted token via email...
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
