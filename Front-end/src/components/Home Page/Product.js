import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import axios from "axios";
import SortDropdown from "../SortDropdown/SortDropdown";
import FilterPanel from "../FilterPanel/FilterPanel";
import ProductNotFound from "../ProductNotFound/ProductNotFound";
import { productsAtom, filteredProductsAtom, setProductsAtom, setSearchQueryAtom, searchQueryAtom } from "../../atoms/productAtoms";

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
  const [allProducts, setAllProducts] = useAtom(productsAtom);
  const setProductsData = useSetAtom(setProductsAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const setSearchQuery = useSetAtom(setSearchQueryAtom);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Fetch items from the database
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(process.env.REACT_APP_ADMIN_URL);
      setProductsData(response.data);
      console.log("products list ", response.data);
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    if (allProducts.length === 0) {
      fetchItems();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        {/* Sort and Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 py-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 font-semibold">Loading products...</div>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 px-4">
        <div className="text-xl text-red-600 text-center">{error}</div>
        <button
          onClick={fetchItems}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasFilters = filteredProducts.length !== allProducts.length || searchQuery;
  const showNotFound = filteredProducts.length === 0;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Sort and Filter Bar */}
      <div className="sticky top-16 bg-white border-b border-gray-200 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Left Section: Results Count */}
            <div className="text-sm text-gray-600 font-semibold">
              Showing <span className="text-blue-600 font-bold">{filteredProducts.length}</span> products
              {hasFilters && <span className="text-blue-600"> (filtered)</span>}
            </div>

            {/* Right Section: Sort and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <SortDropdown />
              <button
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-semibold text-gray-700"
              >
                <span className="text-xl">🔽</span>
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel Modal */}
      <FilterPanel isOpen={filterPanelOpen} onClose={() => setFilterPanelOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-20">
        <div className="flex gap-6">
          {/* Main Content Area - Full Width */}
          <div className="w-full">
            {showNotFound ? (
              <ProductNotFound type={searchQuery ? 'search' : 'filters'} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    className="flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-white transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer shadow-sm hover:shadow-md group"
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                      {product.image && (
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={`data:image/jpeg;base64,${product.image}`}
                          alt={product.name}
                        />
                      )}

                      {/* Availability Badge */}
                      {product.available !== undefined && (
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full ${
                              product.available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.available ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-2.5 w-full">
                      {/* Brand */}
                      {product.brand && (
                        <div className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mb-2">
                          {product.brand}
                        </div>
                      )}

                      {/* Product Name */}
                      <h3 className="text-sm font-bold mb-1.5 truncate group-hover:text-blue-600 transition-colors" title={product.name}>
                        {product.name}
                      </h3>

                      {/* Price */}
                      <p className="text-gray-600 mb-1.5 font-semibold text-sm">
                        ₹{product.price}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-gray-700 line-clamp-2" title={product.description}>
                        {product.description}
                      </p>

                      {/* Rating (if available) */}
                      {product.rating && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductGrid };
