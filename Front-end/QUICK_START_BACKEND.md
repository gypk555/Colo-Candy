# Quick Start Backend Implementation Guide

## 5-Minute Setup

### Step 1: Create Backend Project
```bash
mkdir colo-candy-backend
cd colo-candy-backend
npm init -y
npm install express cors dotenv mongoose bcryptjs jsonwebtoken nodemailer axios multer cloudinary
npm install -D nodemon
```

### Step 2: Create Basic Server

**File**: `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/colo-candy')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Test Route
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 3: Create .env File
```
MONGODB_URI=mongodb://localhost:27017/colo-candy
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
PORT=5000

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Step 4: Add npm Scripts
In `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 5: Run Server
```bash
npm run dev
# Navigate to http://localhost:5000/health
```

---

## Create First API: Forgot Password

### Step 1: Create User Model

**File**: `models/User.js`
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullname: String,
  phone: String,
  profileImage: String,
  address: {
    fullName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    type: String
  },
  googleId: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Step 2: Create Password Reset Model

**File**: `models/PasswordReset.js`
```javascript
const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpAttempts: { type: Number, default: 0 },
  token: String,
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});

// Auto-delete expired records
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
```

### Step 3: Create Email Service

**File**: `services/emailService.js`
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP - Colo-Candy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #2563eb; text-align: center; font-size: 48px; letter-spacing: 5px;">
          ${otp}
        </h1>
        <p style="color: #666;">This OTP will expire in 15 minutes.</p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
```

### Step 4: Create Auth Controller

**File**: `controllers/authController.js`
```javascript
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { sendOTPEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save OTP to database
    await PasswordReset.updateOne(
      { email },
      {
        userId: user._id,
        email,
        otp: hashedOTP,
        otpAttempts: 0,
        expiresAt,
        verified: false
      },
      { upsert: true }
    );

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    // Find password reset record
    const resetRecord = await PasswordReset.findOne({ email });
    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'No reset request found' });
    }

    // Check if OTP has expired
    if (new Date() > resetRecord.expiresAt) {
      await PasswordReset.deleteOne({ email });
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Check attempt count
    if (resetRecord.otpAttempts >= 3) {
      await PasswordReset.deleteOne({ email });
      return res.status(400).json({ success: false, message: 'Too many attempts. Request new OTP' });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, resetRecord.otp);
    if (!isValidOTP) {
      resetRecord.otpAttempts += 1;
      await resetRecord.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: resetRecord.userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    // Update verified status
    resetRecord.verified = true;
    resetRecord.token = resetToken;
    await resetRecord.save();

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token: resetToken
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Verify token
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Find and verify reset record
    const resetRecord = await PasswordReset.findOne({ email, verified: true });
    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid reset request' });
    }

    // Update user password
    const user = await User.findById(resetRecord.userId);
    user.password = newPassword;
    await user.save();

    // Delete reset record
    await PasswordReset.deleteOne({ email });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};
```

### Step 5: Create Auth Routes

**File**: `routes/authRoutes.js`
```javascript
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
```

### Step 6: Register Routes in Server

**Update**: `server.js`
```javascript
const authRoutes = require('./routes/authRoutes');

// ... existing code ...

app.use('/auth', authRoutes);

// ... rest of code ...
```

---

## Testing the API

### Using Postman

#### 1. Test Forgot Password
```
POST http://localhost:5000/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

#### 2. Test Verify OTP
```
POST http://localhost:5000/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "jwt_token_here"
}
```

#### 3. Test Reset Password
```
POST http://localhost:5000/auth/reset-password
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Project Structure After Step 1

```
colo-candy-backend/
├── models/
│   ├── User.js
│   └── PasswordReset.js
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── services/
│   └── emailService.js
├── server.js
├── .env
├── .gitignore
└── package.json
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'mongoose'"
**Solution**: Run `npm install mongoose`

### Issue 2: Email not sending
**Solution**:
1. Enable 2FA on Gmail
2. Generate App Password (not your main password)
3. Use app password in .env
4. Allow "Less secure apps" if not using App Password

### Issue 3: MongoDB connection failed
**Solution**:
1. Start MongoDB: `mongod`
2. Or use MongoDB Atlas connection string
3. Check MONGODB_URI in .env

### Issue 4: CORS errors
**Solution**: Ensure frontend URL matches FRONTEND_URL in .env

### Issue 5: OTP expired immediately
**Solution**: Check server time is correct and expiration time is set to future

---

## Next: Implement Other Endpoints

After testing forgot password, implement in order:
1. Change Password
2. Update Phone
3. Update Email
4. Save Address
5. Upload Profile Image
6. Google OAuth

Each follows same pattern: Model → Service → Controller → Route

---

## Database Backup Command

```bash
# Backup
mongodump --uri "mongodb://localhost:27017/colo-candy" --out ./backup

# Restore
mongorestore --uri "mongodb://localhost:27017/colo-candy" ./backup/colo-candy
```

---

## Monitoring & Logging

Add logging to track issues:

```javascript
const logger = require('simple-node-logger').createSimpleLogger({
  logFilePath: 'app.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss'
});

logger.info('OTP sent to:', email);
logger.error('Error:', error.message);
logger.warn('Suspicious activity:', ip);
```

---

## Performance Tips

1. Add indexes to frequently queried fields
2. Cache OTP generation
3. Use connection pooling
4. Implement request rate limiting
5. Compress responses with gzip

---

## Security Checklist

- [ ] Hash passwords with bcrypt
- [ ] Hash OTPs before storing
- [ ] Use JWT for authentication
- [ ] Validate all inputs
- [ ] Rate limit login/OTP endpoints
- [ ] Use HTTPS in production
- [ ] Store secrets in .env
- [ ] Add CORS properly
- [ ] Implement request logging
- [ ] Use helmet for security headers

---

**You're now ready to build the backend!** Start with the forgot password flow and test it before moving to other endpoints.
