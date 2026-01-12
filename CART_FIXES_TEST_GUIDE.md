# 🧪 Cart Fixes - Comprehensive Testing Guide

## Quick Reference
| Issue | What Changed | How to Test |
|-------|-------------|-----------|
| #1 | Button shows only for items in cart | Add item, navigate products, check button |
| #2 | Cart count shows item count not quantity | Add 1 item with qty 10, should show "1" |
| #3 | Cart clears on logout | Logout, check localStorage and UI |
| #4 | Merge uses max quantity | Login with items in local + DB |

---

## Pre-Testing Setup

### Clear Browser Cache
1. Open DevTools (F12)
2. Go to Application → Storage → LocalStorage
3. Find key `'cart'` and `'user'`
4. Clear both
5. Refresh page

### Check Browser Console
1. Open DevTools Console
2. Should see no errors related to cart operations
3. Should see "30-second check" logs when cart syncs

---

## Test Scenario 1: Cart Count Display (Issue #2)

### Step 1: Add Single Item with Increasing Quantities
1. Go to home page
2. Click on any product → Opens product details
3. Click "Add to Cart" → Should show message "Item added to cart!"
4. Look at navbar cart icon → Should show **"1"** (not quantity)
5. Click same product → Should show message "quantity..."
6. Refresh page → Should still show **"1"**

### Step 2: Add Multiple Items
1. Go back to home page
2. Click on different product → Opens different product details
3. Click "Add to Cart" → Should show "Item added to cart!"
4. Look at navbar cart icon → Should now show **"2"** (two unique items)
5. Increase quantity of this item to 5
6. Navbar cart icon should still show **"2"** (not 6)

### Expected Result
✅ Navbar shows count of unique items (2), not sum of quantities (6)

---

## Test Scenario 2: Remove Button Visibility (Issue #1)

### Step 1: Add Item to Cart
1. Go to home page
2. Add **Product A** to cart (any product, note its ID)
3. Navigate to product details page for **Product A**
4. Should show **RED "🗑️ Remove from Cart"** button

### Step 2: Navigate to Different Products
1. Go back to home page
2. Click on **Product B** (different from Product A)
3. Should show **ORANGE "🛒 Add to Cart"** button (not Remove)
4. Go back to home page
5. Click on **Product C** (another different product)
6. Should show **ORANGE "🛒 Add to Cart"** button (not Remove)

### Step 3: Navigation Back to Added Item
1. Go back to home page
2. Click on **Product A** again
3. Should show **RED "🗑️ Remove from Cart"** button

### Expected Result
✅ Button shows "Remove" ONLY for Product A, "Add" for all others

---

## Test Scenario 3: Cart Clear on Logout (Issue #3)

### CRITICAL TEST - This is a security issue

#### Part A: Logout Clears Cart
1. Login as any user (create account if needed)
2. Add 3-4 items to cart
3. Check navbar cart icon → Should show count > 0
4. Scroll down or find logout button
5. Click **Logout**
6. **After logout**, check navbar cart icon → Should show **empty or "0"**
7. Go to `/cart` page → Should show **"Your Cart is Empty"**

#### Part B: Prevent Cart Leak Between Users
1. **Do NOT clear browser cache**
2. Login as **User B** (different account)
3. Add items to cart for User B (can be different items)
4. Logout
5. Login as **User A** again (first user)
6. Check cart → Should show **User A's items, NOT User B's items**

**IMPORTANT:** This prevents data leaks where User A logs in, User B logs in, then User A logs back in and sees User B's cart.

### Expected Result
✅ Cart is empty after logout
✅ No cart data leaks between different users

---

## Test Scenario 4: Cart Merge Uses Max Quantity (Issue #4)

### Setup for this test
- You need **2 browser windows/tabs** OR **different device/incognito window**

#### Part A: Local Cart Higher than Database

**Browser/Device 1 (Incognito/Private):**
1. Do NOT login
2. Add Product A to cart → quantity = 1
3. Increase Product A quantity to **5**
4. Add Product B → quantity = 1
5. **DO NOT login yet** - keep this cart

**Browser/Device 2 (Normal):**
1. Login as User X
2. Check cart → Should have Product A with qty 3 (assume from previous session)
3. Check cart → Should have Product C with qty 2 (from previous session)
4. Logout

**Back to Browser/Device 1:**
1. Still has: Product A (qty: 5), Product B (qty: 1)
2. Now **Login as User X**
3. Wait for merge to complete
4. Check cart → Should have:
   - Product A: **qty 5** (max of 5 and 3) ✓
   - Product B: **qty 1** (only in local) ✓
   - Product C: **qty 2** (only in DB) ✓

#### Part B: Database Quantity Higher than Local

**Browser/Device 1 (Incognito/Private):**
1. Do NOT login
2. Add Product D → quantity = **2**
3. **DO NOT login yet**

