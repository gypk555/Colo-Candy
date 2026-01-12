import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * Cart Atoms
 *
 * These atoms manage shopping cart state across the application.
 * Using atomWithStorage for persistence across page refreshes.
 * Syncs with backend database with debouncing strategy.
 */

// Cart items atom - stores array of cart items with quantity
// Each item: { id, name, price, image, description, quantity }
export const cartAtom = atomWithStorage('cart', []);

// Dirty flag - tracks if cart has unsaved changes
export const cartDirtyAtom = atom(false);

// Derived atom - total number of unique items in cart (not sum of quantities)
export const cartItemCountAtom = atom(
  (get) => {
    const cart = get(cartAtom);
    return cart.length; // Return count of unique items, not total quantity
  }
);

// Derived atom - total price of all items in cart
export const cartTotalAtom = atom(
  (get) => {
    const cart = get(cartAtom);
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
);

// Add to cart action - write-only atom
export const addToCartAtom = atom(
  null,
  (get, set, product) => {
    const cart = get(cartAtom);
    // Normalize IDs to string for consistent comparison
    const productId = String(product.id);
    const existingItemIndex = cart.findIndex(item => String(item.id) === productId);

    if (existingItemIndex >= 0) {
      // Item already exists, increment quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1
      };
      set(cartAtom, updatedCart);
    } else {
      // New item, add with quantity 1
      set(cartAtom, [...cart, { ...product, quantity: 1 }]);
    }
    // Mark cart as dirty (needs sync)
    set(cartDirtyAtom, true);
  }
);

// Remove from cart action - write-only atom
export const removeFromCartAtom = atom(
  null,
  (get, set, productId) => {
    const cart = get(cartAtom);
    // Normalize ID to string for consistent comparison
    const normalizedProductId = String(productId);
    set(cartAtom, cart.filter(item => String(item.id) !== normalizedProductId));
    // Mark cart as dirty (needs sync)
    set(cartDirtyAtom, true);
  }
);

// Update cart item quantity - write-only atom
export const updateCartQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }) => {
    const cart = get(cartAtom);
    // Normalize ID to string for consistent comparison
    const normalizedProductId = String(productId);
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      set(cartAtom, cart.filter(item => String(item.id) !== normalizedProductId));
    } else {
      const updatedCart = cart.map(item =>
        String(item.id) === normalizedProductId ? { ...item, quantity } : item
      );
      set(cartAtom, updatedCart);
    }
    // Mark cart as dirty (needs sync)
    set(cartDirtyAtom, true);
  }
);

// Clear cart action - write-only atom
export const clearCartAtom = atom(
  null,
  (get, set) => {
    set(cartAtom, []);
    // DO NOT set dirty flag - clearing is intentional, not a sync operation
    set(cartDirtyAtom, false);
  }
);
