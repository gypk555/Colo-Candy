# Colo-Candy Backend API

Complete backend implementation for Colo-Candy e-commerce with authentication and user profile management.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start server
npm run dev
```

Server runs on: **http://localhost:10000**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **FINAL_SUMMARY.md** | ⭐ **START HERE** - Complete overview |
| **SETUP_AND_TESTING.md** | Setup guide + Postman testing |
| **BACKEND_IMPLEMENTATION_COMPLETE.md** | Detailed feature documentation |
| **Colo-Candy-API.postman_collection.json** | API test collection |

---

## ✨ Features

### ✅ Password Management
- Forgot password with OTP
- OTP verification
- Password reset
- Password change

### ✅ User Profile
- Update phone number
- Update email
- Save/update address
- Upload profile image

### ✅ Google OAuth
- Login with Google
- Signup with Google
- Automatic profile setup

### ✅ Security
- Password hashing (bcryptjs)
- OTP hashing
- JWT tokens
- Input validation
- Error handling

---

## 📋 API Endpoints (12 Total)

### Authentication
- `POST /auth/forgot-password` - Request OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password
- `POST /auth/change-password` - Change password
- `GET /auth/google-auth-url` - Get OAuth URL
- `POST /auth/google/callback` - OAuth callback

### User Profile
- `GET /user/profile` - Get profile
- `PUT /user/phone` - Update phone
- `PUT /user/email` - Update email
- `POST /user/address` - Save address
- `POST /user/upload-profile-image` - Upload image

### Health
- `GET /health` - Server status

---

## 🔧 Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/colo-candy

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Server
PORT=10000
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Testing

### With Postman
1. Import `Colo-Candy-API.postman_collection.json`
2. Configure variables
3. Run endpoints

See `SETUP_AND_TESTING.md` for detailed instructions.

---

## 📊 Project Structure

```
src/
├── controllers/
│   ├── passwordController.js
│   ├── userProfileController.js
│   ├── oauthController.js
│   └── ...
├── models/
│   ├── User.js
│   ├── PasswordReset.js
│   └── ...
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── ...
├── middleware/
│   ├── authMiddleware.js
│   ├── validation.js
│   └── errorHandler.js
├── services/
│   └── emailService.js
├── utils/
│   └── logger.js
└── server.js
```

---

## 🔐 Security Features

✅ Password hashing with bcryptjs
✅ OTP hashing and expiration
✅ JWT token verification
✅ Input validation and sanitization
✅ File upload validation
✅ Session-based authentication
✅ CORS properly configured
✅ Error handling with no sensitive data exposure

---

## 📧 Email Configuration

### Gmail (Recommended)
1. Enable 2-Factor Authentication
2. Generate App Password
3. Add to `.env`

See `SETUP_AND_TESTING.md` for detailed steps.

---

## 🗄️ Database

### MongoDB
- Users collection
- Password resets collection
- Automatic indexes

### Setup Options
- Local MongoDB: `mongodb://localhost:27017/colo-candy`
- MongoDB Atlas: Cloud database with automatic backups

---

## 💾 Installation

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production server
npm start
```

---

## 📝 Features Implemented

| Feature | Status | Controller |
|---------|--------|-----------|
| Forgot Password | ✅ | passwordController.js |
| OTP Verification | ✅ | passwordController.js |
| Password Reset | ✅ | passwordController.js |
| Change Password | ✅ | passwordController.js |
| Update Phone | ✅ | userProfileController.js |
| Update Email | ✅ | userProfileController.js |
| Save Address | ✅ | userProfileController.js |
| Upload Image | ✅ | userProfileController.js |
| Google OAuth | ✅ | oauthController.js |
| Authentication Middleware | ✅ | authMiddleware.js |
| Input Validation | ✅ | validation.js |
| Error Handling | ✅ | errorHandler.js |
| Logging | ✅ | logger.js |

---

## 🚀 Deployment

See `SETUP_AND_TESTING.md` for deployment configuration.

### Production Checklist
- [ ] Change JWT_SECRET
- [ ] Update FRONTEND_URL
- [ ] Use production MongoDB
- [ ] Configure email service
- [ ] Setup HTTPS
- [ ] Enable rate limiting
- [ ] Setup monitoring

---

## 📞 Support

For issues or questions:
1. Check `SETUP_AND_TESTING.md` - Troubleshooting section
2. Check `BACKEND_IMPLEMENTATION_COMPLETE.md` - Detailed docs
3. Review error messages in logs
4. Check Postman collection for endpoint examples

---

## 📜 License

MIT

---

## 👥 Contributors

Colo-Candy Development Team

---

**Last Updated:** January 2024

For complete documentation, see **FINAL_SUMMARY.md**
