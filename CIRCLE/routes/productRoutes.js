const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Create an ALIAS TOP-5-CHEAP and use an additional middleware to populate the req string with data we want and then call getAllProduct...
router
    .route('/top-5-cheap')
    .get(productController.aliasTop5Cheap, productController.getAllProducts);

router
    .route('/longest-5-cheap')
    .get(
        productController.aliasLongest5Cheap,
        productController.getAllProducts
    );

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);
router
    .route('/:id/:x?')
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
