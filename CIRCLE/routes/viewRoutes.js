const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

// This becomes the default middleware for all rendered routes....
router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/FreeStuff', viewController.getOverviewFreeStuff);
router.get('/Search/:searchStr', viewController.getOverviewSearch);
router.get('/Category/:cat', viewController.getOverviewCategory);
router.get('/Grade/:grd', viewController.getOverviewGrade);
router.get('/products/:id', viewController.getProduct);
router.get('/products/vendor/:id', viewController.addProductVendor, viewController.getProduct);
router.get('/products/:pid/:uid', viewController.addUserBid, viewController.settingsMyStuff);
router.get('/login', viewController.loginForm);
router.get('/logout', viewController.logout);
router.get('/signUp', viewController.signUp);
router.get('/meAddProduct', authController.loggedInUserRoute, viewController.settingsAddProduct);
router.get('/meChangePassword', authController.loggedInUserRoute, viewController.settingsChangePassword);
router.get('/meMyStuff', authController.loggedInUserRoute, viewController.settingsMyStuff);

module.exports = router;
