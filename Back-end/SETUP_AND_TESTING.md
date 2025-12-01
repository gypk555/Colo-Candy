# Backend Setup & Testing Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd Back-end
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `.env` with your settings:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/colo-candy

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server
PORT=10000
FRONTEND_URL=http://localhost:3000
```

### 4. Start Backend
```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected
🚀 Server running on port 10000
```

---

## 📧 Gmail Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication
1. Go to Google Account (myaccount.google.com)
2. Select "Security" on the left
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to "App passwords" (search in Security section)
2. Select "Mail" and "Windows Computer"
3. Google generates a 16-character password
4. Copy this password to `.env` as `EMAIL_PASSWORD`

### Step 3: Test Email
```javascript
// The email service will automatically work once configured
```

---

## 🔑 Google OAuth Setup (10 minutes)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Colo-Candy"
3. Wait for project creation

### Step 2: Enable Google+ API
1. Search for "Google+ API"
2. Click "Enable"

### Step 3: Create OAuth Credentials
1. Go to "Credentials" → "Create Credentials"
2. Select "OAuth client ID"
3. Application type: "Web application"
4. Add Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `http://your-domain.com/auth/google/callback` (for production)

### Step 4: Copy Credentials
1. Copy "Client ID" → `.env` as `GOOGLE_CLIENT_ID`
2. Copy "Client Secret" → `.env` as `GOOGLE_CLIENT_SECRET`

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB (if not already installed)
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

### Option 2: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Create database user
5. Get connection string
6. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/colo-candy
   ```

---

## 🧪 Testing with Postman

### Step 1: Import Collection
1. Open Postman
2. Click "Import" button
3. Select file: `Colo-Candy-API.postman_collection.json`
4. Collection imported successfully

### Step 2: Configure Environment
1. Click "Environments" on left sidebar
2. Create new environment: "Colo-Candy"
3. Add variables:
   ```
   BASE_URL: http://localhost:10000
   RESET_TOKEN: (will be filled during testing)
   ```

### Step 3: Test Health Check
```
GET http://localhost:10000/health

Expected Response:
{
  "status": "Server running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.234
}
```

---

## 🔐 Testing Password Reset Flow

### Test 1: Request OTP
```
POST http://localhost:10000/auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "test@example.com"
}

Expected Response:
{
  "success": true,
  "message": "OTP sent to your email"
}

✅ Check your email for OTP
```

### Test 2: Verify OTP
```
POST http://localhost:10000/auth/verify-otp
Content-Type: application/json

Body:
{
  "email": "test@example.com",
  "otp": "123456" (from email)
}

Expected Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

✅ Copy token to RESET_TOKEN variable in Postman
```

### Test 3: Reset Password
```
POST http://localhost:10000/auth/reset-password
Authorization: Bearer {{RESET_TOKEN}}
Content-Type: application/json

Body:
{
  "email": "test@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}

Expected Response:
{
  "success": true,
  "message": "Password reset successfully"
}

✅ Now login with new password
```

---

## 👤 Testing User Profile Features

### Test 1: Get Profile
```
GET http://localhost:10000/user/profile

Expected Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNo": "9876543210",
    ...
  }
}
```

### Test 2: Update Phone
```
PUT http://localhost:10000/user/phone
Content-Type: application/json

Body:
{
  "phone": "9876543210"
}

Expected Response:
{
  "success": true,
  "message": "Phone number updated successfully",
  "user": { ... }
}
```

### Test 3: Update Email
```
PUT http://localhost:10000/user/email
Content-Type: application/json

Body:
{
  "email": "newemail@example.com"
}

Expected Response:
{
  "success": true,
  "message": "Email updated successfully"
}
```

### Test 4: Save Address
```
POST http://localhost:10000/user/address
Content-Type: application/json

Body:
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

Expected Response:
{
  "success": true,
  "message": "Address saved successfully",
  "address": { ... }
}
```

### Test 5: Upload Profile Image
```
POST http://localhost:10000/user/upload-profile-image
Content-Type: multipart/form-data

Body (form-data):
- Key: profileImage
- Value: (select image file)

Expected Response:
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "profileImage": "data:image/jpeg;base64,..."
}
```

---

## 🔐 Testing Password Change

```
POST http://localhost:10000/auth/change-password
Content-Type: application/json

Body:
{
  "oldPassword": "currentPassword123",
  "newPassword": "newPassword456"
}

