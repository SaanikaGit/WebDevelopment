const User = require('../models/userModel');


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

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Create Data Sent->' + err,
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

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

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

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
    }};

    exports.addUserBid = async (req, res) => {
        try {
            console.log( 'Add user Bid for-', req.params.id);
            const user = await User.findByIdAndUpdate(req.params.id, {
                $push: { myBidItems: req.body },
            });
    
            res.status(200).json({
                status: 'success',
                message: 'User Bid Added',
            });
        } catch (err) {
            res.status(400).json({
                status: 'failed',
                message: 'Invalid add User Bid Sent->' + err,
            });
        }
    };
    
