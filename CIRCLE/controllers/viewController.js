const Product = require('../models/productModel');
const User = require('../models/userModel');
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

exports.getOverviewCategory = async (req, res, next) => {
    try {
        // 1. Get all Product data from DB
        const products = await Product.find({category: req.params.cat});

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

exports.getOverviewGrade = async (req, res, next) => {
    try {
        const products = await Product.find({grade: {$regex: new RegExp(req.params.grd,'i' )}});
        res.status(400).render('overview', {
            title: 'All Products',
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

exports.getProduct = async (req, res, next) => {
    try {
        console.log('Get Product #0 [' + req.params.id  + ']')
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
            console.log('Get Product #1.2 - Product Found [' + product.name + ']');
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
    console.log(res.locals)
    res.status(200).render('mySettingsMyStuff', {
        title: 'My Settings-My Stuff',
        user: res.locals.user,
        // subRoute: req.params.subRoute,
        userProducts: userProducts,
    });
      console.log('after user details-My Stuff');
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
        console.log('trying to add user bid #0 [' + req.params.pid + ']-[' + req.params.uid + ']' );
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
        
        console.log('trying to add user bid #1 Product Found' );
        //Add Bid...
        // Fill data from req.user
        // TBD - 'image' can come from user, as filled in form
        const newBid = {
            itemName: product.name,
            subject: product.subject,
            category: product.category,
            grade: product.grade,
            vendor: req.params.name,
            image: product.imageCover,
        };

        console.log( {newBid});
        console.log('Adding bid for user-', req.params.uid);
        // console.log(newBid);

        const user = await User.findByIdAndUpdate(req.params.uid, {
            $push: { myBidItems: newBid },
        });

        const upatedUser = await User.findById(req.params.uid);
        // Update res.locals.user so that newly added BD is visible
        res.locals.user = upatedUser;
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