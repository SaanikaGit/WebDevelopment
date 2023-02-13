const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// This becomes the default middleware for all rendered routes....
router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/products/:id', viewController.getProduct);
router.get('/login', viewController.loginForm);
router.get('/logout', viewController.logout);
router.get('/signUp', viewController.signUp);
router.get('/me/:subRoute?', authController.loggedInUserRoute, viewController.userDetails);

module.exports = router;
