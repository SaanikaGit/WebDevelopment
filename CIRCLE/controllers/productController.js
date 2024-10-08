// const { match } = require('assert');
// const fs = require('fs');

const AppError = require('../utils/appError');
const Product = require('../models/productModel');
const envSpecificErr = require('../utils/envSpecificError');

exports.aliasGetVendorProductsOrig = (req, res, next) => {
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

exports.getVendorProducts = async (req, res) => {
    try {
        console.log(
            '*************Getting all vendor products for -',
            req.user.email
        );

        const vendorProducts = await Product.aggregate([
            {
                // UNWIND object deconstructs an array object in a document and return the ( (multiple ) document with each array object...
                $unwind: '$vendors',
            },
            {
                $match: {
                    'vendors.vemail': req.user.email,
                },
            },
        ]);

        res.status(200).json({
            status: 'Status success',
            data: {
                vendorProducts,
            },
        });
    } catch (err) {
        // console.log( err );
        res.status(400).json({
            status: 'failed',
            message: 'Vendor Products : Invalid Data Sent->' + err,
        });
    }
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

        if (!product) {
            console.log('No Product Found - 1');
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
        console.log('trying to create product' + req.name);
        // console.log(req);

        const newProduct = await Product.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct,
            },
        });
    } catch (err) {
        console.log(err);
        next(new AppError('Invalid Create Product Data Sent-> ' + err, 400));
    }
};

// Add logged in user ( as per Token ) as a vendor of selected product.
// Vendor name and email are taken from REQ ( which is populated in validateToken )
// remaining fields are user suppliled via input  FORM...
exports.addProductVendor = async (req, res, next) => {
    try {
        console.log('Add Product Vendor called');
        // console.log(req.params.id);
        // console.log(req.body);

        // Get PRODUCT and check if current logged in vendor is already a vendor of this product
        let product = await Product.findById(req.params.id);

        if (!product) {
            console.log('No Product Found - 1');
            return res.status(404).json({
                status: 'failed',
                message: `No Product corresponding to id [${req.params.id}] found`,
            });
            // return next();
        }

        const productVendors = product.vendors;
        const vendorRegistered = productVendors.find(
            (el) => el.vemail === req.user.email
        );

        if (vendorRegistered) {
            console.log('Vendor already present');
            return res.status(200).json({
                status: 'Success',
                message: `Vendor already registered with this product`,
            });
        }

        console.log('This vendor is NOT yet registered with the product');

        // Fill data from req.user
        let newVendor = {
            vname: req.user.name,
            vemail: req.user.email,
            datePurchased: req.body.datePurchased,
            condition: req.body.condition,
            costPrice: req.body.costPrice,
            sellingPrice: req.body.sellingPrice,
            vendorImage: req.body.vendorImage,
        };

        // console.log( 'New Vendor for Product');
        console.log('New Vendor - ', newVendor);
        product = await Product.findByIdAndUpdate(req.params.id, {
            $push: { vendors: newVendor },
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

exports.addProductVendorInternal = async (req, res, next) => {
    try {
        console.log('Add Product Vendor Internal called');
        // Fill data from request
        let newVendor = {
            vname: req.body.vname,
            vemail: req.body.vemail,
            datePurchased: req.body.datePurchased,
            condition: req.body.condition,
            costPrice: req.body.costPrice,
            sellingPrice: req.body.sellingPrice,
            sold: req.body.sold,
        };

        // console.log( 'New Vendor for Product');
        console.log('New Vendor - ', newVendor);
        product = await Product.findByIdAndUpdate(req.body.prodId, {
            $push: { vendors: newVendor },
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
}


// Need to check if logged in user has a product...
exports.dropProductVendor = async (req, res, next) => {
    try {
        console.log('Drop Product Vendor called -', req.user.email);
        console.log(req.params.id);
        const product = await Product.findByIdAndUpdate(req.params.id, {
            $pull: { vendors: { vemail: req.user.email } },
        });

        console.log(product);

        if (!product) {
            res.status(201).json({
                status: 'success',
                message: 'Product Not found',
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Product Vendor Dropped',
            });
        }
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

        const freeProducts = await Product.aggregate([
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
                freeProducts,
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

        const latestProducts = await Product.aggregate([
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
                latestProducts,
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
