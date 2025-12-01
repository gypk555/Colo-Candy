import {
  getUserById,
  updateProfileImage,
  updatePhoneNumber,
  updateEmailAddress,
  emailExists,
  saveAddress as saveUserAddress
} from '../models/userProfileModel.js';
import { compressProfileImage } from '../utils/imageCompression.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// Update Phone Number
export const updatePhone = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { phone } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Validate phone format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
    }

    const user = await updatePhoneNumber(userId, phone);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Phone number updated successfully',
      user
    });
  } catch (error) {
    console.error('Update phone error:', error);
    res.status(500).json({ success: false, message: 'Failed to update phone number' });
  }
};

// Update Email
export const updateEmail = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { email } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // Check if email already exists for another user
    const exists = await emailExists(email, userId);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const user = await updateEmailAddress(userId, email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Email updated successfully',
      user
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ success: false, message: 'Failed to update email' });
  }
};

// Save Address
export const saveAddress = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { fullName, phoneNumber, street, city, state, zipCode, country, type } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Validate all fields
    if (!fullName || !phoneNumber || !street || !city || !state || !zipCode) {
      return res.status(400).json({ success: false, message: 'All address fields are required' });
    }

    // Validate phone format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: 'Phone number must be 10 digits' });
    }

    // Validate zip code format (6 digits)
    const zipRegex = /^[0-9]{6}$/;
    if (!zipRegex.test(zipCode)) {
      return res.status(400).json({ success: false, message: 'Zip code must be 6 digits' });
    }

    const address = {
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country: country || 'India',
      type: type || 'home'
    };

    const user = await saveUserAddress(userId, address);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Address saved successfully',
      address,
      user
    });
  } catch (error) {
    console.error('Save address error:', error);
    res.status(500).json({ success: false, message: 'Failed to save address' });
  }
};

// Upload Profile Image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid image type. Allowed: JPG, PNG, GIF, WebP' });
    }

    // Validate file size (max 10MB before compression)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image size must be less than 10MB' });
    }

    console.log(`📸 Compressing profile image for user ${userId}...`);

    // Compress the image
    const compressedImage = await compressProfileImage(req.file.buffer, req.file.mimetype);

    // Update user profile with compressed image
    const user = await updateProfileImage(userId, compressedImage, req.file.mimetype);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Convert compressed image to base64 for response
    const base64Image = compressedImage.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      profileImage: imageUrl,
      user
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload profile image' });
  }
};

export default {
  getUserProfile,
  updatePhone,
  updateEmail,
  saveAddress,
  uploadProfileImage
};
