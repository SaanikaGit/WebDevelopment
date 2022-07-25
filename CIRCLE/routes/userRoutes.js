const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser);
router.route('/product/:id').patch(userController.addUserBid);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
