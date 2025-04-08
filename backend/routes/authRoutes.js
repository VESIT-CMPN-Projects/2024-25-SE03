const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware.js');
// Register
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 })
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// Get user (protected)
router.get('/user', authMiddleware, authController.getUser);

// Update user (protected)
router.put('/user', authMiddleware, authController.updateUser);

module.exports = router;