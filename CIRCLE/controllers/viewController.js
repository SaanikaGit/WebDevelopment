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
            return res.status(404).json({
                status: 'failed',
                message: `No Product corresponding to id [${req.params.id}] found`,
            });
        }

        res.status(400).render('product', {
            title: product.name,
            product,
        });
    } catch (err) {
        next(new AppError('Unable to GET product details for this product', 400));
    }
};

exports.loginForm = async (req, res) => {
    res.status(200).render('login', {
        title: 'Login',
    });
};
