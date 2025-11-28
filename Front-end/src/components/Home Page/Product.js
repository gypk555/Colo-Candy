import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading products...</div>
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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5 min-h-[60vh]">
      {products.map((product) => (
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg overflow-hidden bg-white transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
        >
          {product.image && (
            <img
              className="w-full h-[250px] md:h-[200px] object-cover"
              src={`data:image/jpeg;base64,${product.image}`}
              alt={product.name}
            />
          )}

          <div className="p-2.5 text-center w-full">
            <h3 className="text-base font-bold mb-2.5 truncate" title={product.name}>
              {product.name}
            </h3>
            <p className="text-gray-600 mb-2.5 font-semibold">INR {product.price}</p>
            <p className="text-sm text-gray-700 line-clamp-2" title={product.description}>
              {product.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ProductGrid };
