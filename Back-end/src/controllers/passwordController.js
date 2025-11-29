import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { sendOTPEmail } from '../services/emailService.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcryptjs.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save OTP to database
    await PasswordReset.findOneAndUpdate(
      { email },
      {
        userId: user._id,
        email,
        otp: hashedOTP,
        otpAttempts: 0,
        expiresAt,
        verified: false
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    // Find password reset record
    const resetRecord = await PasswordReset.findOne({ email });
    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'No reset request found' });
    }

    // Check if OTP has expired
    if (new Date() > resetRecord.expiresAt) {
      await PasswordReset.deleteOne({ email });
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Check attempt count
    if (resetRecord.otpAttempts >= 3) {
      await PasswordReset.deleteOne({ email });
      return res.status(400).json({ success: false, message: 'Too many attempts. Request new OTP' });
    }

    // Verify OTP
    const isValidOTP = await bcryptjs.compare(otp, resetRecord.otp);
    if (!isValidOTP) {
      resetRecord.otpAttempts += 1;
      await resetRecord.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: resetRecord.userId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '5m' }
    );

    // Update verified status
    resetRecord.verified = true;
    resetRecord.token = resetToken;
    await resetRecord.save();

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token: resetToken
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Verify token
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Find and verify reset record
    const resetRecord = await PasswordReset.findOne({ email, verified: true });
    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid reset request' });
    }

    // Update user password
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    // Delete reset record
    await PasswordReset.deleteOne({ email });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

// Change Password (for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Verify old password
    const isValidPassword = await bcryptjs.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Check if new password is different
    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from old one' });
    }

    // Hash and save new password
    user.password = await bcryptjs.hash(newPassword, 10);
    user.updatedAt = new Date();
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

export default {
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword
};
