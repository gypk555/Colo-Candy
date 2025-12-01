import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { clearFiltersAtom, setSearchQueryAtom } from '../../atoms/productAtoms';

const ProductNotFound = ({ type = 'filters' }) => {
  const navigate = useNavigate();
  const clearFilters = useSetAtom(clearFiltersAtom);
  const setSearchQuery = useSetAtom(setSearchQueryAtom);

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleContinueShopping = () => {
    clearFilters();
    navigate('/');
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      {/* Illustration */}
      <div className="text-7xl mb-6 opacity-75">
        {type === 'search' ? '🔍' : '🛍️'}
      </div>

      {/* Main Message */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
        {type === 'search' ? 'No Products Found' : 'No Products Match Your Filters'}
      </h2>

      {/* Sub Message */}
      <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
        {type === 'search'
          ? "We couldn't find any products matching your search. Try different keywords or explore our categories."
          : "It looks like there are no products that match your selected filters. Try adjusting your search criteria."}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-40">
        <button
          onClick={handleClearFilters}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg cursor-pointer"
        >
          {type === 'search' ? 'Clear Search' : 'Clear All Filters'}
        </button>
        <button
          onClick={handleContinueShopping}
          className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      {/* Suggestion */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Suggestions:</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Check the spelling of your search</li>
          <li>• Try using different keywords or filters</li>
          <li>• Browse our full product catalog</li>
          <li>• Contact support if you need help</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductNotFound;
