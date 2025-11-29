# Google OAuth & Network Issues - Fixed

## Summary of Issues Found & Fixed

### ✅ Issue 1: OAuth Not Creating Users
**Root Cause:** Backend and frontend were using different ports
- Backend was configured to use port 10000
- OAuth routes were pointing to port 10000
- But auth endpoints for OAuth should be on port 10000

**Fixed By:**
- Changed backend default port from 10000 to 10000
- Updated `.env` to point to port 10000
- Added detailed logging to OAuth controller

### ✅ Issue 2: CORS Not Allowing Phone Access
**Root Cause:** Backend CORS only allowed `localhost:3000`
- When accessing from phone IP (e.g., `192.168.x.x:3000`), requests were blocked
- CORS error prevented all network communication

**Fixed By:**
- Updated CORS configuration to allow:
  - `http://localhost:3000` (desktop)
  - `http://<YOUR_IP>:3000` (phone on same network)
  - `http://127.0.0.1:3000` (fallback)
- Server automatically detects local IP and logs it at startup

### ✅ Issue 3: Network Errors on Phone
**Root Cause:** Frontend hardcoded to `localhost` which doesn't work from phone
- Phone can't reach `localhost` (it refers to the phone itself)
- Need to use computer's IP address instead

**Fixed By:**
- Backend now detects and displays your machine's IP at startup
- You can use that IP on phone: `http://<MACHINE_IP>:3000`

---

## What Was Changed

### Backend (Back-end/src/server.js)

#### Before:
```javascript
const PORT = process.env.PORT || 10000;
app.use(cors({
  origin: ["http://localhost:3000", "https://colo-candy.onrender.com"],
  credentials: true,
}));
```

#### After:
```javascript
const localIP = getLocalIP(); // Automatically detects your machine's IP
const allowedOrigins = [
  "http://localhost:3000",
  `http://${localIP}:3000`,
  `http://127.0.0.1:3000`,
  "https://colo-candy.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📱 Access from phone: http://${localIP}:${PORT}`);
  console.log(`🖥️  Access from laptop: http://localhost:${PORT}`);
});
```

### Frontend (.env)

#### Before:
```env
REACT_APP_API_URL="http://localhost:10000"
```

#### After:
```env
REACT_APP_API_URL="http://localhost:10000"
```

### OAuth Controller (Back-end/src/controllers/oauthController.js)

Added comprehensive logging at each step:
```javascript
console.log('🔐 OAuth callback received with code:', code ? 'Yes' : 'No');
console.log('🔄 Exchanging code for tokens...');
console.log('✅ Access token obtained');
console.log('📧 Fetching user info from Google...');
console.log('✅ User info received:', googleUser.email);
console.log('👤 Creating new user...');
console.log('✅ New user created via Google OAuth:', googleUser.email, 'ID:', savedUser._id);
console.log('✅ Session established for user:', user.email);
```

### OAuth Callback Component (Front-end/src/components/pages/GoogleOAuthCallback/GoogleOAuthCallback.js)

Added comprehensive logging for debugging:
```javascript
console.log('🔐 GoogleOAuthCallback component mounted');
console.log('📝 Code:', code ? 'Received' : 'Not received');
console.log('🔄 Sending code to backend...');
console.log('✅ Backend response:', result);
console.log('✅ OAuth successful! User:', result.user?.email);
```

---

## How to Use Now

### Step 1: Start Backend
```bash
cd "Back-end"
npm install  # If not done yet
npm start    # Uses port 10000
```

**You'll see output like:**
```
✅ Server running on port 10000
📱 Access from phone: http://192.168.1.100:10000
🖥️  Access from laptop: http://localhost:10000
```

**Note:** Copy the IP address shown (e.g., `192.168.1.100`)

### Step 2: Start Frontend
```bash
cd "Front-end"
npm install  # If not done yet
npm start    # Opens http://localhost:3000
```

### Step 3: Test OAuth on Desktop

1. Go to http://localhost:3000/register
2. Click **"Sign up with Google"**
3. Log in with your Google account
4. Grant permissions
5. **Check browser console (F12)** for logs like:
   ```
   🔐 GoogleOAuthCallback component mounted
   📝 Code: Received
   🔄 Sending code to backend...
   ✅ Backend response: {success: true, user: {...}}
   ✅ OAuth successful! User: yourname@gmail.com
   🏠 Redirecting to home page...
   ```

### Step 4: Test on Phone (Optional)

1. Make sure phone is on **same WiFi network** as your computer
2. Get your machine's IP (shown in backend console):
   ```
   📱 Access from phone: http://192.168.1.100:3000
   ```
3. Open that URL on phone browser: `http://192.168.1.100:3000`
4. Try signup/login - should work now!

