const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.validateToken, authController.updatePassword);

// This needs to be an ADMIN ONLY call - TBD...
router
    .route('/all')
    .get(authController.validateToken, userController.getAllUsers);

//TBD
router
    .route('/')
    .get(authController.validateToken, userController.getUser)
    .patch(authController.validateToken, userController.updateUser);

//TBD
router
    .route('/product/:id/:name')
    .patch(authController.validateToken, userController.addUserBid);

module.exports = router;
