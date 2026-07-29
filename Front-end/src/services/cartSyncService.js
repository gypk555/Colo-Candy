import axios from "axios";

/**
 * Cart Sync Service
 *
 * Handles synchronization between localStorage cart and backend database.
 * Uses debouncing strategy to minimize API calls.
 */

// Sync cart to backend
export const syncCartToBackend = async (cart) => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_CART_SYNC_URL || '/api/cart/sync',
      { cart },
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to sync cart to backend:', error);
    return { success: false, error };
  }
};

// Fetch cart from backend
export const fetchCartFromBackend = async () => {
  try {
    const response = await axios.get(
      process.env.REACT_APP_CART_URL || '/api/cart',
      { withCredentials: true }
    );
    return { success: true, cart: response.data.cart || [] };
  } catch (error) {
    console.error('Failed to fetch cart from backend:', error);
    return { success: false, cart: [] };
  }
};

// Merge two carts (localStorage + database)
export const mergeCarts = (localCart, dbCart) => {
  const merged = [...dbCart];

  localCart.forEach(localItem => {
    const existingIndex = merged.findIndex(item => item.id === localItem.id);

    if (existingIndex >= 0) {
      // Item exists in both carts, sum the quantities
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: merged[existingIndex].quantity + localItem.quantity
      };
    } else {
      // Item only in local cart, add it
      merged.push(localItem);
    }
  });

  return merged;
};
