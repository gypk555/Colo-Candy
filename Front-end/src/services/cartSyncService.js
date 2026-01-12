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
  // Validate inputs are arrays
  if (!Array.isArray(localCart)) {
    console.warn('[Cart Merge] localCart is not an array, using empty array');
    localCart = [];
  }
  if (!Array.isArray(dbCart)) {
    console.warn('[Cart Merge] dbCart is not an array, using empty array');
    dbCart = [];
  }

  const merged = [...dbCart];

  console.log('[Cart Merge] Local cart:', localCart.map(item => ({ id: item.id, qty: item.quantity })));
  console.log('[Cart Merge] DB cart:', dbCart.map(item => ({ id: item.id, qty: item.quantity })));

  localCart.forEach(localItem => {
    // Normalize IDs to string for consistent comparison
    const existingIndex = merged.findIndex(item => String(item.id) === String(localItem.id));

    if (existingIndex >= 0) {
      // Item exists in both carts, use maximum quantity
      const oldQty = merged[existingIndex].quantity;
      const newQty = Math.max(merged[existingIndex].quantity, localItem.quantity);
      console.log(`[Cart Merge] Item ${localItem.id}: DB qty=${oldQty}, Local qty=${localItem.quantity}, Using max=${newQty}`);

      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: newQty
      };
    } else {
      // Item only in local cart, add it
      console.log(`[Cart Merge] Adding new item: ${localItem.id} (qty: ${localItem.quantity})`);
      merged.push(localItem);
    }
  });

  console.log('[Cart Merge] Merged cart:', merged.map(item => ({ id: item.id, qty: item.quantity })));
  return merged;
};
