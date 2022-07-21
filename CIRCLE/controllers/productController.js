// const { match } = require('assert');
// const fs = require('fs');

const AppError = require('../utils/appError');
const Product = require('../models/productModel');

exports.aliasGetVendorProducts = (req, res, next) => {
    // const query =  '{\'vendors.vname\' :\'' + req.params.id + '\'}' ;
    // const search =  '{\'vendors.vname\'=\'' + req.params.id + '\'}';
    // console.log( query);
    // console.log( search);
    // // req.query = JSON.stringify( query);

    // const query =  ` \'vendors.vname\' : \'${req.params.id}\' ` ;
    // console.log( JSON.stringify(query));
    // req.query = query;
    // // req.search = search;
    next();

    // { 'vendors.vname': 'Saanika' }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        console.log('Get all products - query ->[', req.query, ']');
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
        let query = Product.find(JSON.parse(queryStr));

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
            const numProducts = await Product.countDocuments();
            if (skip >= numProducts) {
                throw new Error('No More Products to Display');
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
        next(new AppError('Unable to GET ALL products -> ' + err, 400));
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if ( !product){
            console.log( 'No Product Found - 1');
            return res.status(404).json({
                status: 'failed',
                message: `No Product corresponding to id [${req.params.id}] found`,
            });

        }

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct,
            },
        });
    } catch (err) {
        next(new AppError('Invalid Create Product Data Sent-> ' + err, 400));
        
    }
};

exports.addProductVendor = async (req, res, next) => {
    try {
        // console.log('Add Product Vendoro called');
        // console.log(req.params.id);
        // console.log(req.body);
        const product = await Product.findByIdAndUpdate(req.params.id, {
            $push: { vendors: req.body },
        });

        res.status(200).json({
            status: 'success',
            message: 'Product Vendor Added',
            // data: {
                //     product,
                // },
            });
        } catch (err) {
            next(new AppError('Invalid AddVendorProduct Data Sent-> ' + err, 400));
        }
    };
    
    exports.dropProductVendor = async (req, res, next) => {
        try {
            console.log('Drop Product Vendoro called');
            console.log(req.params.id);
            console.log(req.params.delId);
            const product = await Product.findByIdAndUpdate(req.params.id, {
                $pull: { vendors: { _id: req.params.delId } },
            });
            
            res.status(200).json({
                status: 'success',
                message: 'Product Vendor Dropped',
            });
        } catch (err) {
            next(new AppError('Invalid DropVendorProduct Data Sent-> ' + err, 400));
        }
    };
    
    exports.updateProduct = async (req, res, next) => {
        try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: 'success',
            message: 'Product Updated',
            data: {
                product,
            },
        });
    } catch (err) {
        next(new AppError('Invalid UpdateProduct Data Sent-> ' + err, 400));
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(204).json({
            status: 'success',
            message: 'Product Deleted',
        });
    } catch (err) {
        next(new AppError('Invalid DeleteProduct Data Sent-> ' + err, 400));
    }
};

exports.getAllFree = async (req, res) => {
    try {
        console.log(
            '*************Getting All Free items...',
            process.env.NUM_ITEMS_TO_RETURN
        );

        const NUM_ITEMS = process.env.NUM_ITEMS_TO_RETURN * 1;

        const plan = await Product.aggregate([
            {
                // UNWIND object deconstructs an array object in a document and return the ( (multiple ) document with each array object...
                $unwind: '$vendors',
            },
            {
                $match: {
                    'vendors.sellingPrice': 0,
                },
            },
            {
                $limit: NUM_ITEMS,
                // $limit : 6
            },
        ]);

        res.status(200).json({
            status: 'Status success',
            data: {
                plan,
            },
        });
    } catch (err) {
        // console.log( err );
        res.status(400).json({
            status: 'failed',
            message: 'FREE : Invalid Data Sent->' + err,
        });
    }
};

exports.getLatest = async (req, res) => {
    try {
        console.log('*************Getting Latest Items...');

        const NUM_ITEMS = process.env.NUM_ITEMS_TO_RETURN * 1;

        const plan = await Product.aggregate([
            {
                // UNWIND object deconstructs an array object in a document and return the ( (multiple ) document with each array object...
                $unwind: '$vendors',
            },
            {
                $sort: {
                    'vendors.listingDate': -1,
                },
            },
            {
                $limit: NUM_ITEMS,
                // $limit : 6
            },
        ]);

        res.status(200).json({
            status: 'Status success',
            data: {
                plan,
            },
        });
    } catch (err) {
        // console.log( err );
        res.status(400).json({
            status: 'failed',
            message: 'FREE : Invalid Data Sent->' + err,
        });
    }
};
