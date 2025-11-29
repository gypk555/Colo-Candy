# Component Reference Guide

## Complete Component Structure

### 1. UserProfileOverlay Component
**Path**: `src/components/UserProfileOverlay/UserProfileOverlay.js`

**Props**:
```typescript
interface UserProfileOverlayProps {
  isOpen: boolean          // Controls visibility
  onClose: () => void      // Callback to close overlay
}
```

**Features**:
- Profile header with user image/icon
- User full name display
- Three menu options (Settings, Orders, Logout)
- Click-outside detection to close
- Semi-transparent overlay background
- Responsive positioning

**State Management**:
- Uses Jotai atoms: `userProfileImageAtom`, `userFullNameAtom`
- Uses Setters: `logoutAtom`
- Uses Values: `cartAtom`, `cartDirtyAtom`

**Key Methods**:
- `handleNavigation(path)` - Navigate and close overlay
- `handleLogout()` - Logout with cart sync
- `useEffect` - Click-outside detection

### 2. Settings Page Component
**Path**: `src/components/pages/Settings/Settings.js`

**Features**:
- Tabbed interface with sidebar navigation
- 5 different settings tabs
- Protected route (requires login)
- Responsive design for mobile and desktop

**Tabs**:
1. Profile Picture (📷)
2. Phone Number (📞)
3. Email Address (📧)
4. Change Password (🔒)
5. Save Address (📍)

**State Management**:
- `activeTab` - Currently selected tab
- Jotai atom check: `isLoggedInAtom`

**Key Methods**:
- `handleNavigation(path)` - Redirect if not logged in
- Tab switching via button clicks

### 3. ProfilePictureUpload Component
**Path**: `src/components/pages/ProfilePictureUpload/ProfilePictureUpload.js`

**State**:
```javascript
{
  previewImage: String | null,    // Image preview URL
  selectedFile: File | null,       // Selected file object
  loading: Boolean,                // Upload in progress
  error: String,                   // Error message
  success: String                  // Success message
}
```

**Features**:
- File input with hidden native input
- Image preview area
- File validation:
  - Type: JPG, PNG, GIF, WebP
  - Size: Max 5MB
- Upload and cancel buttons
- Requirements info box

**Key Methods**:
- `handleFileSelect(e)` - Process selected file
- `handleUpload()` - Upload to backend
- `handleRemoveImage()` - Clear selection

**API Call**:
```javascript
uploadProfileImage(selectedFile)
```

### 4. UpdatePhone Component
**Path**: `src/components/pages/UpdatePhone/UpdatePhone.js`

**State**:
```javascript
{
  phone: String,           // New phone number
  loading: Boolean,        // API call in progress
  error: String,           // Error message
  success: String          // Success message
}
```

**Features**:
- Current phone display (read-only)
- New phone input with 10-digit validation
- Real-time input formatting
- Success/error feedback

**Validation Rules**:
- Must be 10 digits
- Must be different from current
- Only numbers allowed

**API Call**:
```javascript
updatePhone(phone)
```

### 5. UpdateEmail Component
**Path**: `src/components/pages/UpdateEmail/UpdateEmail.js`

**State**:
```javascript
{
  email: String,           // New email address
  loading: Boolean,        // API call in progress
  error: String,           // Error message
  success: String          // Success message
}
```

