// Global Error Handler Middleware

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  const { message, statusCode } = err;

  // Log error
  console.error('❌ Error:', {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    success: false,
    message: message || 'Internal Server Error',
    statusCode: statusCode || 500
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = {
      success: false,
      message: 'Validation error',
      errors: messages,
      statusCode: 400
    };
  }

  // Mongoose duplicate error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = {
      success: false,
      message: `${field} already exists`,
      statusCode: 400
    };
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = {
      success: false,
      message: 'Invalid ID format',
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      message: 'Invalid token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      message: 'Token expired',
      statusCode: 401
    };
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = {
        success: false,
        message: 'File size exceeds 5MB limit',
        statusCode: 400
      };
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error = {
        success: false,
        message: 'Too many files',
        statusCode: 400
      };
    }
  }

  res.status(error.statusCode).json(error);
};

// Async handler to wrap async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 Not Found handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
    statusCode: 404
  });
};

export default { AppError, errorHandler, asyncHandler, notFoundHandler };
