const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Create an ALIAS TOP-5-CHEAP and use an additional middleware to populate the req string with data we want and then call getAllProduct...
// .get(productController.getAllFree, productController.getAllProducts);

// TO get all Products that a vendor has posted for selling... Do a "getAllProducts" with additional query string "vendors.vname=INPUT"
// We can similarly get "GET-ALL-FREE" by using "getAllProducts" with query string "vendors.sellingPrice=0"

router.route('/get-latest').get(productController.getLatest);

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

router.route('/get-all-free').get(productController.getAllFree);

router
    .route('/vendor/:id')
    // .get(productController.aliasGetVendorProducts, productController.getAllProducts)
    .patch(productController.addProductVendor);

router.route('/vendor/:id/:delId')
    .patch(productController.dropProductVendor);

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
