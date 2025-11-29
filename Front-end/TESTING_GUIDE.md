# Complete Testing Guide

## Setup for Testing

### Prerequisites
- Frontend running on: `http://localhost:3000`
- Backend running on: `http://localhost:5000`
- MongoDB running locally or connected via Atlas
- Postman installed (for API testing)
- Test email account created

---

## Phase 1: Backend API Testing (Postman)

### 1.1 Health Check
**Test**: Basic server connectivity

```
GET http://localhost:5000/health

Expected Response: 200 OK
{
  "status": "Server running"
}
```

### 1.2 Forgot Password Flow

#### Step 1: Request OTP
```
POST http://localhost:5000/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}

Expected Response: 200 OK
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**Tests**:
- [ ] Email receives OTP within 2 minutes
- [ ] Different OTP generated each time
- [ ] OTP is 6 digits
- [ ] Non-existent email returns error
- [ ] Empty email returns error

#### Step 2: Verify OTP
```
POST http://localhost:5000/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}

Expected Response: 200 OK
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Tests**:
- [ ] Correct OTP returns token
- [ ] Wrong OTP returns error
- [ ] Multiple wrong attempts blocked after 3
- [ ] Expired OTP returns error
- [ ] OTP can only be used once

#### Step 3: Reset Password
```
POST http://localhost:5000/auth/reset-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}

Expected Response: 200 OK
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Tests**:
- [ ] Password updates successfully
- [ ] Can login with new password
- [ ] Cannot reuse reset token
- [ ] Token expires after 5 minutes
- [ ] Password shorter than 6 chars rejected

---

## Phase 2: Frontend Forgot Password Testing

### Test Scenario 1: Happy Path
```
1. Navigate to http://localhost:3000/login
2. Click "Forgot Password?"
3. Enter test email
4. Click "Send OTP"
5. Check email for OTP
6. Enter OTP on page
7. Click "Verify OTP"
8. Enter new password
9. Enter confirm password
10. Click "Reset Password"
11. See success message
12. Redirected to login
13. Login with new password
```

**Expected Results**:
- [ ] Page navigates properly
- [ ] Step indicator shows correct step
- [ ] OTP email arrives within 2 mins
- [ ] OTP input auto-formats
- [ ] Error messages are clear
- [ ] Success message appears
- [ ] Auto-redirect after success
- [ ] Can login with new password

### Test Scenario 2: Error Handling
```
Test Invalid Email
1. Enter invalid email
2. Click "Send OTP"
3. See error message

Test Wrong OTP
1. Request OTP
2. Enter wrong OTP
3. Click "Verify OTP"
4. See error message
5. Try 3 times
6. See "too many attempts" error

Test Expired OTP
1. Request OTP
2. Wait 15+ minutes
3. Enter OTP
4. See "OTP expired" error
5. Request new OTP
```

**Expected Results**:
- [ ] Invalid email: "User not found"
- [ ] Wrong OTP: "Invalid OTP" (shows attempt count)
- [ ] Max attempts: "Too many attempts"
- [ ] Expired OTP: "OTP expired"

### Test Scenario 3: Mobile Responsiveness
```
1. Test on iPhone viewport (375px)
2. Test on iPad viewport (768px)
3. Test on Android viewport (360px)
```

**Expected Results**:
- [ ] Form responsive on all sizes
- [ ] Buttons full width on mobile
- [ ] Text readable on all sizes
- [ ] Step indicator visible
- [ ] No horizontal scroll

---

## Phase 3: Profile Settings Testing

### Test Scenario 1: Upload Profile Picture
```
1. Login with test account
2. Click profile button (top right)
3. Click "Settings"
4. Go to "Profile Picture" tab
5. Click "Choose Image"
6. Select JPG/PNG file (< 5MB)
7. See preview
8. Click "Upload"
9. See success message
10. Refresh page
11. Verify image still there
12. Check navbar shows new image
```

**Expected Results**:
- [ ] File input opens
- [ ] Image preview displays
- [ ] Upload successful
- [ ] Image persists after refresh
- [ ] Navbar updates immediately
- [ ] Error for files > 5MB
- [ ] Error for non-image files

### Test Scenario 2: Update Phone Number
```
1. Settings → Phone Number
2. See current phone (read-only)
3. Enter new 10-digit number
4. Click "Update"
5. See success message
6. Refresh page
7. Verify new number shows
```

**Expected Results**:
- [ ] Current phone shows disabled
- [ ] New phone updates
- [ ] 10-digit validation works
- [ ] Non-digits rejected
- [ ] Duplicate number error
- [ ] Persists after refresh

### Test Scenario 3: Update Email
```
1. Settings → Email Address
2. See current email (read-only)
3. Enter new valid email
4. Click "Update"
5. See success message
6. Verify old email works? (depends on backend)
```

**Expected Results**:
- [ ] Current email shows disabled
- [ ] Email format validated
- [ ] Duplicate email rejected
- [ ] Success after update
- [ ] (Optional) Verification email sent

### Test Scenario 4: Change Password
```
1. Settings → Change Password
2. Enter current password
3. Enter new password (different)
4. Confirm new password
5. See password visibility toggle
6. Click "Change Password"
7. See success message
8. Logout and login with new password
```

**Expected Results**:
- [ ] Current password required
- [ ] New password ≥ 6 chars
- [ ] Passwords must match
- [ ] Visibility toggle works
- [ ] Change successful
- [ ] Can login with new password
- [ ] Cannot use old password

### Test Scenario 5: Save Address
```
1. Settings → Save Address
2. Fill all fields:
   - Full Name
   - Phone (10 digits)
   - Street
   - City
   - State
   - Zip Code (6 digits)
   - Address Type (Home/Work/Other)
