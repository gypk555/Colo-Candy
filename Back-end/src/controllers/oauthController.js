import axios from 'axios';
import User from '../models/User.js';

// Google OAuth Callback
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/callback`,
      grant_type: 'authorization_code'
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user info from Google
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const googleUser = userInfoResponse.data;

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user
      user = new User({
        fullName: googleUser.name,
        userName: googleUser.email.split('@')[0],
        email: googleUser.email,
        phoneNo: '0000000000', // Default, user can update later
        password: 'oauth_no_password', // OAuth users don't have password
        profileImage: googleUser.picture || null,
        googleId: googleUser.id,
        emailVerified: true,
        role: 'user'
      });
      await user.save();
      console.log('✅ New user created via Google OAuth:', googleUser.email);
    } else {
      // Update existing user
      if (!user.googleId) {
        user.googleId = googleUser.id;
      }
      if (!user.profileImage && googleUser.picture) {
        user.profileImage = googleUser.picture;
      }
      user.emailVerified = true;
      user.lastLogin = new Date();
      await user.save();
      console.log('✅ User logged in via Google OAuth:', googleUser.email);
    }

    // Store user in session
    req.session.user = {
      id: user._id,
      username: user.userName,
      email: user.email,
      role: user.role
    };

    // Return user data
    const userProfile = user.toObject();
    delete userProfile.password;

    res.json({
      success: true,
      message: 'Google login successful',
      user: userProfile
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message
    });
  }
};

// Get Google Auth URL (for frontend)
export const getGoogleAuthURL = async (req, res) => {
  try {
    const scopes = ['openid', 'email', 'profile'].join(' ');
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/callback&scope=${scopes}`;

    res.json({
      success: true,
      authURL: googleAuthURL
    });
  } catch (error) {
    console.error('Error generating Google Auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication URL'
    });
  }
};

export default {
  googleCallback,
  getGoogleAuthURL
};
