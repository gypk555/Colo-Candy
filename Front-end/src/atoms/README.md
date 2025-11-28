# Authentication Atoms - Jotai State Management

This directory contains Jotai atoms for managing global authentication state across the application.

## 📁 Files

- `authAtoms.js` - Authentication state atoms and actions

## 🎯 Overview

We use Jotai for state management to avoid prop drilling and ensure synchronization across components. The authentication state is persisted to localStorage for persistence across page refreshes.

## 📦 Available Atoms

### Core Atom

#### `userAtom`
**Type:** `atomWithStorage`
**Storage Key:** `'user'`
**Description:** Stores the complete user object. This is the source of truth for authentication state.

```javascript
// User object structure
{
  username: string,
  role: string, // 'admin' | 'user'
  // ... other user fields
}
```

---

### Derived Atoms (Read-only)

#### `isLoggedInAtom`
**Type:** Derived atom (read-only)
**Returns:** `boolean`
**Description:** Checks if a user is currently logged in.

```javascript
const isLoggedIn = useAtomValue(isLoggedInAtom);
```

#### `userRoleAtom`
**Type:** Derived atom (read-only)
**Returns:** `string`
**Description:** Returns the current user's role or empty string if not logged in.

```javascript
const userRole = useAtomValue(userRoleAtom);
```

#### `isAdminAtom`
**Type:** Derived atom (read-only)
**Returns:** `boolean`
**Description:** Checks if the current user has admin role.

```javascript
const isAdmin = useAtomValue(isAdminAtom);
```

#### `usernameAtom`
**Type:** Derived atom (read-only)
**Returns:** `string`
**Description:** Returns the current user's username or empty string.

```javascript
const username = useAtomValue(usernameAtom);
```

---

### Action Atom

#### `authActionsAtom`
**Type:** Write-only atom
**Description:** Provides authentication action functions.

**Available Actions:**

##### `login(userData)`
Sets the user data after successful authentication.
```javascript
const { login } = useSetAtom(authActionsAtom);
login({ username: 'john', role: 'admin' });
```

##### `logout()`
Clears all user data (sets to null).
```javascript
const { logout } = useSetAtom(authActionsAtom);
logout();
```

##### `updateUser(updates)`
Updates specific user fields while preserving others.
```javascript
const { updateUser } = useSetAtom(authActionsAtom);
updateUser({ email: 'newemail@example.com' });
```

---

## 🔧 Usage Examples

### Example 1: Login Component

```javascript
import { useSetAtom } from "jotai";
import { authActionsAtom } from "../atoms/authAtoms";

const Login = () => {
  const { login } = useSetAtom(authActionsAtom);

  const handleLogin = async (credentials) => {
    const response = await axios.post('/api/login', credentials);
    login(response.data.user); // Update global state
  };

  // ... rest of component
};
```

### Example 2: Navbar Component

```javascript
import { useAtomValue, useSetAtom } from "jotai";
import { isLoggedInAtom, isAdminAtom, usernameAtom, authActionsAtom } from "../atoms/authAtoms";

const Navbar = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const isAdmin = useAtomValue(isAdminAtom);
  const username = useAtomValue(usernameAtom);
  const { logout } = useSetAtom(authActionsAtom);

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <span>Welcome, {username}</span>
          {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};
```

### Example 3: Protected Route

```javascript
import { useAtomValue } from "jotai";
import { isAdminAtom } from "../atoms/authAtoms";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin }) => {
  const isAdmin = useAtomValue(isAdminAtom);

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};
```

### Example 4: Any Component Needing User Info

```javascript
import { useAtomValue } from "jotai";
import { userAtom, isLoggedInAtom } from "../atoms/authAtoms";

const UserProfile = () => {
  const user = useAtomValue(userAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  if (!isLoggedIn) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Role: {user.role}</p>
    </div>
  );
};
```

---

## 🎨 Benefits of This Approach

### 1. **No Prop Drilling**
Access auth state from any component without passing props through multiple levels.

### 2. **Automatic Synchronization**
All components using the same atom automatically re-render when the state changes.

### 3. **Persistent State**
Uses `atomWithStorage` to persist authentication state in localStorage.

### 4. **Type Safety Ready**
Easy to add TypeScript types for better developer experience.

### 5. **Derived State**
Computed values (like `isAdmin`) are automatically updated when the source changes.

### 6. **Centralized Logic**
All auth-related state logic is in one place, making it easier to maintain.

---

## 🚀 Future Enhancements

Here are some potential additions for future features:

### 1. **Cart Atom**
```javascript
export const cartAtom = atomWithStorage('cart', []);
export const cartItemCountAtom = atom((get) => get(cartAtom).length);
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
});
```

### 2. **Wishlist Atom**
```javascript
export const wishlistAtom = atomWithStorage('wishlist', []);
```

### 3. **Theme Atom**
```javascript
export const themeAtom = atomWithStorage('theme', 'light');
```

### 4. **User Preferences Atom**
```javascript
export const userPreferencesAtom = atomWithStorage('preferences', {
  notifications: true,
  emailUpdates: false,
  language: 'en',
});
```

### 5. **Search History Atom**
```javascript
export const searchHistoryAtom = atomWithStorage('searchHistory', []);
```

---

## 📚 Learn More

- [Jotai Documentation](https://jotai.org/)
- [Jotai Utils - atomWithStorage](https://jotai.org/docs/utilities/storage)
- [Derived Atoms](https://jotai.org/docs/core/atom#derived-atoms)
- [Write-only Atoms](https://jotai.org/docs/core/atom#write-only-atoms)

---

## 🛠️ Best Practices

1. **Use `useAtomValue` for read-only access** - More performant than `useAtom`
2. **Use `useSetAtom` for write-only access** - Avoids unnecessary re-renders
3. **Keep atoms focused** - One atom should manage one piece of state
4. **Use derived atoms** - For computed values instead of duplicating logic
5. **Document atom purpose** - Add comments explaining what each atom does
6. **Test with DevTools** - Use Jotai DevTools for debugging

---

## 📝 Notes

- The `userAtom` uses `atomWithStorage` which syncs with localStorage
- Derived atoms automatically update when their dependencies change
- Actions in `authActionsAtom` provide a clean API for state mutations
- All atoms are exported from a single file for easy imports
