const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const router = express.Router();

// Create an ALIAS TOP-5-CHEAP and use an additional middleware to populate the req string with data we want and then call getAllProduct...
// .get(productController.getAllFree, productController.getAllProducts);

// TO get all Products that a vendor has posted for selling... Do a "getAllProducts" with additional query string "vendors.vname=INPUT"
// We can similarly get "GET-ALL-FREE" by using "getAllProducts" with query string "vendors.sellingPrice=0"

router.route('/get-latest').get(productController.getLatest);

router
    .route('/')
    .get(authController.validateToken, productController.getAllProducts)
    .post(authController.validateToken, productController.createProduct);

router.route('/get-all-free').get(productController.getAllFree);

router.post('/create', productController.createProduct);
router.post('/addVendor', productController.addProductVendorInternal);
// router.get('/searchProducts', viewController.getOverviewSearch);

router
    .route('/vendor/:id')
    .put(authController.validateToken, productController.addProductVendor)
    .delete(authController.validateToken, productController.dropProductVendor);

router
    .route('/vendor')
    .get(authController.validateToken, productController.getVendorProducts);

router
    .route('/:id')
    .get(authController.validateToken, productController.getProduct);

// Update Product needs to be an admin functionaliity...
// .patch(authController.validateToken, productController.updateProduct);

// We are not giving a DELETE PRODUCT route. This will be an admin functionality....
// .delete(authController.validateToken, productController.deleteProduct);

module.exports = router;
