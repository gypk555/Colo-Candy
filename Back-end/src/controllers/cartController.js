import { getCartByUserId, syncCart as syncCartModel } from "../models/cartModel.js";

/**
 * GET /api/cart
 * Fetch user's cart from database
 */
const getCart = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.session.user.id;

    // Fetch cart items from database
    const cartItems = await getCartByUserId(userId);

    res.json({ cart: cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

/**
 * POST /api/cart/sync
 * Sync cart to database (replaces existing cart)
 */
const syncCart = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.session.user.id;
    const { cart } = req.body;

    // Validate cart data
    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: "Cart must be an array" });
    }

    // Sync cart to database
    await syncCartModel(userId, cart);

    res.json({ message: "Cart synced successfully", cart });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: "Failed to sync cart" });
  }
};

export { getCart, syncCart };
