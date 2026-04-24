const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
router.post('/logout', authController.logout);

module.exports = router;