**Browser/Device 2 (Normal):**
1. Login as User Y
2. Check/edit Product D → set quantity to **7**
3. Wait for sync (30 seconds)
4. Logout

**Back to Browser/Device 1:**
1. Still has: Product D (qty: 2)
2. Now **Login as User Y**
3. Wait for merge to complete
4. Check cart → Product D should have **qty 7** (max of 2 and 7) ✓

### Expected Result
✅ When item exists in both carts, max quantity is used
✅ No quantities are summed together

---

## Test Scenario 5: Complete User Journey

### Login Flow
1. **Logged out**, add items to cart
2. See cart count updates
3. Login → Cart should merge with database
4. See all items (merged)
5. Update quantities
6. Logout → Cart clears

### Testing Steps
1. Logout (clear browser cache first)
2. Add Product A (qty: 1) to cart
3. Add Product B (qty: 2) to cart
4. Check navbar → Shows "2"
5. Navigate: Product A → Shows "Remove", Product B → Shows "Remove", Product C → Shows "Add"
6. **Login as User X**
7. Wait for merge (check console for "Cart has changes, syncing...")
8. Check cart → Should have merged items
9. Update quantities
10. Wait 30 seconds → Should see sync message
11. **Logout**
12. Check cart → Should be EMPTY
13. Refresh page → Still EMPTY
14. Check localStorage (DevTools) → No 'cart' key or empty array

### Expected Result
✅ All 4 issues work correctly in user journey

---

## Browser Console Debugging

### Enable Debug Logging
Open DevTools Console and watch for these logs:

**When adding to cart:**
```
Cart dirty flag set to true
Cart has changes, syncing...
Successfully synced cart
```

**When logging in:**
```
Merging carts...
Merged cart has X items
Syncing merged cart...
Successfully synced cart
```

**When logging out:**
```
Clearing cart...
Cart cleared
Logging out...
```

**Every 30 seconds:**
```
30-second check: Cart has changes, syncing...
Successfully synced cart
```

---

## Advanced Debugging - localStorage Check

### Check what's in localStorage

1. Open DevTools (F12)
2. Go to **Application** → **Storage** → **LocalStorage**
3. Click on your website URL
4. Find key **'cart'** - value should look like:
```json
[
  {
    "id": "5",
    "name": "Product Name",
    "price": 100,
    "quantity": 2,
    ...
  }
]
```

### Check what's in sessionStorage
- Should contain **'user'** key after login
- Should be **empty** after logout

### After Logout
- **'cart'** key should be **empty array `[]`** or **removed**
- **'user'** key should be **removed** or **null**

---

## Regression Testing Checklist

These tests ensure we didn't break anything:

### Product Navigation
- [ ] Can navigate to product details from home page
- [ ] Can navigate back to home page from product details
- [ ] Product images load correctly
- [ ] Product prices display correctly

### Cart Page
- [ ] Cart page loads when items are in cart
- [ ] Can update item quantities on cart page
- [ ] Can remove items from cart page
- [ ] Cart totals calculate correctly
- [ ] Can clear entire cart
- [ ] Checkout button is present (even if not functional)

### Search & Filter
- [ ] Search works on home page
- [ ] Filters work (if implemented)
- [ ] Products update when filters change

### Authentication
- [ ] Login works
- [ ] Register works
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Admin routes work (if applicable)

---

## What to Do If Tests Fail

### If Cart Count Shows Wrong Number
1. Check console for errors
2. Clear localStorage ('cart' key)
3. Refresh page
4. Try again

### If Button Shows Wrong Text
1. Check console → Look for "isInCart" values
2. Check localStorage → Verify cart item IDs match product IDs
3. Open DevTools Network tab → Check API responses for product IDs
4. Verify both are strings or both are numbers

### If Logout Doesn't Clear Cart
1. Open DevTools → Application → LocalStorage
2. Manually clear 'cart' key
3. Refresh page
4. Try logout again
5. Check if 'cart' key is removed

### If Merge Doesn't Work
1. Check console for merge logs
2. Verify local cart has items
3. Verify user has items in database (from previous session)
4. Check if items have matching IDs
5. Verify merge happens at login (might need to wait a moment)

---

## Final Validation Checklist

- [ ] Cart count shows item count, not quantity sum
- [ ] Remove button shows only for items in cart
- [ ] Cart clears completely on logout
- [ ] Cart merges with max quantity on login
- [ ] No ID type mismatches (string vs number)
- [ ] No console errors
- [ ] localStorage updates correctly
- [ ] Different users don't see each other's carts
- [ ] All 4 fixes work together seamlessly

---

**Test Status:** Ready for Testing ✅
**Critical Tests:** Scenarios 3 & 4 (security and merge logic)
