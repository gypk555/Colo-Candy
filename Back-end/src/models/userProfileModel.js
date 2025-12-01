import pool from "../config/db.js";

/**
 * Get user profile by user ID
 * @param {number} userId - The user's ID (PostgreSQL numeric ID)
 * @returns {Promise<Object>} User profile object
 */
const getUserById = async (userId) => {
  try {
    const query = `
      SELECT user_id, fullname, username, email, mobile, profile_image, role, created_at, updated_at
      FROM users
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile image
 * @param {number} userId - The user's ID
 * @param {Buffer} imageBuffer - The image buffer
 * @param {string} mimeType - The image MIME type
 * @returns {Promise<Object>} Updated user profile
 */
const updateProfileImage = async (userId, imageBuffer, mimeType) => {
  try {
    const query = `
      UPDATE users
      SET profile_image = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, fullname, username, email, mobile, profile_image, role, created_at, updated_at
    `;
    const result = await pool.query(query, [imageBuffer, userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating profile image:', error);
    throw error;
  }
};

/**
 * Update phone number
 * @param {number} userId - The user's ID
 * @param {string} phoneNo - The phone number
 * @returns {Promise<Object>} Updated user profile
 */
const updatePhoneNumber = async (userId, phoneNo) => {
  try {
    const query = `
      UPDATE users
      SET mobile = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, fullname, username, email, mobile, profile_image, role, created_at, updated_at
    `;
    const result = await pool.query(query, [phoneNo, userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating phone number:', error);
    throw error;
  }
};

/**
 * Update email
 * @param {number} userId - The user's ID
 * @param {string} email - The email address
 * @returns {Promise<Object>} Updated user profile
 */
const updateEmailAddress = async (userId, email) => {
  try {
    const query = `
      UPDATE users
      SET email = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, fullname, username, email, mobile, profile_image, role, created_at, updated_at
    `;
    const result = await pool.query(query, [email, userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

/**
 * Check if email already exists (for other users)
 * @param {string} email - The email address
 * @param {number} userId - The current user's ID (to exclude from check)
 * @returns {Promise<boolean>} True if email exists for another user
 */
const emailExists = async (email, userId) => {
  try {
    const query = `
      SELECT 1 FROM users
      WHERE email = $1 AND user_id != $2
      LIMIT 1
    `;
    const result = await pool.query(query, [email, userId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking email existence:', error);
    throw error;
  }
};

/**
 * Save address for user
 * @param {number} userId - The user's ID
 * @param {Object} address - Address object
 * @returns {Promise<Object>} Updated user profile
 */
const saveAddress = async (userId, address) => {
  try {
    // Note: This assumes there's an address table or address column in users table
    // Adjust based on your actual schema
    const query = `
      UPDATE users
      SET address = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING user_id, fullname, username, email, mobile, profile_image, role, created_at, updated_at
    `;
    const result = await pool.query(query, [JSON.stringify(address), userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};

export {
  getUserById,
  updateProfileImage,
  updatePhoneNumber,
  updateEmailAddress,
  emailExists,
  saveAddress
};
