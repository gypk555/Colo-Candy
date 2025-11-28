import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  cartAtom,
  cartTotalAtom,
  cartDirtyAtom,
  removeFromCartAtom,
  updateCartQuantityAtom,
  clearCartAtom
} from "../../../atoms/cartAtoms";
import { isLoggedInAtom } from "../../../atoms/authAtoms";
import { syncCartToBackend } from "../../../services/cartSyncService";

const Cart = () => {
  const navigate = useNavigate();
  const cart = useAtomValue(cartAtom);
  const cartTotal = useAtomValue(cartTotalAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const [isDirty, setIsDirty] = useAtom(cartDirtyAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const updateQuantity = useSetAtom(updateCartQuantityAtom);
  const clearCart = useSetAtom(clearCartAtom);
  const [syncing, setSyncing] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 0) {
      updateQuantity({ productId, quantity });
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const handleProceedToCheckout = async () => {
    // Sync cart to database before checkout if user is logged in
    if (isLoggedIn && isDirty) {
      setSyncing(true);
      try {
        await syncCartToBackend(cart);
        setIsDirty(false);
      } catch (error) {
        console.error('Failed to sync cart before checkout:', error);
      } finally {
        setSyncing(false);
      }
    }

    // Navigate to checkout page (to be implemented)
    alert("Checkout functionality coming soon!");
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some items to your cart to get started!</p>
        <button
          className="px-6 py-2.5 bg-zinc-800 text-white rounded cursor-pointer hover:bg-zinc-700 transition-colors"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-[60vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              {/* Product Image */}
              {item.image && (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded"
                />
              )}

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-green-600 font-semibold text-lg">
                  INR {item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

                <p className="text-gray-700 font-semibold sm:mt-2">
                  Subtotal: INR {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Items ({cart.reduce((total, item) => total + item.quantity, 0)}):</span>
                <span>INR {cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="text-green-600">FREE</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">INR {cartTotal}</span>
              </div>
            </div>

            <button
              className="w-full py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleProceedToCheckout}
              disabled={syncing}
            >
              {syncing ? 'Syncing cart...' : 'Proceed to Checkout'}
            </button>

            <button
              className="w-full py-3 bg-zinc-800 text-white rounded font-semibold hover:bg-zinc-700 transition-colors"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
