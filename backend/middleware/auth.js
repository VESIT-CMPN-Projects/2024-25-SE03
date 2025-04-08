const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes that require authentication
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Check if token exists in header
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 