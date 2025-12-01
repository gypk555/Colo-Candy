# 🚀 Quick Start Guide - OAuth & Network Fixed

## 3-Step Quick Start

### Step 1: Start Backend (Port 10000)
```bash
cd "Back-end"
npm start
```

**Expected output:**
```
✅ Server running on port 10000
📱 Access from phone: http://192.168.x.x:10000
🖥️  Access from laptop: http://localhost:10000
```

### Step 2: Start Frontend (Port 3000)
```bash
cd "Front-end"
npm start
```

**Should open:** http://localhost:3000

### Step 3: Test Google Signup

1. Go to **/register** page
2. Click **"Sign up with Google"**
3. Log in with Google
4. You should be logged in! ✅

---

## What Was Fixed

| Issue | Solution |
|-------|----------|
| **OAuth not creating users** | Fixed backend port (10000 → 10000) & updated frontend config |
| **Products not loading on phone** | Added CORS support for phone IP |
| **Network errors from phone** | Automatic IP detection + CORS configuration |

---

## Testing on Phone

**On same WiFi network as computer:**

```
http://<MACHINE_IP>:3000
```

Example: `http://192.168.1.100:3000`

(Get the IP from backend console output)

---

## Troubleshooting

**Backend won't start:**
```bash
# Port 10000 might be in use
netstat -ano | findstr :10000
taskkill /PID <PID> /F
npm start
```

**Check logs:**
- **Backend:** Look for 🔐, 🔄, ✅ emojis in terminal
- **Frontend:** F12 → Console tab for debug logs

---

## File Changes Summary

✅ **Back-end/src/server.js**
- Changed port: 10000 → 10000
- Updated CORS to allow phone IP
- Added IP detection & logging

✅ **Front-end/.env**
- Updated API_URL: port 10000 → 10000

✅ **Back-end/src/controllers/oauthController.js**
- Added detailed logging for debugging

✅ **Front-end/src/components/pages/GoogleOAuthCallback/GoogleOAuthCallback.js**
- Added detailed logging for debugging

---

## Full Test Flow

```
Desktop:
1. Open http://localhost:3000
2. Click Sign up with Google
3. Log in → Create account ✅

Phone (same WiFi):
1. Open http://192.168.x.x:3000
2. Click Sign up with Google
3. Log in → Create account ✅
4. Products load ✅
5. Login/Register work ✅
```

---

All systems ready! Happy testing! 🎉
