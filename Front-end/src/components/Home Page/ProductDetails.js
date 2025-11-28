import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

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
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h2>
        <p className="text-xl md:text-2xl font-bold text-green-600 mb-4">INR {product.price}</p>
        <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

        <div className="flex flex-col gap-3">
          <button className="w-full p-3 text-base font-medium cursor-pointer border-none rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors">
            🛒 Add to Cart
          </button>
          <button className="w-full p-3 text-base font-medium cursor-pointer border-none rounded bg-green-600 text-white hover:bg-green-700 transition-colors">
            💳 Buy Now
          </button>
          <button className="w-full p-3 text-base font-medium cursor-pointer border-none rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
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
