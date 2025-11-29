# Next Steps Implementation Checklist

## Phase 1: Backend Setup & Configuration (Weeks 1-2)

### 1.1 Project Setup
- [ ] Create backend repository (if not exists)
- [ ] Initialize Node.js project: `npm init -y`
- [ ] Install core dependencies:
  ```bash
  npm install express cors dotenv mongoose bcryptjs jsonwebtoken
  npm install nodemailer axios multer cloudinary
  npm install -D nodemon
  ```
- [ ] Create `.env` file with all environment variables
- [ ] Setup `.gitignore` with node_modules, .env, uploads/
- [ ] Create folder structure:
  ```
  backend/
  ├── config/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  ├── services/
  ├── utils/
  ├── .env
  ├── server.js
  └── package.json
  ```

### 1.2 Database Setup
- [ ] Install MongoDB locally or use MongoDB Atlas
- [ ] Create database: `colo-candy`
- [ ] Create collections:
  - [ ] users
  - [ ] products
  - [ ] orders
  - [ ] cart
  - [ ] passwordResets
- [ ] Define MongoDB schemas in `models/`:
  ```
  ├── User.js
  ├── Product.js
  ├── Order.js
  ├── Cart.js
  └── PasswordReset.js
  ```

### 1.3 Authentication Setup
- [ ] Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Install Google OAuth library: `npm install google-auth-library`
- [ ] Get Google OAuth credentials from Google Cloud Console
- [ ] Set up email service (choose one):
  - [ ] Gmail with App Password
  - [ ] SendGrid
  - [ ] Mailgun
- [ ] Install email library: `npm install nodemailer` (Gmail) or `npm install @sendgrid/mail`

### 1.4 File Upload Setup
- [ ] Install Cloudinary: `npm install cloudinary multer-storage-cloudinary`
- [ ] Or: Install AWS SDK: `npm install aws-sdk`
- [ ] Create Cloudinary/AWS account and get credentials
- [ ] Test file upload flow

### 1.5 CORS & Security
- [ ] Configure CORS in express:
  ```javascript
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
  ```
- [ ] Install helmet for security: `npm install helmet`
- [ ] Install rate-limiter: `npm install express-rate-limit`

---

## Phase 2: User Authentication APIs (Weeks 2-3)

### 2.1 User Model
- [ ] Create `models/User.js`:
  ```javascript
  {
    username: String (unique),
    email: String (unique),
    password: String (bcrypt hash),
    fullname: String,
    phone: String,
    profileImage: String (URL),
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
    role: String,
    createdAt: Date,
    updatedAt: Date,
    lastLogin: Date
  }
  ```

### 2.2 Password Reset Model
- [ ] Create `models/PasswordReset.js`:
  ```javascript
  {
    userId: ObjectId,
    email: String,
    otp: String (hashed),
    otpAttempts: Number,
    token: String (JWT),
    expiresAt: Date,
    createdAt: Date,
    verified: Boolean
  }
  ```

### 2.3 Forgot Password Endpoints
- [ ] `POST /auth/forgot-password`
  - [ ] Validate email
  - [ ] Generate OTP
  - [ ] Hash and store OTP
  - [ ] Send email
  - [ ] Test with Postman

- [ ] `POST /auth/verify-otp`
  - [ ] Validate OTP
  - [ ] Generate reset token
  - [ ] Mark as verified
  - [ ] Test with Postman

- [ ] `POST /auth/reset-password`
  - [ ] Verify reset token
  - [ ] Hash new password
  - [ ] Update user
  - [ ] Delete OTP record
  - [ ] Test with Postman

### 2.4 Login/Register Endpoints
- [ ] `POST /auth/login` - Already exists (verify it works)
- [ ] `POST /auth/register` - Already exists (verify it works)
- [ ] `POST /auth/logout` - Already exists (verify it works)

### 2.5 Session Check
- [ ] `GET /auth/session` - Check current session
  - [ ] Verify JWT from cookies
  - [ ] Return user data if valid
  - [ ] Test with Postman

### 2.6 Testing
- [ ] Test forgot password with Postman (all 3 steps)
- [ ] Test with actual email
- [ ] Verify OTP expiration works
- [ ] Test max attempt limit
- [ ] Test invalid OTP

---

## Phase 3: User Profile APIs (Week 3)

