const express = require('express');
const router = express.Router();
const { registerUser ,login} = require('../controllers/userController');
const authController = require('../controllers/authController');

// Route for user registration
router.post('/sign-up', registerUser);
router.post('/login', login);
// Route for sending the verification code
router.post('/send-code', authController.sendVerificationCode);

// Route for verifying the code
router.post('/verify-code', authController.verifyCode);

module.exports = router;
