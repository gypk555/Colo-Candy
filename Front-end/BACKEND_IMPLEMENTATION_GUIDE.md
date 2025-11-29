# Backend Implementation Guide for User Profile Features

## Overview
This guide provides detailed specifications for implementing the backend APIs required for the user profile and authentication features.

## 1. Password Reset Flow

### 1.1 Request OTP
**Endpoint**: `POST /auth/forgot-password`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "User not found with this email"
}
```

**Backend Logic**:
1. Validate email format
2. Check if user exists with this email
3. Generate 6-digit random OTP
4. Set OTP expiration (10-15 minutes)
5. Store OTP in database (don't expose to frontend)
6. Send OTP via email using nodemailer/SendGrid
7. Return success message

**Database Schema**:
```javascript
// PasswordReset collection
{
  _id: ObjectId,
  userId: ObjectId,
  email: String,
  otp: String (hashed),
  token: String,
  expiresAt: Date,
  attempts: Number (max 3),
  createdAt: Date,
  verified: Boolean
}
```

### 1.2 Verify OTP
**Endpoint**: `POST /auth/verify-otp`

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "jwt_token_for_password_reset"
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Backend Logic**:
1. Find OTP record by email
2. Check if OTP has expired
3. Check if OTP matches (compare hashed values)
4. Check attempt count (max 3 failures)
5. If correct: Generate reset token (JWT), mark as verified
6. If incorrect: Increment attempt count, return error
7. Return token with short expiration (5-10 minutes)

### 1.3 Reset Password
**Endpoint**: `POST /auth/reset-password`

**Headers**:
```
Authorization: Bearer <reset_token>
```

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Invalid token or OTP"
}
```

**Backend Logic**:
1. Verify reset token (JWT)
2. Check token hasn't expired
3. Verify OTP again for double-check
4. Validate password strength (min 8 chars, complexity)
5. Hash new password using bcrypt
6. Update user password in database
7. Delete OTP record
8. Invalidate all existing sessions/tokens (optional)
9. Return success message

## 2. Logged-In User Operations

### 2.1 Change Password
**Endpoint**: `POST /auth/change-password`

**Headers**:
```
Authorization: Bearer <auth_token>
Content-Type: application/json
```

**Request**:
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Backend Logic**:
1. Extract userId from auth token
2. Fetch user from database
3. Compare oldPassword with stored hash
4. Validate newPassword strength
5. Hash new password
6. Update user password
7. Log password change for audit
8. Return success message

### 2.2 Update Phone Number
**Endpoint**: `PUT /user/phone`

**Headers**:
```
Authorization: Bearer <auth_token>
```

**Request**:
```json
{
  "phone": "9876543210"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Phone number updated successfully",
  "user": {
    "id": "user_id",
    "phone": "9876543210",
    ...
  }
}
```

**Backend Logic**:
1. Validate phone format (10 digits for India)
2. Update user.phone in database
3. Return updated user object

### 2.3 Update Email Address
**Endpoint**: `PUT /user/email`

**Headers**:
```
Authorization: Bearer <auth_token>
```

**Request**:
```json
{
  "email": "newemail@example.com"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Email updated successfully",
  "user": {
    "id": "user_id",
    "email": "newemail@example.com",
    ...
  }
}
```

**Optional**: Send verification email to new address

**Backend Logic**:
1. Validate email format
2. Check if email already exists (for another user)
3. (Optional) Send verification email
4. Update user.email in database
5. Return updated user object

### 2.4 Save/Update Address
**Endpoint**: `POST /user/address`

**Headers**:
```
Authorization: Bearer <auth_token>
```

**Request**:
```json
{
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "100001",
  "country": "India",
  "type": "home"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Address saved successfully",
  "address": { /* saved address object */ },
  "user": { /* updated user object */ }
}
```

**Backend Logic**:
1. Validate all required fields
2. Validate phone number (10 digits)
3. Validate zip code format (6 digits)
4. Save address to user.address field
5. (Optional) Store multiple addresses with addresses array
6. Return saved address and updated user

### 2.5 Upload Profile Image
**Endpoint**: `POST /user/upload-profile-image`

**Headers**:
```
Authorization: Bearer <auth_token>
Content-Type: multipart/form-data
```

**Request**:
```
Form Data:
- profileImage: [file]
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "profileImage": "https://cdn.example.com/profile/user123.jpg",
  "user": { /* updated user object */ }
}
```

**Backend Logic**:
1. Validate file type (jpg, png, gif, webp only)
2. Validate file size (max 5MB)
3. Upload to cloud storage (AWS S3, Cloudinary, etc.)
4. Get returned URL
5. Update user.profileImage with URL
6. (Optional) Delete old image from storage
7. Return new image URL and updated user

## 3. Google OAuth Integration

