import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Skeleton loading component for product cards
const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-300"></div>

      {/* Content skeleton */}
      <div className="p-2.5 w-full space-y-2">
        {/* Title skeleton */}
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        {/* Price skeleton */}
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        {/* Description skeleton */}
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch items from the database
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(process.env.REACT_APP_ADMIN_URL);
      setProducts(response.data);
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 min-h-[60vh]">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="text-xl text-red-600">{error}</div>
        <button
          onClick={fetchItems}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">No products available yet.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 ">
        {products.map((product) => (
          <div
            className="flex flex-col w-[25vh] h-[25vh] border border-gray-300 rounded-lg overflow-hidden bg-white transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
          >
            {product.image && (
              <img
                className="w-50 h-50 2xl:w-[20vh] 2xl:h-[20vh] p-2 object-cover"
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
              />
            )}

            <div className="p-2.5 w-full">
              <h3 className="text-sm font-bold mb-1.5 truncate" title={product.name}>
                {product.name}
              </h3>
              <p className="text-gray-600 mb-1.5 font-semibold text-sm">INR {product.price}</p>
              <p className="text-xs text-gray-700 line-clamp-2" title={product.description}>
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProductGrid };
