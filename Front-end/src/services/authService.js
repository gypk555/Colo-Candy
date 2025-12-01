import axios from 'axios';

/**
 * Auth Service
 * Handles authentication-related API calls including password reset and OAuth
 */

// Request OTP for password reset
export const requestPasswordResetOTP = async (email) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
      { email },
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'OTP sent to your email',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      error: error.response?.data
    };
  }
};

// Verify OTP
export const verifyPasswordResetOTP = async (email, otp) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/verify-otp`,
      { email, otp },
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'OTP verified successfully',
      token: response.data.token,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid or expired OTP',
      error: error.response?.data
    };
  }
};

// Reset password with OTP token
export const resetPassword = async (email, otp, newPassword, resetToken) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/reset-password`,
      { email, otp, newPassword },
      {
        headers: {
          'Authorization': `Bearer ${resetToken}`
        },
        withCredentials: true
      }
    );
    return {
      success: true,
      message: response.data.message || 'Password reset successful',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reset password',
      error: error.response?.data
    };
  }
};

// Change password (when user is logged in)
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/change-password`,
      { oldPassword, newPassword },
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'Password changed successfully',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to change password',
      error: error.response?.data
    };
  }
};

// Update user profile
export const updateProfile = async (updates) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      updates,
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'Profile updated successfully',
      user: response.data.user,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile',
      error: error.response?.data
    };
  }
};

// Update user phone
export const updatePhone = async (phone) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/phone`,
      { phone },
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'Phone number updated successfully',
      user: response.data.user,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update phone number',
      error: error.response?.data
    };
  }
};

// Update user email
export const updateEmail = async (email) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/email`,
      { email },
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'Email updated successfully',
      user: response.data.user,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update email',
      error: error.response?.data
    };
  }
};

// Save or update address
export const saveAddress = async (address) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/address`,
      address,
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'Address saved successfully',
      address: response.data.address,
      user: response.data.user,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to save address',
      error: error.response?.data
    };
  }
};

// Get Google OAuth URL
export const getGoogleAuthURL = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'openid email profile';

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
};

// Exchange Google auth code for tokens
export const exchangeGoogleCode = async (code) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      { code },
      { withCredentials: true }
    );
    return {
      success: true,
      message: response.data.message || 'Google login successful',
      user: response.data.user,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Google login failed',
      error: error.response?.data
    };
  }
};

// Upload profile image
export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/upload-profile-image`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return {
      success: true,
      message: response.data.message || 'Profile image uploaded successfully',
      user: response.data.user,
      profileImage: response.data.profileImage,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload profile image',
      error: error.response?.data
    };
  }
};
