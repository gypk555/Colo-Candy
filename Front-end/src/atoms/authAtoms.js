import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * Authentication Atoms
 *
 * These atoms manage user authentication state across the application.
 * Using atomWithStorage for persistence across page refreshes.
 */

// User object atom - stores complete user details
export const userAtom = atomWithStorage('user', null);

// Derived atom - checks if user is logged in
export const isLoggedInAtom = atom(
  (get) => get(userAtom) !== null
);

// Derived atom - gets user role
export const userRoleAtom = atom(
  (get) => {
    const user = get(userAtom);
    return user?.role || '';
  }
);

// Derived atom - checks if user is admin
export const isAdminAtom = atom(
  (get) => {
    const user = get(userAtom);
    return user?.role === 'admin';
  }
);

// Derived atom - gets username
export const usernameAtom = atom(
  (get) => {
    const user = get(userAtom);
    return user?.username || '';
  }
);

// Auth actions atom - provides helper functions
export const authActionsAtom = atom(
  null,
  (get, set) => ({
    // Login action
    login: (userData) => {
      set(userAtom, userData);
    },

    // Logout action
    logout: () => {
      set(userAtom, null);
    },

    // Update user details
    updateUser: (updates) => {
      const currentUser = get(userAtom);
      if (currentUser) {
        set(userAtom, { ...currentUser, ...updates });
      }
    }
  })
);