3. Click "Save Address"
4. See success message
5. Refresh page
6. Verify all fields persist
```

**Expected Results**:
- [ ] All fields required
- [ ] Phone: 10 digits validation
- [ ] Zip: 6 digits validation
- [ ] Address type selection works
- [ ] Save successful
- [ ] Data persists after refresh

---

## Phase 4: Google OAuth Testing

### Test Scenario 1: Google Login
```
1. Navigate to http://localhost:3000/login
2. Click "Continue with Google"
3. Authenticate with Google account
4. Should auto-login
5. Navigate to home page
6. Verify profile image from Google
7. Check profile button shows Google image
```

**Expected Results**:
- [ ] Redirects to Google login
- [ ] Google OAuth flow completes
- [ ] Auto-login works
- [ ] Profile image from Google shows
- [ ] Navbar updates with image
- [ ] Can navigate app
- [ ] Cart preserved from before

### Test Scenario 2: Google Signup
```
1. Navigate to http://localhost:3000/register
2. Click "Sign up with Google"
3. New Google account (if needed)
4. Should create account and auto-login
5. Verify new user created
6. Check profile has Google info
```

**Expected Results**:
- [ ] New account created
- [ ] Auto-login after signup
- [ ] Profile picture from Google
- [ ] Email from Google set
- [ ] Can use app normally
- [ ] Can update profile later

### Test Scenario 3: Existing User Google Login
```
1. Create account normally (username/password)
2. Logout
3. Click "Continue with Google"
4. Authenticate with same email
5. Should login existing account
```

**Expected Results**:
- [ ] Existing account recognized
- [ ] Login successful
- [ ] Can update password later if needed
- [ ] No duplicate accounts

---

## Phase 5: User Menu (Profile Button)

### Test Scenario 1: Profile Menu
```
1. Login
2. Click profile button (top right)
3. See menu appears
4. Menu shows: Settings, Orders, Logout
5. Click outside menu
6. Menu closes
7. Click button again
8. Menu opens
```

**Expected Results**:
- [ ] Menu appears correctly positioned
- [ ] Shows user name
- [ ] Shows user profile picture
- [ ] All menu items visible
- [ ] Click-outside detection works
- [ ] Toggle works properly

### Test Scenario 2: Navigation from Menu
```
1. Click "Settings"
2. Navigate to /settings
3. Menu closes
4. Click profile button
5. Click "Orders"
6. Navigate to /orders
```

**Expected Results**:
- [ ] Settings link works
- [ ] Orders link works
- [ ] Menu closes after navigation
- [ ] Can navigate to each page

### Test Scenario 3: Logout from Menu
```
1. Have items in cart
2. Click profile button
3. Click "Logout"
4. Verify cart synced before logout
5. Navigate to login page
6. Verify logged out
7. Login again
8. Verify cart preserved
```

**Expected Results**:
- [ ] Cart syncs before logout
- [ ] Logout successful
- [ ] Redirects to home
- [ ] Cannot access /settings
- [ ] Cart restored after login

---

## Phase 6: Integration Testing

### Test Scenario 1: Complete User Journey
```
1. Register new account
2. Login
3. Upload profile picture
4. Update phone number
5. Save delivery address
6. Add items to cart
7. Go to cart
8. Logout and verify cart synced
9. Login again
10. Verify all data persists
11. Change password
12. Logout
13. Login with new password
14. Verify success
```

**Expected Results**:
- [ ] All features work together
- [ ] No data loss
- [ ] Cart preserved
- [ ] Profile data persists
- [ ] New password works

### Test Scenario 2: Multi-Browser Testing
```
Test in:
- Chrome
- Firefox
- Safari
- Edge
- Chrome Mobile
- Safari iOS
- Chrome Android
```

**Expected Results**:
- [ ] All features work
- [ ] Responsive on all sizes
- [ ] No console errors
- [ ] Forms work properly
- [ ] Images load correctly

---

## Phase 7: Error Scenario Testing

### Test Case 1: Network Errors
```
1. Disable network
2. Try to login
3. See error message
4. Re-enable network
5. Retry works
```

**Expected Results**:
- [ ] Clear error message
- [ ] User can retry
- [ ] No infinite loading

### Test Case 2: Invalid Data
```
1. Paste JavaScript in name field
2. Try to submit
3. Should be escaped/sanitized
4. No XSS attack
```

**Expected Results**:
- [ ] No script execution
- [ ] Data sanitized
- [ ] Safe storage

### Test Case 3: Session Timeout
```
1. Login
2. Wait for token to expire
3. Try to access protected route
4. Should redirect to login
```

**Expected Results**:
- [ ] Auto-redirect to login
- [ ] Clear error message
- [ ] Can login again

---

## Performance Testing

### Metrics to Measure
```
Page Load Time:
- Login page: < 2s
- Settings page: < 1.5s
- Home page: < 2s