Expected Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🔵 Testing Google OAuth

### Step 1: Get OAuth URL
```
GET http://localhost:10000/auth/google-auth-url

Expected Response:
{
  "success": true,
  "authURL": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### Step 2: Login with Google
1. Open the authURL in browser
2. Google login page opens
3. Authorize access
4. Redirected to frontend callback
5. Frontend sends authorization code to backend

### Step 3: Callback
```
POST http://localhost:10000/auth/google/callback
Content-Type: application/json

Body:
{
  "code": "GOOGLE_AUTH_CODE_FROM_REDIRECT"
}

Expected Response:
{
  "success": true,
  "message": "Google login successful",
  "user": { ... }
}
```

---

## 🧪 Full Integration Test

### Complete User Journey:
1. ✅ Start server: `npm run dev`
2. ✅ Health check endpoint
3. ✅ Forgot password → Request OTP
4. ✅ Verify OTP → Get reset token
5. ✅ Reset password → New password
6. ✅ Login with new password (frontend)
7. ✅ Get profile
8. ✅ Update phone number
9. ✅ Update email
10. ✅ Save address
11. ✅ Upload profile picture
12. ✅ Change password
13. ✅ Logout

---

## ⚠️ Troubleshooting

### Issue: "MongoDB Connection Error"
**Solution:**
1. Check MongoDB is running: `mongod`
2. Check connection string in `.env`
3. Use MongoDB Atlas for cloud solution

### Issue: "Email not sending"
**Solution:**
1. Verify Gmail credentials in `.env`
2. Use app password (not main password)
3. Allow less secure apps if using regular password
4. Check firewall/network

### Issue: "Google OAuth fails"
**Solution:**
1. Verify Client ID and Secret
2. Check redirect URI exactly matches
3. Make sure Google+ API is enabled
4. Check CORS configuration

### Issue: "Session not persisting"
**Solution:**
1. Make sure frontend sends credentials: true
2. Check CORS allows credentials
3. Verify session middleware configured

### Issue: "File upload fails"
**Solution:**
1. Check file is image type
2. Check file size < 5MB
3. Check form-data Content-Type
4. Verify multer middleware

---

## 📊 Expected Response Times

| Endpoint | Time |
|----------|------|
| Health Check | < 10ms |
| Send OTP | 500-1000ms (email) |
| Verify OTP | < 100ms |
| Password Reset | < 100ms |
| Update Profile | < 100ms |
| Upload Image | < 500ms |

---

## 🔍 Checking Logs

### Monitor Backend Logs
```bash
# Terminal where backend is running shows:
[INFO] Email sent: messageId
[AUTH] User logged in
[API] POST /auth/forgot-password - 200 (45ms)
```

### Check MongoDB Data
```bash
# Connect to MongoDB
mongo colo-candy

# View users
db.users.find()

# View password resets
db.passwordresets.find()
```

---

## 📝 Testing Checklist

- [ ] Backend starts without errors
- [ ] Health check responds
- [ ] MongoDB connected
- [ ] Email service configured
- [ ] Forgot password works
- [ ] OTP email received
- [ ] OTP verification works
- [ ] Password reset works
- [ ] Can login with new password
- [ ] Profile endpoints work
- [ ] Phone update works
- [ ] Email update works
- [ ] Address save works
- [ ] Image upload works
- [ ] Password change works
- [ ] Google OAuth URL generates
- [ ] All Postman tests pass

---

## 🚀 Deployment Preparation

Before deploying to production:

1. **Environment Variables**
   - [ ] Change JWT_SECRET to random string
   - [ ] Update FRONTEND_URL to production domain
   - [ ] Use production MongoDB connection
   - [ ] Update Google OAuth redirect URIs

2. **Security**
   - [ ] Enable HTTPS
   - [ ] Setup rate limiting
   - [ ] Configure CORS properly
   - [ ] Use environment-specific configs

3. **Database**
   - [ ] Create indexes
   - [ ] Setup backups
   - [ ] Test data integrity

4. **Monitoring**
   - [ ] Setup error tracking
   - [ ] Setup performance monitoring
   - [ ] Setup uptime monitoring

---

## 📞 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Nodemailer Docs](https://nodemailer.com)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Postman Docs](https://learning.postman.com)

---

**Ready to test! 🧪**

Start the backend, open Postman, and test all endpoints! 🚀