**Features**:
- Current email display (read-only)
- New email input with format validation
- Email format validation
- Duplicate check (can't use same email)

**Validation Rules**:
- Must be valid email format
- Must be different from current
- RFC 5322 compliant

**API Call**:
```javascript
updateEmail(email)
```

### 6. ChangePassword Component
**Path**: `src/components/pages/ChangePassword/ChangePassword.js`

**State**:
```javascript
{
  oldPassword: String,              // Current password
  newPassword: String,              // New password
  confirmPassword: String,          // Confirmation
  showPasswords: {
    old: Boolean,
    new: Boolean,
    confirm: Boolean
  },
  loading: Boolean,                 // API call in progress
  error: String,                    // Error message
  success: String                   // Success message
}
```

**Features**:
- Three password fields
- Password visibility toggle for each field
- Real-time validation
- Success auto-clears fields

**Validation Rules**:
- Current password required
- New password min 6 characters
- New and confirm must match
- New must be different from old

**API Call**:
```javascript
changePassword(oldPassword, newPassword)
```

### 7. UpdateAddress Component
**Path**: `src/components/pages/UpdateAddress/UpdateAddress.js`

**State**:
```javascript
{
  address: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,        // Auto-filled: "India"
    type: 'home' | 'work' | 'other'
  },
  loading: Boolean,         // API call in progress
  error: String,            // Error message
  success: String           // Success message
}
```

**Features**:
- Comprehensive address form
- 8 input fields
- Address type radio buttons
- Grid layout for City/State and ZipCode/Country

**Validation Rules**:
- All fields required
- Phone: 10 digits
- ZipCode: 6 digits
- Format: Street address pattern

**API Call**:
```javascript
saveAddress(address)
```

### 8. ForgotPassword Component
**Path**: `src/components/pages/ForgotPassword/ForgotPassword.js`

**State**:
```javascript
{
  step: 1 | 2 | 3,          // Current step
  email: String,            // User email
  otp: String,              // 6-digit OTP
  newPassword: String,      // New password
  confirmPassword: String,  // Confirmation password
  loading: Boolean,         // API call in progress
  error: String,            // Error message
  success: String,          // Success message
  resetToken: String        // JWT token from OTP verification
}
```

**Features**:
- 3-step process with visual indicator
- Step 1: Email request
- Step 2: OTP verification
- Step 3: New password
- Back button on each step
- Auto-redirect to login on success

**API Calls**:
```javascript
requestPasswordResetOTP(email)
verifyPasswordResetOTP(email, otp)
resetPassword(email, otp, newPassword, resetToken)
```

### 9. Updated Login Component
**Path**: `src/components/pages/Login/Login.js`

**New Features**:
- "Forgot Password?" link
- "Sign up with Google" button
- Divider with "OR" text
- Improved layout

**New Methods**:
```javascript
// Google OAuth
const googleAuthURL = getGoogleAuthURL();
window.location.href = googleAuthURL;
```

### 10. Updated Register Component
**Path**: `src/components/pages/Register/Register.js`

**New Features**:
- "Sign up with Google" button
- Divider with "OR" text
- Better UI consistency

**New Methods**:
```javascript
// Google OAuth
const googleAuthURL = getGoogleAuthURL();
window.location.href = googleAuthURL;
```

### 11. Updated Navbar Component
**Path**: `src/components/Navbar/Navbar.js`

**New Features**:
- Profile button with image/icon
- UserProfileOverlay integration
- Profile state management
- Logout with cart sync

**New State**:
```javascript
{
  isProfileOpen: Boolean      // Profile menu visibility
}
```

**New Props Used**:
- `userProfileImageAtom` - User's profile image URL

## Data Flow Diagram

```
User Action
    ↓
Component State Update
    ↓
Form Submission
    ↓
API Call (authService.js)
    ↓
Backend Response
    ↓
Jotai Atom Update (updateUserAtom)
    ↓
Component Re-render
    ↓
User Feedback (Success/Error)
```

## Jotai Atom Flow

```
userAtom (base)
    ├─→ userProfileImageAtom (derived)
    ├─→ userEmailAtom (derived)
    ├─→ userPhoneAtom (derived)
    ├─→ userAddressAtom (derived)
    ├─→ userFullNameAtom (derived)
    └─→ updateUserAtom (action)
```

## API Service Layer

**File**: `src/services/authService.js`

**Functions**:
```javascript
// Password Reset
requestPasswordResetOTP(email)
verifyPasswordResetOTP(email, otp)
resetPassword(email, otp, newPassword, resetToken)

// Logged-in Operations
changePassword(oldPassword, newPassword)
updateProfile(updates)
updatePhone(phone)
updateEmail(email)
saveAddress(address)
uploadProfileImage(file)

// OAuth
getGoogleAuthURL()
exchangeGoogleCode(code)
```

## Protected Routes

**Routes**:
1. `/settings` - Account settings (protected)
2. `/orders` - Orders page (protected)

**Protection Method**:
```javascript
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```

## Form Validation Patterns

### Email Validation
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Phone Validation (India)
```javascript
const phoneRegex = /^[0-9]{10}$/;
```

### Zip Code Validation
```javascript
const zipCodeRegex = /^[0-9]{6}$/;
```

### OTP Validation
```javascript
// 6-digit number
maxLength="6"
pattern="[0-9]{6}"
```

## Error Handling Pattern

```javascript
try {
  const result = await apiFunction();
  if (result.success) {
    setSuccess(result.message);
    // Update atom
    updateUser({ field: value });
    setTimeout(() => setSuccess(''), 3000);
  } else {
    setError(result.message);
  }
} catch (err) {
  setError('Failed to perform action');
} finally {
  setLoading(false);
}
```

## Loading State Pattern

```javascript
<button
  disabled={loading}
  className="... disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  {loading ? 'Processing...' : 'Submit'}
</button>
```

## Component Hierarchy

```
App
├── Navbar
│   ├── UserProfileOverlay
│   │   ├── Settings Link
│   │   ├── Orders Link
│   │   └── Logout Button
│   └── Profile Button
├── Routes
│   ├── /settings
│   │   └── Settings
│   │       ├── ProfilePictureUpload
│   │       ├── UpdatePhone
│   │       ├── UpdateEmail
│   │       ├── ChangePassword
│   │       └── UpdateAddress
│   ├── /forgot-password
│   │   └── ForgotPassword
│   ├── /login
│   │   └── Login (with Google button)
│   └── /register
│       └── Register (with Google button)
└── Footer
```

## File Structure

```
src/
├── atoms/
│   └── authAtoms.js (extended)
├── components/
│   ├── Navbar/ (updated)
│   ├── UserProfileOverlay/
│   │   └── UserProfileOverlay.js
│   └── pages/
│       ├── Login/ (updated)
│       ├── Register/ (updated)
│       ├── Settings/
│       │   └── Settings.js
│       ├── ForgotPassword/
│       │   └── ForgotPassword.js
│       ├── ProfilePictureUpload/
│       │   └── ProfilePictureUpload.js
│       ├── UpdatePhone/
│       │   └── UpdatePhone.js
│       ├── UpdateEmail/
│       │   └── UpdateEmail.js
│       ├── ChangePassword/
│       │   └── ChangePassword.js
│       └── UpdateAddress/
│           └── UpdateAddress.js
└── services/
    └── authService.js (new)
```

## Configuration Requirements

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
```

### API Base URL
- Configured in `authService.js`
- Uses `process.env.REACT_APP_API_URL`
- Fallback: `http://localhost:5000`

## Performance Optimization

### Memoization
```javascript
// Not required for these components as they're route-based
// Consider using React.memo for frequently re-rendered overlays
const UserProfileOverlay = React.memo(({ isOpen, onClose }) => {...})
```

### Code Splitting
```javascript
// Components are lazy-loaded via routes
const Settings = lazy(() => import('./pages/Settings/Settings'))
```

## Accessibility Features

- Proper form labels
- Input placeholders
- Error messages linked to inputs
- Keyboard navigation support
- ARIA labels where needed
- Focus management on modals

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

This reference guide covers all components, their props, state, and API interactions for the user profile feature implementation.