### 3.1 Get Authorization URL
**Frontend uses**: `https://accounts.google.com/o/oauth2/v2/auth`

**Parameters**:
```
client_id: YOUR_GOOGLE_CLIENT_ID
redirect_uri: http://localhost:3000/auth/google/callback
response_type: code
scope: openid email profile
```

### 3.2 Handle OAuth Callback
**Endpoint**: `POST /auth/google/callback`

**Request**:
```json
{
  "code": "google_authorization_code"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Google login successful",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "role": "user",
    ...
  }
}
```

**Backend Logic**:
1. Exchange authorization code for access token
   ```javascript
   POST https://oauth2.googleapis.com/token
   {
     code: auth_code,
     client_id: YOUR_CLIENT_ID,
     client_secret: YOUR_CLIENT_SECRET,
     redirect_uri: YOUR_REDIRECT_URI,
     grant_type: "authorization_code"
   }
   ```

2. Fetch user info from Google
   ```javascript
   GET https://www.googleapis.com/oauth2/v1/userinfo
   Headers: Authorization: Bearer access_token
   ```

3. Check if user exists by email
4. If exists: Return user (or merge with local cart)
5. If not exists: Create new user with Google info
6. Generate JWT token
7. Return user and token

**New User Creation**:
```javascript
{
  username: generateFromEmail(email),
  email: googleUser.email,
  fullname: googleUser.name,
  profileImage: googleUser.picture,
  password: null (or generate random),
  role: "user",
  googleId: googleUser.id,
  createdAt: new Date()
}
```

## 4. Email Service Integration

### Setup with Nodemailer

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP Email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP - Colo-Candy',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP for password reset is:</p>
      <h1 style="color: #2563eb;">${otp}</h1>
      <p>This OTP will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  return transporter.sendMail(mailOptions);
}
```

## 5. Database Schema

### Extended User Schema

```javascript
// User collection
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (bcrypt hash),
  fullname: String,
  phone: String,
  profileImage: String (URL),
  role: String ('user' | 'admin'),

  // New fields
  address: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    type: String ('home' | 'work' | 'other')
  },

  // OAuth
  googleId: String,
  facebookId: String,

  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,

  // Verification
  emailVerified: Boolean,
  emailVerificationToken: String,

  // 2FA (future)
  twoFactorEnabled: Boolean,
  twoFactorSecret: String
}
```

### Password Reset Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  email: String,
  otp: String (bcrypt hash),
  otpAttempts: Number,
  token: String (JWT),
  expiresAt: Date,
  createdAt: Date,
  verified: Boolean
}
```

## 6. Security Best Practices

### Password Hashing
```javascript
const bcrypt = require('bcryptjs');

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Compare password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### OTP Generation
```javascript
// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP before storing
const hashedOTP = await bcrypt.hash(otp, 10);
```

### JWT Token Generation
```javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (error) {
  // Token invalid or expired
}
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 7. Rate Limiting

### Prevent OTP Abuse
```javascript
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many OTP requests, please try again later'
});

app.post('/auth/forgot-password', otpLimiter, forgotPasswordHandler);
```

## 8. Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/colo-candy

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Cloud Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=colo-candy-images

# App
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## 9. Testing Endpoints

### Using Postman

1. **Test Forgot Password**:
   - POST `/auth/forgot-password`
   - Body: `{ "email": "user@example.com" }`

2. **Test Verify OTP**:
   - POST `/auth/verify-otp`
   - Body: `{ "email": "user@example.com", "otp": "123456" }`

3. **Test Reset Password**:
   - POST `/auth/reset-password`
   - Headers: `Authorization: Bearer <token>`
   - Body: `{ "email": "user@example.com", "otp": "123456", "newPassword": "new123" }`

4. **Test Update Phone**:
   - PUT `/user/phone`
   - Headers: `Authorization: Bearer <auth_token>`
   - Body: `{ "phone": "9876543210" }`

## 10. Troubleshooting

### Common Issues

1. **OTP not received**: Check email configuration, spam folder
2. **Google OAuth fails**: Verify client ID, redirect URI, CORS settings
3. **Image upload fails**: Check file size, type, cloud storage credentials
4. **Password reset token expires**: Increase JWT expiration if needed

### Logging

```javascript
logger.info('OTP sent to:', email);
logger.error('Password reset failed:', error);
logger.warn('Suspicious activity:', userId, attempts);
```

---

## Implementation Checklist

- [ ] Set up Google OAuth credentials
- [ ] Configure email service (Nodemailer/SendGrid)
- [ ] Create password reset flow
- [ ] Implement OTP generation and validation
- [ ] Set up cloud storage for images
- [ ] Create database schemas
- [ ] Implement rate limiting
- [ ] Add error handling and logging
- [ ] Set up CORS properly
- [ ] Test all endpoints
- [ ] Deploy to production
