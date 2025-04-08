const jwt = require('jsonwebtoken');

// Optional authentication middleware
// Verifies token if present but doesn't block the request if no token
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

  // If no token, just continue without setting user info
  if (!token) {
    console.log('No token provided, continuing as guest');
    return next();
  }

  // Verify token if present
  try {
    console.log('Verifying optional token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded.user;
    req.userId = decoded.user.id;
    
    console.log(`Optional auth: Identified user: ${req.userId}`);
  } catch (err) {
    console.warn('Optional token verification failed:', err.message);
    // Don't block the request, just log and continue
  }
  
  next();
}; 