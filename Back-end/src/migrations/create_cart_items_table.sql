-- Create cart_items table for shopping cart functionality
-- Run this SQL script in your PostgreSQL database

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign keys
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,

  -- Ensure one cart item per product per user
  UNIQUE (user_id, product_id),

  -- Constraints
  CHECK (quantity > 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Add comment for documentation
COMMENT ON TABLE cart_items IS 'Stores shopping cart items for users';
COMMENT ON COLUMN cart_items.user_id IS 'References users table';
COMMENT ON COLUMN cart_items.product_id IS 'References products table';
COMMENT ON COLUMN cart_items.quantity IS 'Number of items in cart (must be > 0)';
COMMENT ON COLUMN cart_items.created_at IS 'Timestamp when item was added to cart';