API Response Time:
- Forgot password: < 1s
- Update profile: < 500ms
- Upload image: < 3s

File Sizes:
- Profile image: < 500KB
- Bundle size: < 500KB
```

### Load Testing
```
1. Use Apache JMeter or similar
2. Simulate 100 concurrent users
3. Check response times remain acceptable
4. Check server doesn't crash
5. Check database handles load
```

---

## Security Testing

### OWASP Top 10 Checks

1. **Injection (SQL/NoSQL)**
   - Try: `'; DROP TABLE users; --`
   - Should be safely escaped

2. **XSS (Cross-Site Scripting)**
   - Try: `<script>alert('XSS')</script>`
   - Should be sanitized

3. **CSRF (Cross-Site Request Forgery)**
   - Verify CSRF tokens in forms
   - Check same-site cookie policy

4. **Insecure Authentication**
   - [ ] Passwords hashed
   - [ ] JWT secure
   - [ ] HTTPS in production

5. **Sensitive Data Exposure**
   - [ ] No passwords in logs
   - [ ] HTTPS only
   - [ ] Secure headers

### Testing Commands
```bash
# Check dependencies for vulnerabilities
npm audit

# Check for security issues
npm audit fix

# Scan for exposed secrets
npm install snyk -g
snyk test

# Performance audit
npm run build && lighthouse http://localhost:3000
```

---

## Regression Testing Checklist

After each update, test:
- [ ] Forgot password still works
- [ ] Login/Register works
- [ ] Profile settings work
- [ ] Google OAuth works
- [ ] Cart functionality
- [ ] Navigation
- [ ] Responsive design
- [ ] Error messages
- [ ] Loading states

---

## User Acceptance Testing (UAT)

### Real User Testing
```
1. Ask 5-10 users to test
2. Provide test scenarios
3. Collect feedback
4. Test on their devices
5. Fix issues found
```

### Test Scenarios for Users
1. Reset forgotten password
2. Update profile information
3. Upload profile picture
4. Login with Google
5. Add items and checkout
6. View order history

---

## Deployment Testing

Before going to production:

```
1. Test on staging environment
2. Test with production database
3. Test with real email service
4. Test payment processing
5. Test admin functions
6. Test analytics tracking
7. Test error logging
8. Performance test under load
9. Security scan
10. Final UAT with stakeholders
```

---

## Test Report Template

```
Test Date: YYYY-MM-DD
Tester: Name
Environment: Development/Staging/Production
Browser: Chrome 90.0
Device: Desktop/Mobile

Test Results:
✓ Passed
✗ Failed
⊘ Blocked

Issues Found:
1. Bug description
   Severity: Critical/High/Medium/Low
   Steps to reproduce: ...
   Expected: ...
   Actual: ...

Recommendations:
- ...

Sign-off:
Name: ___________
Date: ___________
```

---

## Continuous Testing

### Automated Tests
```javascript
// Example Jest test
describe('Forgot Password', () => {
  it('should send OTP to email', async () => {
    const response = await axios.post('/auth/forgot-password', {
      email: 'test@example.com'
    });
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it('should reject invalid email', async () => {
    const response = await axios.post('/auth/forgot-password', {
      email: 'invalid'
    });
    expect(response.status).toBe(400);
  });
});
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run build
```

---

## Test Checklist Summary

```
Frontend Testing:
✓ UI/UX responsive design
✓ Form validation
✓ Error messages clear
✓ Loading states
✓ Success notifications
✓ Navigation works
✓ Cart functionality
✓ Profile operations

Backend Testing:
✓ API endpoints working
✓ Database operations
✓ Email sending
✓ Password hashing
✓ JWT tokens
✓ Rate limiting
✓ Error handling
✓ Input validation

Integration Testing:
✓ Frontend-Backend communication
✓ Database operations through API
✓ Email notifications
✓ File uploads
✓ OAuth flow
✓ Session management
✓ Cart sync

Security Testing:
✓ SQL injection prevention
✓ XSS prevention
✓ CSRF protection
✓ Password security
✓ Data encryption
✓ Rate limiting
✓ HTTPS enforcement

Performance Testing:
✓ Page load time
✓ API response time
✓ Image optimization
✓ Database query optimization
✓ Bundle size
✓ Caching strategy
✓ Load testing

UAT:
✓ Real users test
✓ Feedback collected
✓ Issues resolved
✓ Sign-off obtained
```

---

This guide covers comprehensive testing from unit to production level. Start with Phase 1 and work through systematically.
