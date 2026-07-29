// Authentication Middleware
// Checks if user is authenticated via session

export const authMiddleware = (req, res, next) => {
  try {
    // Check if user is in session
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated. Please login first.'
      });
    }

    // Attach user to request for use in controllers
    req.user = req.session.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Optional auth middleware - doesn't fail if user not authenticated
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    if (req.session.user && req.session.user.id) {
      req.user = req.session.user;
    }
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Admin middleware - checks if user is admin
export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (req.session.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

export default { authMiddleware, optionalAuthMiddleware, adminMiddleware };
