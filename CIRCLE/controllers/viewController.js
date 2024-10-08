const Product = require('../models/productModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');

exports.getOverview = async (req, res, next) => {
    try {
        // 1. Get all Product data from DB
        const products = await Product.find().sort({ dateCreated: -1 });

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

exports.getOverviewFreeStuff = async (req, res, next) => {
    try {
        console.log('*************Getting All Free items...');

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
            // {
            //     $limit: NUM_ITEMS,
            //     // $limit : 6
            // },
        ]);
        console.log('Free products found -> [' + freeProducts.length + ']');
        console.log(freeProducts);
        res.status(200).render('overview', {
            title: 'Free Products',
            products: freeProducts,
        });
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.getOverviewSearch = async (req, res, next) => {
    try {
        const searchParam = req.params.searchStr;
        console.log('final call1[' + searchParam + ']');

        const products = await Product.find({
            $or: [
                { name: { $regex: new RegExp(searchParam, 'i') } },
                { subject: { $regex: new RegExp(searchParam, 'i') } },
            ],
        });
        console.log('search OK found -> [' + products.length + ']');

        res.status(200).render('overview', {
            title: 'Search Results',
            products,
        });
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.getOverviewCategory = async (req, res, next) => {
    try {
        // 1. Get all Product data from DB
        const products = await Product.find({ category: req.params.cat }).sort({
            dateCreated: -1,
        });

        // 2. Build Template

        // 3. Populate and render Template

        // res.status(400).render('sampleTable', {
        //     title: 'sampleTable',
        // });
        res.status(400).render('overview', {
            title: 'All-' +  req.params.cat,
            products,
        });
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.getOverviewGrade = async (req, res, next) => {
    try {
        const products = await Product.find({
            grade: { $regex: new RegExp(req.params.grd, 'i') },
        }).sort({ dateCreated: -1 });
        res.status(400).render('overview', {
            title: 'All Products-' + req.params.grd,
            products,
        });

        // if( req.params.grd === 'DP') {
        //     console.log('looking for all DP stuff...');
        //     // const products = await Product.find({$or: [
        //     //          {grade: 'DP'},
        //     //          {grade: 'DP1'},
        //     //          {grade: 'DP2'},
        //     //      ]});
        //         res.status(400).render('overview', {
        //             title: 'All Products',
        //             products,
        //         });
        // }
        // else {
        //     console.log('looking for all MYP stuff...');
        //     const products = await Product.find({$or: [
        //                                         {grade: 'MYP'},
        //                                         {grade: 'MYP1'},
        //                                         {grade: 'MYP2'},
        //                                         {grade: 'MYP3'},
        //                                         {grade: 'MYP4'},
        //                                         {grade: 'MYP5'},
        //     ]});
        //     res.status(400).render('overview', {
        //         title: 'All Products',
        //         products,
        //     });
        // }
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.displaySearch = async (req, res, next) => {
    try {
        // 1. Get all Product data from DB
        alert('In Final display page');
        // const products = res.locals.products;
        res.status(400).render('overviewSearch', {
            title: 'Search Results Page',
            // products,
        });
    } catch (err) {
        next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        console.log('Get Product #0 [' + req.params.id + ']');
        const product = await Product.findById(req.params.id);

        if (!product) {
            console.log('Get Product #1.1 - No Product Found');
            console.log('No Product Found - 1');
            console.log(
                `No Product corresponding to id [${req.params.id}] found`
            );

            res.status(404).render('error', {
                title: 'Failed',
                message: `No Product corresponding to id [${req.params.id}] found`,
            });
        } else {
            console.log(
                'Get Product #1.2 - Product Found [' + product.name + ']'
            );
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

exports.resetPasswordForm = async (req, res) => {
    console.log( 'in reset password['+ req.params.token + ']');
    // alert( 'in reset password');
    res.locals.resetToken = req.params.token;
    res.status(200).render('resetPassword', {
        title: 'Reset Password',
    });
};

exports.logout = async (req, res) => {
    console.log('Deleting cookie');
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 10),
        // expires: new Date(Date.now() + 5000),
        httpOnly: true,
        path: '/',
    });
    res.locals.user = undefined;
    console.log('Deleted cookie');
    try {
        // 1. Get all Product data from DB
        const products = await Product.find();
        console.log('after deleting cookie - finding products...');

        res.status(400).render('overview', {
            title: 'All Products',
            products,
        });
    } catch (err) {
        console.log(err);
        next(new AppError('Something went wrong in logout', 404));
    }
};

exports.signUp = async (req, res) => {
    console.log('In SignUp Module');
    res.status(200).render('signUp', {
        title: 'Sign Up',
    });
};

exports.settingsAddProduct = async (req, res) => {
    console.log('before user details - adding product');
    res.status(200).render('mySettingsAddProduct', {
        title: 'My Settings-Add Product',
    });
    console.log('after user details - adding product');
};

exports.settingsChangePassword = async (req, res) => {
    console.log('before user details - changing password');
    res.status(200).render('mySettingsChangePassword', {
        title: 'My Settings-Change Password',
    });
    console.log('after user details - changing password..');
};

// exports.settingsMyStuff = async (req, res) => {
//     console.log('before user details - My Stuff');
//         res.status(200).render('mySettingsMyStuff', {
//             title: 'My Settings-My Stuff',
//         });
//     console.log('after user details - My Stuff');
// };

// Function was called "userDetails"
exports.settingsMyStuff = async (req, res) => {
    // if (!req.params.subRoute) {
    //     req.params.subRoute = 'Settings';
    // }
    console.log('In user details my Stuff[' + req.params.subRoute + ']');
    console.log(res.locals.user.email);

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
    console.log(userProducts.length);
    for (ctr = 0; ctr < userProducts.length; ctr++) {
        console.log(userProducts[ctr]);
    }
    console.log(res.locals);
    res.status(200).render('mySettingsMyStuff', {
        title: 'My Settings-My Stuff',
        user: res.locals.user,
        // subRoute: req.params.subRoute,
        userProducts: userProducts,
    });
    console.log('after user details-My Stuff');
};

exports.dropUserBid = async (req, res, next) => {
    try {
        console.log('Drop Product Vendor called -[' + req.params.pid + '][' + req.params.email + '][' + req.params.uid + ']');

        const product = await Product.findByIdAndUpdate(req.params.pid, {
            $pull: { vendors: { vemail: req.params.email } },
        });

        console.log(product);

        if (!product) {
            return res.status(201).json({
                status: 'success',
                message: 'Product Not found',
            });
        } 

        const upatedUser = await User.findById(req.params.uid);
        // Update res.locals.user so that newly added BD is visible
        res.locals.user = upatedUser;
        return next();

    } catch (err) {
        next(new AppError('Invalid DropVendorProduct Data Sent-> ' + err, 400));
    }
};

//Not checking for multiple bids on same item for same vendor, as it does not matter...
exports.addUserBid = async (req, res, next) => {
    try {
        // console.log(
        //     'Adding bid for user [',
        //     req.user.id,
        //     '] for product [',
        //     req.params.id,
        //     ']'
        // );
        console.log(
            'trying to add user bid #0 [' +
                req.params.pid +
                ']-[' +
                req.params.uid +
                ']-[' +
                req.params.vid +
                ']'
        );
        // Find product by ID
        const product = await Product.findById(req.params.pid);

        // console.log('product-', product);

        if (!product) {
            console.log('No Product Found.');
            return res.status(404).json({
                status: 'failed',
                message: `No Product corresponding to id [${req.params.pid}] found`,
            });
        }

        console.log('trying to add user bid #1 Product Found');
        //Add Bid...
        // Fill data from req.user
        // TBD - 'image' can come from user, as filled in form
        const newBid = {
            itemName: product.name,
            subject: product.subject,
            category: product.category,
            grade: product.grade,
            vendor: req.params.vid,
            image: product.imageCover,
        };

        console.log({ newBid });
        console.log('Adding bid for user-', req.params.uid);
        // console.log(newBid);

        const user = await User.findByIdAndUpdate(req.params.uid, {
            $push: { myBidItems: newBid },
        });

        const upatedUser = await User.findById(req.params.uid);
        // Update res.locals.user so that newly added BD is visible
        res.locals.user = upatedUser;
        console.log( 'Bid addded');
        //send email to vendor.....

        const message = `CIRCLE user ${user.name} is interested in your product ${product.name}\nYou can reach out to the user at [${user.email}]`;
        // Send email - find vendor email...
        const vendorDet = await User.findOne({ name: req.params.vid });

        if (!vendorDet) {
            console.log('No Vendor Found.');
            return res.status(404).json({
                status: 'failed',
                message: `No vendor corresponding to name  [${req.params.vid}] found`,
            });
        }
        console.log({vendorDet})
        console.log( 'sending email to -[' + vendorDet.email + ']');
        
        try {
            await sendEmail({
                email: vendorDet.email,
                subject: `You have a bid on your product [${product.name}]`,
                message,
            });
        } catch (err) {
            return res.status(500).json({
                status: 'Error Sending email - try again',
                message: 'Vendor Product Bid->' + err,
                stack: err.stack,
            });
        }
        return next();
        // // console.log(user);
        // res.status(200).json({
        //     status: 'success',
        //     message: 'User Bid Added',
        // });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid add User Bid Sent->' + err,
            stack: err.stack,
        });
    }
};

exports.addProductVendor = async (req, res, next) => {
    try {
        console.log('Add ME as Product Vendor called');
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
