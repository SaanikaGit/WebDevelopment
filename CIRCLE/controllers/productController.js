// const { match } = require('assert');
// const fs = require('fs');

const Product = require('../models/productModel');

exports.aliasTop5Cheap = ( req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.aliasLongest5Cheap = ( req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-duration,price';
    req.query.fields = 'name,price,duration,summary,difficulty';
    next();
};

exports.getAllProducts = async (req, res) => {
    try {
        console.log(req.query);
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
        let query = Product.find(JSON.parse(queryStr));

        // 2) Implement Sort...
        if (req.query.sort) {
            const sortFields = req.query.sort.split(',').join(' ');
            console.log('Sorting requested ->' + sortFields);
            query = query.sort(sortFields);
        } else {
            // Default sorting...
            query = query.sort('-createdAt');
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
        console.log(req.query.page, req.query.limit);
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 5;
        // Skip all documents till previous page...
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        console.log(`Pagination SKIP=${skip} && limit = ${limit}`);

        // If page requested does not exist...
        if (req.query.page) {
            const numProducts = await Tour.countDocuments();
            if (skip >= numProducts) {
                throw new Error('No More Tours to Display');
            }
        }

        // Execute Query...
        // query.sort().select().skip().limit()....
        const products = await query;

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Data Sent->' + err,
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            message: 'Product Updated',
            data: {
                product,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Data Sent->' + err,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            message: 'Product Deleted',
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Data Sent->' + err,
        });
    }
};
