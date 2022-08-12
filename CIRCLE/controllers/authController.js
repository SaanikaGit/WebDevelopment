const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const bcrypt = require('bcryptjs');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createTokenSendJwt = (user, returnStatus, res) => {
    const token = createToken(user._id);

    // Set Cookie
    const cookieSettings = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        cookie.Settings.secure = true;
    }

    res.cookie('jwt', token, cookieSettings);

    // DOnt display password...
    user.password = undefined;

    res.status(returnStatus).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            // passwordChangedAt: req.body.passwordChangedAt,
        });

        createTokenSendJwt(newUser, 201, res);
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
        // console.log( 'LOGIN : username present');
        // Check if user with password exists
        // + Password done as 'password' field  ahs been defined with select=false in model, so default GETS adn FINDS will never return this field
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.passowrdMatches(password, user.password))) {
            return res.status(400).json({
                status: 'Incorrect Email or Password given',
                message: 'Invalid Data Sent',
            });
            // return next();
        }
        // console.log( 'LOGIN : password match');

        // send JWT

        createTokenSendJwt(user, 200, res);
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
                status: 'You are not logged in.',
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
        // console.log('Decoded [', decoded, ']');

        // Check if user still exists...
        const tokenUser = await User.findById(decoded.id);
        if (!tokenUser) {
            res.status(401).json({
                status: 'User with this token no longer exists',
            });
            return;
        }

        // check if user changed password after token was issued
        if (tokenUser.passwordChangedAfterToken(decoded.iat)) {
            res.status(401).json({
                status: 'Passwd Changed. Please login again.',
            });
            return;
        }

        // Token is perfect - access granted to next function in route stack.
        req.user = tokenUser;
        // console.log(req.user);
        next();
    } catch (err) {
        res.status(401).json({
            status: 'failed to authenticate user. Please log in Again',
            message: 'Invalid Data Sent->' + err,
        });
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        // Get user based on posted email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json({
                status: 'User does not exist',
            });
        }

        // Generate a reset token
        const resetToken = user.getPasswordResetToken();

        //this is needed as we are only setting a single field and dont want other validations to run, in this case only
        await user.save({ validateBeforeSave: false });

        // Send token to user email
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/vi/users/resetPassword/${resetToken}`;

        const message = `Forgot password? Submit a request with your new password to the following URL ${resetURL}. Please ignore this email if you did not request a password reset.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token - valid for 20 minutes',
                message,
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({
                status: 'Error Sending email - try again',
                message: 'forgotPassword->' + err,
                stack: err.stack,
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            mesasge: 'password reset email sent',
        });
    } catch (err) {
        res.status(401).json({
            status: 'Something went wrong',
            message: 'forgotPassword->' + err,
            stack: err.stack,
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        // 1) get user based off token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // We dont know anything about the user here, not even the email address...
        const user = await User.findOne({ passwordResetToken: hashedToken });

        // console.log( 'Change password for ', user)

        // 2) check if user exists and check if token is still valid
        if (!user || user.passwordResetExpires.getTime() < Date.now()) {
            return res.status(404).json({
                status: 'Invalid Token/User',
            });
        }

        // 3) update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordChangedAt = Date.now();
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        // 4) send JWT
        createTokenSendJwt(user, 200, res);
    } catch (err) {
        res.status(401).json({
            status: 'Something went wrong',
            message: 'resetPassword->' + err,
            stack: err.stack,
        });
    }
};

exports.updateMyPassword = async (req, res, next) => {
    try {
        console.log('updatePassword Called');
        // Validate User
        // Done in alildateToken middleware, that is called before current function...
        const user = await User.findById(req.user.id).select('+password');
        // const user = await User.findOne({ email:req.user.email }).select('+password');
        console.log({ user });

        // console.log( user.password);
        // console.log( req.body.currPassword);

        // Validate current password
        if (
            !req.body.currPassword ||
            !(await user.passowrdMatches(req.body.currPassword, user.password))
        ) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Incorrect Password given',
            });
        }

        console.log('curr password OK...');
        // update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordChangedAt = Date.now();

        await user.save();

        // 4)Login user and send JWT
        createTokenSendJwt(user, 200, res);
    } catch (err) {
        res.status(401).json({
            status: 'Something went wrong',
            message: 'updatePassword->' + err,
            stack: err.stack,
        });
    }
};