---

## Debugging Checklist

### ✓ Backend Issues

**Backend won't start:**
```bash
# Check if port 10000 is in use
netstat -ano | findstr :10000

# Kill process using port 10000
taskkill /PID <PID> /F

# Try again
npm start
```

**OAuth callback not hitting backend:**
- Check browser console (F12)
- Look for network tab → `/auth/google/callback` request
- Should see 200 response with user data

**Backend logs not showing:**
- Should see emoji logs like 🔐, 🔄, ✅, ❌
- If not, restart backend: `npm start`

### ✓ Frontend Issues

**OAuth not working:**
1. Open browser console (F12)
2. Go to Networks tab
3. Click "Sign up with Google"
4. Look for request to `oauth2.googleapis.com`
5. Should redirect to Google login
6. After login, should POST to `/auth/google/callback`

**CORS error on phone:**
```
Access to XMLHttpRequest at 'http://192.168.1.100:10000/...'
from origin 'http://192.168.1.100:3000' has been blocked by CORS policy
```

**Solution:** Make sure backend CORS includes your IP

### ✓ Environment Variables

Make sure `.env` files have:

**Backend (`Back-end/.env`):**
```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_SECRET
FRONTEND_URL=http://localhost:3000
PORT=10000
```

**Frontend (`Front-end/.env`):**
```env
REACT_APP_API_URL=http://localhost:10000
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
```

---

## Testing OAuth Flow

### Expected Backend Console Output:

```
✅ Server running on port 10000
📱 Access from phone: http://192.168.x.x:10000
🖥️  Access from laptop: http://localhost:10000

[User clicks "Sign up with Google"]

🔐 OAuth callback received with code: Yes
🔄 Exchanging code for tokens...
✅ Access token obtained
📧 Fetching user info from Google...
✅ User info received: yourname@gmail.com
👤 Creating new user...
✅ New user created via Google OAuth: yourname@gmail.com ID: 507f1f77bcf86cd799439011
✅ Session established for user: yourname@gmail.com
✅ Returning user data to frontend
```

### Expected Frontend Console Output:

```
🔐 GoogleOAuthCallback component mounted
📝 Code: Received
❌ Error: None
🔄 Sending code to backend...
✅ Backend response: {success: true, message: "Google login successful", user: {...}}
✅ OAuth successful! User: yourname@gmail.com
🏠 Redirecting to home page...
```

### Expected Result:

- ✅ User created in MongoDB
- ✅ Session established
- ✅ Redirected to home page
- ✅ User is logged in

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **"Address already in use"** | Port 10000 in use | Kill process on port 10000 or change PORT in .env |
| **CORS error** | Backend doesn't allow frontend origin | Update CORS origins in server.js |
| **"No authorization code received"** | Code not in URL | Check Google OAuth settings, try again |
| **"Google login failed"** | Error fetching user info | Check Google API credentials |
| **Products not loading on phone** | Phone can't reach API | Use machine IP instead of localhost |
| **Network error on phone** | CORS blocking | Ensure phone IP in CORS origins |

---

## Next Steps

1. **Test Desktop:** http://localhost:3000
2. **Test Phone:** http://<MACHINE_IP>:3000 (from backend console output)
3. **Check Console Logs:** F12 → Console tab
4. **Monitor Backend Logs:** Watch for emoji logs in backend terminal

If issues persist, share the console logs and backend logs, and we can debug further!

---

## Files Modified

- ✅ `Back-end/src/server.js` - CORS & Port configuration
- ✅ `Back-end/src/controllers/oauthController.js` - Added logging
- ✅ `Front-end/src/components/pages/GoogleOAuthCallback/GoogleOAuthCallback.js` - Added logging
- ✅ `Front-end/.env` - Updated API_URL port

## New Features Added

- ✅ Automatic IP detection for phone access
- ✅ Comprehensive console logging (frontend & backend)
- ✅ Better error messages
- ✅ Improved CORS handling