### 3.1 Password Change Endpoint
- [ ] `POST /auth/change-password`
  - [ ] Verify old password
  - [ ] Hash new password
  - [ ] Update user
  - [ ] Return success
  - [ ] Test with Postman

### 3.2 Phone Update Endpoint
- [ ] `PUT /user/phone`
  - [ ] Validate phone format
  - [ ] Update user.phone
  - [ ] Return updated user
  - [ ] Test with Postman

### 3.3 Email Update Endpoint
- [ ] `PUT /user/email`
  - [ ] Validate email format
  - [ ] Check if email exists
  - [ ] Update user.email
  - [ ] Return updated user
  - [ ] Test with Postman

### 3.4 Address Save Endpoint
- [ ] `POST /user/address`
  - [ ] Validate all fields
  - [ ] Update user.address
  - [ ] Return updated user
  - [ ] Test with Postman

### 3.5 Profile Image Upload Endpoint
- [ ] `POST /user/upload-profile-image`
  - [ ] Setup multer middleware
  - [ ] Validate file type
  - [ ] Upload to Cloudinary/S3
  - [ ] Update user.profileImage
  - [ ] Return URL
  - [ ] Test with Postman

### 3.6 Testing
- [ ] Test all endpoints with auth token
- [ ] Test without auth (should fail)
- [ ] Test with invalid data
- [ ] Test file upload with various sizes
- [ ] Verify database updates

---

## Phase 4: Google OAuth Integration (Week 4)

### 4.1 Google OAuth Setup
- [ ] Create Google OAuth app in Google Cloud Console
- [ ] Get CLIENT_ID and CLIENT_SECRET
- [ ] Set redirect URI: `http://localhost:10000/auth/google/callback`
- [ ] Add to `.env` file

### 4.2 Google Callback Endpoint
- [ ] `POST /auth/google/callback`
  - [ ] Receive authorization code
  - [ ] Exchange code for access token
  - [ ] Fetch user info from Google
  - [ ] Check if user exists
  - [ ] Create user if not exists
  - [ ] Generate JWT
  - [ ] Return user and token
  - [ ] Test with browser

### 4.3 Testing
- [ ] Test Google login flow end-to-end
- [ ] Verify new user creation
- [ ] Verify existing user login
- [ ] Check cart merge for existing users
- [ ] Test on mobile browser

---

## Phase 5: Frontend Integration (Week 4-5)

### 5.1 Environment Variables
- [ ] Add `.env.local` to frontend:
  ```
  REACT_APP_API_URL=http://localhost:10000
  REACT_APP_GOOGLE_CLIENT_ID=your_client_id
  REACT_APP_LOGIN_URL=/auth/login
  REACT_APP_LOGOUT_URL=/auth/logout
  REACT_APP_REGISTER_URL=/auth/register
  REACT_APP_SESSION_CHECK_URL=/auth/session
  ```

### 5.2 Test Forgot Password Flow
- [ ] Navigate to `/login`
- [ ] Click "Forgot Password?"
- [ ] Enter email
- [ ] Check email for OTP
- [ ] Enter OTP
- [ ] Set new password
- [ ] Login with new password

### 5.3 Test Profile Settings
- [ ] Login with test account
- [ ] Click profile button
- [ ] Click "Settings"
- [ ] Upload profile picture
- [ ] Update phone number
- [ ] Update email
- [ ] Change password
- [ ] Save address
- [ ] Verify changes persist after refresh

### 5.4 Test Google OAuth
- [ ] Click "Continue with Google" on login
- [ ] Authenticate with Google account
- [ ] Verify auto-login works
- [ ] Create new account with Google
- [ ] Verify profile picture from Google
- [ ] Test on different browsers

### 5.5 Test User Menu
- [ ] Profile button displays correctly
- [ ] Click opens menu
- [ ] Settings link works
- [ ] Orders link works
- [ ] Logout works
- [ ] Cart syncs on logout

---

## Phase 6: Advanced Features (Week 5-6)

### 6.1 Multiple Addresses (Optional)
- [ ] Modify Address schema to support array
- [ ] Create `/user/addresses` endpoint for listing
- [ ] Create `/user/address/:id` endpoint for update
- [ ] Create `/user/address/:id` endpoint for delete
- [ ] Add address management UI

### 6.2 Email Verification (Optional)
- [ ] Generate verification token on email change
- [ ] Send verification email
- [ ] Create verification endpoint
- [ ] Mark email as verified

