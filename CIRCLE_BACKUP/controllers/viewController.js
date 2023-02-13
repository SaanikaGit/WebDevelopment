const Product = require('../models/productModel');
const AppError = require('../utils/appError');

exports.getOverview = async (req, res, next) => {
    try {
        // 1. Get all Product data from DB
        const products = await Product.find();

        // 2. Build Template

        // 3. Populate and render Template

        // res.status(400).render('sampleTable', {
        //     title: 'sampleTable',
        // });
        res.status(400).render('overview', {
            title: 'All Products',
            products,
        });
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            console.log('No Product Found - 1');
            console.log(
                `No Product corresponding to id [${req.params.id}] found`
            );

            res.status(404).render('error', {
                title: 'Failed',
                message: `No Product corresponding to id [${req.params.id}] found`,
            });
        } else {
            res.status(400).render('product', {
                title: product.name,
                product,
            });
        }
    } catch (err) {
        console.log('In catch Block');
        res.status(404).render('error', {
            title: 'Failed',
            message: 'No matching product found...',
        });

        // next(
        //     new AppError('Unable to GET product details for this product', 404)
        // );
    }
};

exports.loginForm = async (req, res) => {
    res.status(200).render('login', {
        title: 'Login',
    });
};

exports.logout = async (req, res) => {
    console.log('Deleting cookie');
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 5000),
        httpOnly: true,
        path: '/'
    });
    res.locals.user = undefined;
    console.log('Deleted cookie');
    try {
        // 1. Get all Product data from DB
        const products = await Product.find();

        res.status(400).render('overview', {
            title: 'All Products',
            products,
        });
    } catch (err) {
        next(
            new AppError('Something went wrong in logout', 404)
        );
    }
};

exports.signUp = async (req, res) => {
    console.log('In SignUp Module');
    res.status(200).render('signUp', {
        title: 'Sign Up',
    });
};

exports.userDetails = async (req, res) => {
    if ( !req.params.subRoute) {
        req.params.subRoute = 'Settings';
    }
    console.log('In user details[' + req.params.subRoute + ']');
    console.log( res.locals.user.email);

    // Get all products by the person as a vendor
    const userProducts = await Product.aggregate([
        {
            // UNWIND object deconstructs an array object in a document and return the ( (multiple ) document with each array object...
            $unwind: '$vendors',
        },
        {
            $match: {
                'vendors.vemail': res.locals.user.email,
            },
        },
    ]);
    console.log( userProducts.length)
    for ( ctr = 0; ctr < userProducts.length; ctr++ ){
        console.log( userProducts[ctr])

    }

    res.status(200).render('mySettings', {
        title: 'Me',
        user: res.locals.user,
        subRoute : req.params.subRoute,
        userProducts : userProducts,
    });
    console.log('after user details');
};
