const User = require('../models/userModel');
const Product = require('../models/productModel');
var slugify = require('slugify');

exports.getAllUsers = async (req, res) => {
    try {
        console.log('Get all Users - query ->[', req.query, ']');
        // console.log( req );

        // "..." destuctures the object and "{}" constructs an object
        // This is done so we get "queryObj" as a new object and not pointing to the same object as re.query
        const queryObj = { ...req.query };

        // 1A -> Filtering..
        // These are special control fields and not part of document..
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);

        // 1B -> Advanced Filter
        // replace "GTE" with '$GTE" etc...
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        console.log(JSON.parse(queryStr));

        // Use 2 step method as we can chain additional methods like sort / paging on query...
        let query = User.find(JSON.parse(queryStr));

        // 2) Implement Sort...
        if (req.query.sort) {
            const sortFields = req.query.sort.split(',').join(' ');
            console.log('Sorting requested ->' + sortFields);
            query = query.sort(sortFields);
        } else {
            // Default sorting...
            query = query.sort('name');
        }

        // 3 -> Output Field Limiting ( MOngoose needs a space delimited list )...
        if (req.query.fields) {
            const outFields = req.query.fields.split(',').join(' ');
            console.log('Fields requested ->' + outFields);
            query = query.select(outFields);
        } else {
            // Default Fields ( exclude the '__V' field)
            query = query.select('-__v');
        }

        // 4 -> Pagination
        //Get what the user wants OR set defaults..
        const NUM_ITEMS = process.env.NUM_ITEMS_TO_RETURN * 1;

        console.log(req.query.page, req.query.limit);
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || NUM_ITEMS;
        // Skip all documents till previous page...
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        console.log(`Pagination SKIP=${skip} && limit = ${limit}`);

        // If page requested does not exist...
        if (req.query.page) {
            const numUsers = await User.countDocuments();
            if (skip >= numProducts) {
                throw new Error('No More Users to Display');
            }
        }

        // Execute Query...
        // query.sort().select().skip().limit()....
        const users = await query;

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed in getting all users ',
            message: err,
        });
    }
};

// Created this function as it might be needed in future
exports.getUserAdmin = async (req, res) => {
    try {
        console.log('IN [ userRoute:getUser]');

        const user = await User.findById(req.params.id);

        if (!user) {
            console.log('No User Found - 1');
            return res.status(404).json({
                status: 'failed',
                message: `No User corresponding to id [${req.params.id}] found`,
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed in getting User',
            message: err,
        });
    }
};

// 'validateTOken' has already put in User details REQ...
exports.getUser = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: {
                user: req.user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed in getting User',
            message: err,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            message: 'User Updated',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Update Data Sent->' + err,
        });
    }
};

//Not checking for multiple bids on same item for same vendor, as it does not matter...
exports.addUserBid = async (req, res) => {
    try {
        // console.log(
        //     'Adding bid for user [',
        //     req.user.id,
        //     '] for product [',
        //     req.params.id,
        //     ']'
        // );
        console.log('trying to add user bid');
        // Find product by ID
        const product = await Product.findById(req.params.id);

        // console.log('product-', product);

        if (!product) {
            console.log('No Product Found.');
            return res.status(404).json({
                status: 'failed',
                message: `No Product corresponding to id [${req.params.id}] found`,
            });
        }

        //Add Bid...
        // Fill data from req.user
        // TBD - 'image' can come from user, as filled in form
        const newBid = {
            itemName: product.name,
            subject: product.subject,
            category: product.type,
            grade: product.grade,
            vendor: req.params.name,
            image: product.imageCover,
        };

        console.log('Adding bid for user-', req.user.id);
        // console.log(newBid);

        const user = await User.findByIdAndUpdate(req.user.id, {
            $push: { myBidItems: newBid },
        });

        // console.log(user);
        res.status(200).json({
            status: 'success',
            message: 'User Bid Added',
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid add User Bid Sent->' + err,
            stack: err.stack,
        });
    }
};

exports.updateCurUser = async (req, res, next) => {
    try {
        // Do not allow user to update password
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(404).json({
                status: 'failed',
                message: 'Use route /updatemyPassword to update password',
            });
        }

        //Update User - add only fields that user can change, which in this case is 'name'
        if (req.body.name) {
            const newUser = {};
            newUser.name = req.body.name;
            newUser.nameSlug = slugify(req.body.name);

            console.log( {newUser});
            const updateUser = await User.findByIdAndUpdate(
                req.user.id,
                newUser,
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: 'success',
                updateUser,
            });
        } else {
            return res.status(200).json({
                status: 'success',
                message : 'Nothing to change',
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'updateCurUser->' + err,
            stack: err.stack,
        });
    }
};
