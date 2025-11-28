import pool from "../config/db.js";

/**
 * Get all cart items for a user
 * @param {number} userId - The user's ID
 * @returns {Promise<Array>} Array of cart items with product details
 */
const getCartByUserId = async (userId) => {
  try {
    const query = `
      SELECT
        c.id as cart_item_id,
        c.product_id as id,
        c.quantity,
        p.name,
        p.price,
        p.description,
        p.image
      FROM cart_items c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

/**
 * Clear all cart items for a user
 * @param {number} userId - The user's ID
 */
const clearCartByUserId = async (userId) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Add or update a cart item
 * @param {number} userId - The user's ID
 * @param {number} productId - The product's ID
 * @param {number} quantity - The quantity
 */
const upsertCartItem = async (userId, productId, quantity) => {
  try {
    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = $3, created_at = CURRENT_TIMESTAMP
    `;

    await pool.query(query, [userId, productId, quantity]);
  } catch (error) {
    console.error('Error upserting cart item:', error);
    throw error;
  }
};

/**
 * Sync entire cart for a user (replaces existing cart)
 * @param {number} userId - The user's ID
 * @param {Array} cartItems - Array of cart items to sync
 */
const syncCart = async (userId, cartItems) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    // Insert new cart items
    if (cartItems && cartItems.length > 0) {
      const insertQuery = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
      `;

      for (const item of cartItems) {
        await client.query(insertQuery, [userId, item.id, item.quantity]);
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error syncing cart:', error);
    throw error;
  } finally {
    client.release();
  }
};

export { getCartByUserId, clearCartByUserId, upsertCartItem, syncCart };
