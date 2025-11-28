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

// Login action - write-only atom
export const loginAtom = atom(
  null,
  (get, set, userData) => {
    set(userAtom, userData);
  }
);

// Logout action - write-only atom
export const logoutAtom = atom(
  null,
  (get, set) => {
    set(userAtom, null);
  }
);

// Update user action - write-only atom
export const updateUserAtom = atom(
  null,
  (get, set, updates) => {
    const currentUser = get(userAtom);
    if (currentUser) {
      set(userAtom, { ...currentUser, ...updates });
    }
  }
);
