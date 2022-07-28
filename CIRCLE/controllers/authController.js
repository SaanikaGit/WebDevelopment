const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');

const createToken = (id, slug) => {
    return jwt.sign({ id, slug }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt,
        });

        const token = createToken(newUser._id, newUser.nameSlug);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed to create user',
            message: 'Invalid Data Sent->' + err,
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check if email and passwd are supplied
        if (!email || !password) {
            res.status(400).json({
                status: 'Email & Password are required',
                message: 'Invalid Data Sent',
            });
            return next();
        }
        // Check if user with password exists
        // + Password done as 'password' field  ahs been defined with select=false in model, so default GETS adn FINDS will never return this field
        const user = await User.findOne({ email }).select('+password');
        console.log( 'Reached here...')
        if (!user || !(await user.passowrdMatches(password, user.password))) {
            res.status(400).json({
                status: 'Incorrect Email or Password given',
                message: 'Invalid Data Sent',
            });
            return next();
        }

        // send JWT

        const token = createToken(user._id, user.nameSlug);

        res.status(200).json({
            status: 'USer Logged in',
            token,
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed to Login user',
            message: 'Invalid Data Sent->' + err,
        });
    }
};

// Validates the user token. If correct user is already logged in, calls the next function in the toute call sequence

exports.validateToken = async (req, res, next) => {
    try {
        let token = '';
        // Check if token exists
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({
                status: 'YOu are not logged in.',
                message: 'Missing Token',
            });

            return;
        }
        console.log('Token [', token, ']');

        // Validate token
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );
        console.log('Decoded [', decoded, ']');

        // Check if user still exists...
        const dbChecked = await User.findById(decoded.id);
        if (!dbChecked) {
            res.status(401).json({
                status: 'User with this token no longer exists',
            });
            return;
        }

        // check if user changed password after token was issued
        if (dbChecked.passwordChangedAfterToken(decoded.iat)) {
            res.status(401).json({
                status: 'Passwd Changed. Please login again.',
            });
            return;
        }

        // Token is perfect - access granted to next function in route stack.
        next();
    } catch (err) {
        res.status(401).json({
            status: 'failed to authenticate user. Please log in Again',
            message: 'Invalid Data Sent->' + err,
        });
    }
};

