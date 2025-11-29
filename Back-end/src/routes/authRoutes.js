import express from 'express';
import {
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword
} from '../controllers/passwordController.js';
import {
  googleCallback,
  getGoogleAuthURL
} from '../controllers/oauthController.js';

const router = express.Router();

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/change-password', changePassword);

// Google OAuth routes
router.get('/google-auth-url', getGoogleAuthURL);
router.post('/google/callback', googleCallback);

export default router;
