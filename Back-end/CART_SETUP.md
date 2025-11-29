# Cart API Setup Guide

This guide explains how to set up and use the cart functionality in the Colo-Candy backend.

## Database Setup

### Step 1: Run the Migration

Execute the SQL migration file to create the `cart_items` table:

```bash
# Option 1: Using psql command line
psql -U your_username -d your_database -f src/migrations/create_cart_items_table.sql

# Option 2: Copy and paste the SQL into your database client
# Open src/migrations/create_cart_items_table.sql and run it in pgAdmin, DBeaver, or your preferred tool
```

### Step 2: Verify Table Creation

Run this query to verify the table was created:

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'cart_items'
ORDER BY ordinal_position;
```

Expected output:
- `id` - integer (primary key)
- `user_id` - integer (foreign key to users)
- `product_id` - integer (foreign key to products)
- `quantity` - integer (must be > 0)
- `created_at` - timestamp

---

## API Endpoints

### 1. GET /api/cart

Fetch the logged-in user's cart from the database.

**Authentication:** Required (session-based)

**Response:**
```json
{
  "cart": [
    {
      "cart_item_id": 1,
      "id": 5,
      "name": "Product Name",
      "price": 299,
      "description": "Product description",
      "image": "base64_encoded_image",
      "quantity": 2
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:10000/api/cart \
  -H "Cookie: connect.sid=your_session_cookie"
```

---

### 2. POST /api/cart/sync

Sync the entire cart to the database. This **replaces** the user's existing cart.

**Authentication:** Required (session-based)

**Request Body:**
```json
{
  "cart": [
    {
      "id": 5,
      "name": "Product Name",
      "price": 299,
      "description": "Product description",
      "image": "base64_encoded_image",
      "quantity": 2
    },
    {
      "id": 8,
      "name": "Another Product",
      "price": 499,
      "description": "Another description",
      "image": "base64_encoded_image",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Cart synced successfully",
  "cart": [/* same as request */]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:10000/api/cart/sync \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your_session_cookie" \
  -d '{
    "cart": [
      {
        "id": 5,
        "quantity": 2
      }
    ]
  }'
```

---

## How It Works

### Cart Sync Flow

1. **Frontend triggers sync** (every 2 minutes, on logout, on page close, or on checkout)
2. **Backend receives cart array** with product IDs and quantities
3. **Database transaction begins**
4. **Old cart items are deleted** for the user
5. **New cart items are inserted** from the request
6. **Transaction commits**
7. **Response sent** to frontend

### Cart Fetch Flow

1. **Frontend requests cart** (on login)
2. **Backend queries cart_items** joined with products table
3. **Full product details returned** (name, price, image, description, quantity)
4. **Frontend merges** with localStorage cart if needed

---

## Error Handling

### Common Errors

**401 Unauthorized**
```json
{
  "error": "Unauthorized. Please log in."
}
```
**Cause:** User is not logged in (no session)
**Solution:** User must login first

**400 Bad Request**
```json
{
  "error": "Cart must be an array"
}
```
**Cause:** Invalid cart data format
**Solution:** Ensure `cart` is an array in the request body

**500 Internal Server Error**
```json
{
  "error": "Failed to sync cart"
}
```
**Cause:** Database error (foreign key constraint, connection issue, etc.)
**Solution:** Check logs, verify product IDs exist, check database connection

---

## Database Schema

```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,

  UNIQUE (user_id, product_id),
  CHECK (quantity > 0)
);
```

**Key Features:**
- `UNIQUE (user_id, product_id)` - One entry per product per user
- `ON DELETE CASCADE` - Cart items deleted if user or product is deleted
- `CHECK (quantity > 0)` - Quantity must be positive
- Indexes on `user_id` and `product_id` for fast queries

---

## Testing

### Test Cart Sync

1. **Login as a user:**
```bash
curl -X POST http://localhost:10000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password"}' \
  -c cookies.txt
```

2. **Sync a cart:**
```bash
curl -X POST http://localhost:10000/api/cart/sync \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "cart": [
      {"id": 1, "quantity": 2},
      {"id": 2, "quantity": 1}
    ]
  }'
```

3. **Fetch the cart:**
```bash
curl -X GET http://localhost:10000/api/cart \
  -b cookies.txt
```

4. **Verify in database:**
```sql
SELECT * FROM cart_items WHERE user_id = <your_user_id>;
```

---

## Frontend Integration

The frontend already has the cart sync logic implemented in:
- `src/atoms/cartAtoms.js` - Cart state management
- `src/services/cartSyncService.js` - API calls
- `src/hooks/useCartSync.js` - Automatic sync (2-min intervals)

**Environment variables are already configured:**
```env
REACT_APP_CART_URL=http://localhost:10000/api/cart
REACT_APP_CART_SYNC_URL=http://localhost:10000/api/cart/sync
```

---

## Troubleshooting

### Issue: "Foreign key constraint violation"

**Error:**
```
insert or update on table "cart_items" violates foreign key constraint
```

**Solution:**
- Ensure the product ID exists in the `products` table
- Check that `product_id` in cart matches `product_id` in products table

### Issue: "User not found"

**Error:**
```json
{"error": "Unauthorized. Please log in."}
```

**Solution:**
- Ensure user is logged in
- Check session is active (`req.session.user` exists)
- Verify cookies are being sent with requests

### Issue: "Duplicate key value violates unique constraint"

**Error:**
```
duplicate key value violates unique constraint "cart_items_user_id_product_id_key"
```

**Solution:**
- This shouldn't happen with the current sync logic (clears cart first)
- If it does, check that the DELETE query is executing successfully

---

## Files Created/Modified

### Backend Files Created:
- ✅ `src/models/cartModel.js` - Database queries for cart
- ✅ `src/controllers/cartController.js` - API endpoint handlers
- ✅ `src/migrations/create_cart_items_table.sql` - Database migration
- ✅ `CART_SETUP.md` - This documentation

### Backend Files Modified:
- ✅ `src/routes/item.js` - Added cart routes

### Frontend Files Modified:
- ✅ `.env` - Added `REACT_APP_CART_SYNC_URL`

---

## Next Steps

1. ✅ Run the migration SQL to create `cart_items` table
2. ✅ Restart your backend server
3. ✅ Test the endpoints using cURL or Postman
4. ✅ Login to the frontend and test cart functionality
5. ⏳ Monitor logs for any errors

---

## Support

If you encounter issues:
1. Check the backend logs for detailed error messages
2. Verify your database connection
3. Ensure all tables exist (`users`, `products`, `cart_items`)
4. Check that foreign key relationships are correct
5. Verify session is active when making requests

---

**Status:** ✅ Complete - Cart API ready for use!
