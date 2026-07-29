import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cartAtom, cartDirtyAtom } from '../atoms/cartAtoms';
import { isLoggedInAtom } from '../atoms/authAtoms';
import { syncCartToBackend } from '../services/cartSyncService';

/**
 * Cart Sync Hook
 *
 * Manages automatic cart synchronization with backend:
 * - Checks every 2 minutes if cart has changes
 * - Syncs dirty cart to backend
 * - Handles immediate sync on page unload
 */
export const useCartSync = () => {
  const cart = useAtomValue(cartAtom);
  const [isDirty, setIsDirty] = useAtom(cartDirtyAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const syncInProgressRef = useRef(false);

  // Sync function that can be called manually
  const syncCart = async () => {
    // Only sync if user is logged in and cart has changes
    if (!isLoggedIn || !isDirty || syncInProgressRef.current) {
      return { success: false, reason: 'No sync needed' };
    }

    syncInProgressRef.current = true;

    try {
      const result = await syncCartToBackend(cart);
      if (result.success) {
        setIsDirty(false); // Clear dirty flag after successful sync
      }
      return result;
    } finally {
      syncInProgressRef.current = false;
    }
  };

  // Set up 2-minute interval check
  useEffect(() => {
    if (!isLoggedIn) return;

    const intervalId = setInterval(async () => {
      if (isDirty) {
        console.log('2-minute check: Cart has changes, syncing...');
        await syncCart();
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(intervalId);
  }, [isLoggedIn, isDirty]);

  // Handle page unload - sync immediately
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isLoggedIn && isDirty) {
        // Sync using sendBeacon for reliable sync on page close
        const url = process.env.REACT_APP_CART_SYNC_URL || '/api/cart/sync';
        const data = JSON.stringify({ cart });

        // Use sendBeacon for async request that survives page unload
        if (navigator.sendBeacon) {
          const blob = new Blob([data], { type: 'application/json' });
          navigator.sendBeacon(url, blob);
        } else {
          // Fallback: synchronous request (blocks page unload briefly)
          syncCartToBackend(cart);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoggedIn, isDirty, cart]);

  return { syncCart, isDirty };
};
