const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header - check both x-auth-token and Authorization headers
  let token = req.header('x-auth-token');
  
  // Check Authorization header if x-auth-token is not present
  if (!token) {
    const authHeader = req.header('Authorization');
    // Format: "Bearer <token>"
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // Check if no token
  if (!token) {
    console.log('Authentication failed: No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required. Please login.' 
    });
  }

  // Verify token
  try {
    console.log('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded.user;
    req.userId = decoded.user.id;
    
    console.log(`Authenticated user: ${req.userId}`);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token. Please login again.' 
    });
  }
};