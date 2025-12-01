import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { cartAtom, addToCartAtom, removeFromCartAtom } from "../../atoms/cartAtoms";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const cart = useAtomValue(cartAtom);
  const addToCart = useSetAtom(addToCartAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const [showMessage, setShowMessage] = useState(null);

  // Check if product is already in cart
  const isInCart = cart.some(item => item.id === product?.id);

  const handleToggleCart = () => {
    if (isInCart) {
      removeFromCart(product.id);
      setShowMessage({ type: 'success', text: 'Item removed from cart!' });
    } else {
      addToCart(product);
      setShowMessage({ type: 'success', text: 'Item added to cart!' });
    }
    setTimeout(() => setShowMessage(null), 3000);
  };

  const handleBuyNow = () => {
    // Only add if not already in cart
    if (!isInCart) {
      addToCart(product);
    }
    navigate('/cart');
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const brandText = product.brand ? ` by ${product.brand}` : '';
    const shareData = {
      title: product.name,
      text: `Check out ${product.name}${brandText} - ₹${product.price}`,
      url: shareUrl
    };

    try {
      // Try using Web Share API (mobile browsers)
      if (navigator.share) {
        await navigator.share(shareData);
        setShowMessage({ type: 'success', text: 'Shared successfully!' });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setShowMessage({ type: 'success', text: 'Link copied to clipboard!' });
      }
      setTimeout(() => setShowMessage(null), 3000);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setShowMessage({ type: 'error', text: 'Failed to share' });
        setTimeout(() => setShowMessage(null), 3000);
      }
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
        <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <button
          className="px-6 py-2.5 bg-zinc-800 text-white rounded cursor-pointer hover:bg-zinc-700 transition-colors"
          onClick={() => navigate("/")}
        >
          ⬅️ Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row flex-wrap max-w-screen-xl mx-auto p-5 md:items-start items-center gap-5">
      <div className="flex-1 text-center w-full md:w-auto">
        {product.image && (
          <img
            src={`data:image/jpeg;base64,${product.image}`}
            alt={product.name}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        )}
      </div>

      <div className="flex-1 p-5 w-full md:w-auto md:text-left text-center">
        {/* Brand Name */}
        {product.brand && (
          <p className="text-sm md:text-base text-gray-500 font-semibold mb-2">
            Brand: <span className="text-gray-700 font-bold">{product.brand}</span>
          </p>
        )}

        {/* Product Name */}
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h2>

        {/* Price */}
        <p className="text-xl md:text-2xl font-bold text-green-600 mb-4">₹{product.price}</p>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

        {/* Availability */}
        {product.available !== undefined && (
          <p className={`text-base font-semibold mb-4 ${product.available ? 'text-green-600' : 'text-red-600'}`}>
            {product.available ? '✓ In Stock' : '✗ Out of Stock'}
          </p>
        )}

        {showMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded ${
              showMessage.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {showMessage.text}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            className={`w-full p-3 text-base font-medium cursor-pointer border-none rounded text-white transition-colors ${
              isInCart
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={handleToggleCart}
          >
            {isInCart ? '🗑️ Remove from Cart' : '🛒 Add to Cart'}
          </button>
          <button
            className="w-full p-3 text-base font-medium cursor-pointer border-none rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            onClick={handleBuyNow}
          >
            💳 Buy Now
          </button>
          <button
            className="w-full p-3 text-base font-medium cursor-pointer border-none rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            onClick={handleShare}
          >
            🔗 Share
          </button>
          <button
            className="w-full p-3 text-base font-medium cursor-pointer border-none rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            onClick={() => navigate("/")}
          >
            ⬅️ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