### 6.3 Two-Factor Authentication (Optional)
- [ ] Add 2FA field to User model
- [ ] Create enable/disable endpoints
- [ ] Implement TOTP generation
- [ ] Test with authenticator app

### 6.4 Login History (Optional)
- [ ] Create LoginHistory model
- [ ] Log login attempts
- [ ] Create `/user/login-history` endpoint
- [ ] Display in user dashboard

---

## Phase 7: Testing & QA (Week 6)

### 7.1 Unit Tests
- [ ] Test password hashing with bcrypt
- [ ] Test OTP generation
- [ ] Test email validation
- [ ] Test phone validation
- [ ] Test file upload validation

### 7.2 Integration Tests
- [ ] Test complete forgot password flow
- [ ] Test complete profile update flow
- [ ] Test Google OAuth flow
- [ ] Test authentication middleware
- [ ] Test protected routes

### 7.3 End-to-End Tests
- [ ] Cypress tests for user flows
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile browsers
- [ ] Test with slow network
- [ ] Test error scenarios

### 7.4 Security Testing
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Test OTP brute force protection

### 7.5 Performance Testing
- [ ] Load test authentication endpoints
- [ ] Test file upload performance
- [ ] Test image optimization
- [ ] Test response times
- [ ] Test database query performance

---

## Phase 8: Deployment (Week 7)

### 8.1 Backend Deployment
- [ ] Choose hosting: Heroku, Railway, DigitalOcean, AWS
- [ ] Set up production database (MongoDB Atlas)
- [ ] Configure production environment variables
- [ ] Set up logging and monitoring
- [ ] Deploy backend
- [ ] Test APIs in production

### 8.2 Frontend Deployment
- [ ] Update API URLs for production
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Vercel, Netlify, or AWS
- [ ] Set up custom domain
- [ ] Configure CDN for images
- [ ] Test in production

### 8.3 Post-Deployment
- [ ] Verify all features work in production
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Document deployment process
- [ ] Create runbooks for common issues

---

## Phase 9: Documentation & Maintenance (Ongoing)

### 9.1 Documentation
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Document database schema
- [ ] Write deployment guides
- [ ] Create troubleshooting guide
- [ ] Document security best practices

### 9.2 Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up performance monitoring
- [ ] Set up uptime monitoring
- [ ] Create alerts for critical errors
- [ ] Review logs regularly

### 9.3 Maintenance
- [ ] Regular security updates
- [ ] Database backups
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Feature updates

---

## Quick Start Commands

### Backend Setup
```bash
# Initialize project
mkdir colo-candy-backend && cd colo-candy-backend
npm init -y

# Install dependencies
npm install express cors dotenv mongoose bcryptjs jsonwebtoken nodemailer axios multer cloudinary
npm install -D nodemon

# Create server
touch server.js .env

# Add to package.json scripts:
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# Run development server
npm run dev
```

### Email Configuration (Gmail)
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Google OAuth Setup
1. Go to Google Cloud Console
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI
6. Copy CLIENT_ID and CLIENT_SECRET
7. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Testing Tools
- **Postman**: For API testing
- **Mongodb Compass**: For database visualization
- **Thunder Client**: VS Code extension for API testing
- **Insomnia**: Alternative to Postman

---

## Success Criteria

- [ ] All password reset endpoints working
- [ ] All profile update endpoints working
- [ ] Google OAuth login/signup working
- [ ] All features tested in frontend
- [ ] No console errors
- [ ] All validations working
- [ ] Security best practices implemented
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Deployed to production

---

## Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Backend Setup | 2 weeks | ⏳ |
| Phase 2: Auth APIs | 1 week | ⏳ |
| Phase 3: Profile APIs | 1 week | ⏳ |
| Phase 4: Google OAuth | 1 week | ⏳ |
| Phase 5: Integration | 1 week | ⏳ |
| Phase 6: Advanced Features | 1 week | ⏳ |
| Phase 7: Testing | 1 week | ⏳ |
| Phase 8: Deployment | 1 week | ⏳ |
| **Total** | **8-9 weeks** | |

---

## Support Resources

- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Passport.js**: https://www.passportjs.org/ (alternative auth)
- **Nodemailer**: https://nodemailer.com/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Cloudinary**: https://cloudinary.com/documentation
- **JWT**: https://jwt.io/

---

**Note**: This is a comprehensive checklist. Adjust timeline and priorities based on your team size and availability. Start with Phase 1 and 2 for core functionality, then add advanced features as needed.
