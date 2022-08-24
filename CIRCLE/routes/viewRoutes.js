const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();


router.get('/', viewController.getOverview);

router.get('/products/:id', viewController.getProduct);

router.get('/login', viewController.loginForm);



module.exports = router;
