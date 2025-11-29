# User Profile and Authentication Features

## Overview
This document outlines the comprehensive user profile and authentication enhancements added to the Colo-Candy e-commerce application.

## Features Implemented

### 1. User Profile Picture Display (Navbar)
**Location**: `src/components/Navbar/Navbar.js`

**Functionality**:
- When logged in, a circular profile button appears in the navbar instead of the logout button
- Shows user's profile image if available, otherwise displays a profile icon (👤)
- Clicking the button opens the user profile menu overlay
- Profile picture is rounded and scaled on hover

### 2. User Profile Menu Overlay
**Component**: `src/components/UserProfileOverlay/UserProfileOverlay.js`

**Features**:
- Displays user's full name and profile picture
- Three main options:
  - ⚙️ Settings - Navigate to account settings
  - 📦 Orders - Navigate to orders page (placeholder)
  - 🚪 Logout - Logout user and sync cart before logging out
- Auto-closes when clicking outside overlay
- Beautiful gradient header with user info

### 3. Account Settings Page
**Component**: `src/components/pages/Settings/Settings.js`

**Structure**:
- Tabbed interface with 5 sections
- Left sidebar with tab navigation
- Main content area updates based on selected tab

**Available Settings Tabs**:

#### 3.1 Profile Picture (📷)
**Component**: `src/components/pages/ProfilePictureUpload/ProfilePictureUpload.js`

**Functionality**:
- Upload or change profile picture
- Image preview before upload
- File validation:
  - Accepts: JPG, PNG, GIF, WebP
  - Max size: 5MB
  - Recommended: Square image (1:1 ratio)
  - Minimum: 200x200 pixels
- Drag & drop or click to select
- Real-time preview

#### 3.2 Phone Number (📞)
**Component**: `src/components/pages/UpdatePhone/UpdatePhone.js`

**Functionality**:
- View current phone number (read-only)
- Update phone number with validation
- 10-digit phone number validation
- Shows current vs. new number
- Success/error notifications

#### 3.3 Email Address (📧)
**Component**: `src/components/pages/UpdateEmail/UpdateEmail.js`

**Functionality**:
- View current email (read-only)
- Update email with validation
- Email format validation
- Prevents duplicate email updates
- Success/error notifications

#### 3.4 Change Password (🔒)
**Component**: `src/components/pages/ChangePassword/ChangePassword.js`

**Functionality**:
- Three password fields:
  1. Current password (required for verification)
  2. New password (min 6 characters)
  3. Confirm password
- Password visibility toggle buttons
- Validations:
  - Passwords must match
  - New password must be different from old
  - Minimum 6 characters
- Success/error notifications

#### 3.5 Save Address (📍)
**Component**: `src/components/pages/UpdateAddress/UpdateAddress.js`

**Functionality**:
- Save or update delivery address
- Fields:
  - Full Name
  - Phone Number (10 digits)
  - Street Address
  - City
  - State
  - Zip Code (6 digits)
  - Country (auto-filled: India)
  - Address Type (Home/Work/Other)
- Full form validation
- Success/error notifications

### 4. Forgot Password Flow
**Component**: `src/components/pages/ForgotPassword/ForgotPassword.js`

**Three-Step Process**:

**Step 1: Email Request**
- User enters email address
- System sends OTP to registered email
- User sees confirmation message

**Step 2: OTP Verification**
- User enters 6-digit OTP
- OTP is verified with backend
- Success generates reset token
- Error shows message, allows retry

**Step 3: Password Reset**
- User enters new password
- Confirm password field
- Password requirements: min 6 characters
- Success redirects to login after 2 seconds
- Includes visual step indicator (1, 2, 3)
- Back button allows returning to previous steps

**Key Validations**:
- Email format validation
- OTP length validation (6 digits)
- Password length (min 6 characters)
- Password matching

### 5. Google OAuth Integration
**Login Page**: `src/components/pages/Login/Login.js`
**Register Page**: `src/components/pages/Register/Register.js`

**Functionality**:
- "Continue with Google" button on login page
- "Sign up with Google" button on register page
- Uses OAuth 2.0 authorization code flow
- Redirects to Google's authentication server
- Handles callback with auth code
- Seamless integration with existing login system

**Process**:
1. User clicks Google button
2. Redirected to `https://accounts.google.com/o/oauth2/v2/auth`
3. User authenticates with Google
4. Code exchanged at `/auth/google/callback`
5. Auto-login or account creation
6. Cart merge for existing users

### 6. Login Page Enhancements
**Location**: `src/components/pages/Login/Login.js`

