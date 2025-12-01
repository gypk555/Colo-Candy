// Validation Middleware for Input Validation

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateZipCode = (zipCode) => {
  const zipRegex = /^[0-9]{6}$/;
  return zipRegex.test(zipCode);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

export const validateOTP = (otp) => {
  // Must be 6 digits
  const otpRegex = /^[0-9]{6}$/;
  return otpRegex.test(otp);
};

// Middleware to validate request body
export const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is empty'
    });
  }
  next();
};

// Middleware to sanitize input
export const sanitizeInput = (req, res, next) => {
  // Remove leading/trailing whitespace from string fields
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

export default {
  validateEmail,
  validatePhone,
  validateZipCode,
  validatePassword,
  validateOTP,
  validateRequestBody,
  sanitizeInput
};
