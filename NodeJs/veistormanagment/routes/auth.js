const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated } = require('../middleware/auth');

// Login page
router.get('/login', authController.getLogin);

// Register page
router.get('/register', authController.getRegister);

// Register handle
router.post('/register', authController.register);

// Login handle
router.post('/login', authController.login);

// Logout handle
router.get('/logout', ensureAuthenticated, authController.logout);

module.exports = router; 