**New Features**:
- "Forgot Password?" link - navigates to forgot password page
- "Sign up with Google" button with divider
- Better UI with links positioned at bottom
- Improved visual hierarchy

### 7. Register Page Enhancements
**Location**: `src/components/pages/Register/Register.js`

**New Features**:
- "Sign up with Google" button with divider
- Maintains existing validation
- Better UI consistency with login page

## API Integration Required

### Authentication Service (`src/services/authService.js`)

The following API endpoints need to be implemented on the backend:

```javascript
// Password Reset Flow
POST /auth/forgot-password
  Request: { email }
  Response: { message, success }

POST /auth/verify-otp
  Request: { email, otp }
  Response: { message, success, token }

POST /auth/reset-password
  Headers: Authorization: Bearer <token>
  Request: { email, otp, newPassword }
  Response: { message, success }

// Logged-in User Operations
POST /auth/change-password
  Headers: Authorization: Bearer <token>
  Request: { oldPassword, newPassword }
  Response: { message, success }

// Profile Updates
PUT /user/profile
  Headers: Authorization: Bearer <token>
  Request: { updates object }
  Response: { message, success, user }

PUT /user/phone
  Headers: Authorization: Bearer <token>
  Request: { phone }
  Response: { message, success, user }

PUT /user/email
  Headers: Authorization: Bearer <token>
  Request: { email }
  Response: { message, success, user }

POST /user/address
  Headers: Authorization: Bearer <token>
  Request: { address object }
  Response: { message, success, address, user }

POST /user/upload-profile-image
  Headers: Authorization: Bearer <token>
  Content-Type: multipart/form-data
  Body: { profileImage: file }
  Response: { message, success, user, profileImage }

// Google OAuth
POST /auth/google/callback
  Request: { code }
  Response: { message, success, user }
```

## Atom Structure (`src/atoms/authAtoms.js`)

**New Atoms**:
- `userProfileImageAtom` - Derived atom for user's profile image
- `userEmailAtom` - Derived atom for user's email
- `userPhoneAtom` - Derived atom for user's phone number
- `userAddressAtom` - Derived atom for user's saved address
- `userFullNameAtom` - Derived atom for user's full name

## User Data Structure

**Enhanced User Object** (stored in `userAtom`):
```javascript
{
  id: String,
  username: String,
  fullname: String,
  email: String,
  phone: String,
  profileImage: String (URL or base64),
  address: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    type: 'home' | 'work' | 'other'
  },
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables Required

```env
REACT_APP_API_URL=http://localhost:10000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FORGOT_PASSWORD_URL=/auth/forgot-password
REACT_APP_VERIFY_OTP_URL=/auth/verify-otp
REACT_APP_RESET_PASSWORD_URL=/auth/reset-password
```

## Routes Added

```
/forgot-password         → ForgotPassword component
/settings               → Settings page (protected)
/orders                 → Orders page (protected)
```

## Security Considerations

1. **Password Reset OTP**:
   - OTP should expire after 10-15 minutes
   - OTP should be single-use
   - Store OTP in backend, never expose to frontend

2. **Profile Image Upload**:
   - Validate file type on both frontend and backend
   - Limit file size (5MB max)
   - Store images securely
   - Use CDN for image serving

3. **Email Updates**:
   - Require verification before email change
   - Send confirmation email to both old and new addresses
   - Implement email confirmation token

4. **Phone Number**:
   - Validate format and length
   - Consider SMS verification for additional security

5. **Password Change**:
   - Require current password verification
   - Hash new password using bcrypt/similar
   - Log password change for security audit

6. **Google OAuth**:
   - Use PKCE flow for additional security
   - Validate state parameter
   - Store refresh tokens securely
   - Implement automatic token refresh

## UI/UX Highlights

1. **Visual Feedback**: All forms include success/error messages
2. **Input Validation**: Real-time validation with helpful error messages
3. **Loading States**: Disabled buttons during API calls
4. **Responsive Design**: Works on mobile, tablet, and desktop
5. **Accessibility**: Proper labels, placeholders, and keyboard navigation
6. **User Guidance**: Help text and requirements displayed for each field

## Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - SMS or email verification
   - Authenticator app support

2. **Profile Completion**:
   - Profile completion percentage
   - Suggested actions to complete profile

3. **Multiple Addresses**:
   - Save multiple addresses
   - Set default address
   - Address book management

4. **Password Strength Indicator**:
   - Real-time password strength feedback
   - Common password detection

5. **Social Login Providers**:
   - Facebook login
   - GitHub login
   - Apple sign-in

6. **Account Deletion**:
   - Safe account deletion process
   - Data retention options

7. **Login History**:
   - View recent logins
   - Device information
   - Session management
