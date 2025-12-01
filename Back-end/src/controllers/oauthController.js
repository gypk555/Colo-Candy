import axios from 'axios';
import pool from '../config/db.js';

// Google OAuth Callback (Using PostgreSQL)
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    console.log('🔐 OAuth callback received with code:', code ? 'Yes' : 'No');

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...');
    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:10000'}/auth/google/callback`;
    console.log('📍 Redirect URI:', redirectUri);

    let accessToken;
    try {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });

      accessToken = tokenResponse.data.access_token;
      console.log('✅ Access token obtained');
    } catch (tokenError) {
      console.error('❌ Token exchange failed:', tokenError.response?.data || tokenError.message);
      throw tokenError;
    }

    // Get user info from Google
    console.log('📧 Fetching user info from Google...');
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const googleUser = userInfoResponse.data;
    console.log('✅ User info received:', googleUser.email);

    // Check if user exists in PostgreSQL
    console.log('👤 Checking if user exists...');
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [googleUser.email]
    );

    let user;
    if (existingUser.rows.length === 0) {
      // Create new user
      console.log('👤 Creating new user...');
      const username = googleUser.email.split('@')[0];
      const result = await pool.query(
        `INSERT INTO users (fullname, username, email, mobile, password, emailverified, googleid)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, fullname, username, email, mobile, password, emailverified, googleid, role`,
        [
          googleUser.name || 'Google User',
          username,
          googleUser.email,
          '0000000000',
          'oauth_no_password',
          true,
          googleUser.id
        ]
      );
      user = result.rows[0];
      console.log('✅ New user created via Google OAuth:', googleUser.email, 'ID:', user.id);
    } else {
      // Update existing user with Google ID
      console.log('👤 Updating existing user...');
      user = existingUser.rows[0];
      if (!user.googleid) {
        await pool.query(
          'UPDATE users SET googleid = $1, emailverified = true, lastlogin = NOW() WHERE id = $2',
          [googleUser.id, user.id]
        );
        user.googleid = googleUser.id;
      }
      console.log('✅ User logged in via Google OAuth:', googleUser.email);
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    };
    console.log('✅ Session established for user:', user.email);

    // Return user data
    const userProfile = {
      id: user.id,
      fullName: user.fullname,
      userName: user.username,
      email: user.email,
      phone: user.mobile,
      role: user.role || 'user',
      emailVerified: user.emailverified,
      googleId: user.googleid
    };

    console.log('✅ Returning user data to frontend');
    res.json({
      success: true,
      message: 'Google login successful',
      user: userProfile
    });
  } catch (error) {
    console.error('❌ Google OAuth error:', error.message);
    console.error('Stack:', error.stack);
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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUri = `${frontendUrl}/auth/google/callback`;
    console.log('📍 Frontend URL:', frontendUrl);
    console.log('📍 Redirect URI for Auth URL:', redirectUri);

    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

    console.log('✅ Generated Google Auth URL');
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
