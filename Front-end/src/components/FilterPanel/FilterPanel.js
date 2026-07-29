import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  filterOptionsAtom,
  activeFiltersAtom,
  toggleBrandFilterAtom,
  setPriceRangeAtom,
  setAvailabilityAtom,
  clearFiltersAtom
} from '../../atoms/productAtoms';

const FilterPanel = ({ isOpen, onClose }) => {
  const filterOptions = useAtomValue(filterOptionsAtom);
  const [filters, setFilters] = useAtom(activeFiltersAtom);
  const toggleBrand = useSetAtom(toggleBrandFilterAtom);
  const setPriceRange = useSetAtom(setPriceRangeAtom);
  const setAvailability = useSetAtom(setAvailabilityAtom);
  const clearFilters = useSetAtom(clearFiltersAtom);
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    price: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandChange = (brand) => {
    toggleBrand(brand);
  };

  const handlePriceChange = (priceRange) => {
    setPriceRange(
      filters.priceRange?.min === priceRange.min && filters.priceRange?.max === priceRange.max
        ? null
        : priceRange
    );
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(filters.availability === value ? null : value);
  };

  const hasActiveFilters = filters.brands.length > 0 || filters.priceRange || filters.availability !== null;

  return (
    <>
      {/* Overlay - Allows closing by clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto transition-transform duration-300 z-50 top-0 pt-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('brands')}
            className="flex justify-between items-center w-full pb-3 border-b border-gray-200 hover:text-blue-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Brand</h3>
            <span className="text-lg">{expandedSections.brands ? '▼' : '▶'}</span>
          </button>

          {expandedSections.brands && (
            <div className="mt-4 space-y-3">
              {filterOptions.brands.length > 0 ? (
                filterOptions.brands.map(brand => (
                  <label key={brand} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                      {brand}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No brands available</p>
              )}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex justify-between items-center w-full pb-3 border-b border-gray-200 hover:text-blue-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Price</h3>
            <span className="text-lg">{expandedSections.price ? '▼' : '▶'}</span>
          </button>

          {expandedSections.price && (
            <div className="mt-4 space-y-3">
              {filterOptions.priceRanges.length > 0 ? (
                filterOptions.priceRanges.map((range, idx) => (
                  <label key={idx} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                      onChange={() => handlePriceChange(range)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                      INR {range.label}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No price ranges available</p>
              )}
            </div>
          )}
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('availability')}
            className="flex justify-between items-center w-full pb-3 border-b border-gray-200 hover:text-blue-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Availability</h3>
            <span className="text-lg">{expandedSections.availability ? '▼' : '▶'}</span>
          </button>

          {expandedSections.availability && (
            <div className="mt-4 space-y-3">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.availability === true}
                  onChange={() => handleAvailabilityChange(true)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  In Stock
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.availability === false}
                  onChange={() => handleAvailabilityChange(false)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  Out of Stock
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => {
              clearFilters();
              onClose();
            }}
            className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            disabled={!hasActiveFilters}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">{`${filters.brands.length > 0 ? filters.brands.length : ''} ${filters.brands.length > 0 ? 'brand' : ''} ${filters.brands.length > 1 ? 's' : ''}${filters.priceRange ? ', price' : ''}${filters.availability !== null ? ', availability' : ''}`}
                Active Filter{(filters.brands.length + (filters.priceRange ? 1 : 0) + (filters.availability !== null ? 1 : 0)) > 1 ? 's' : ''}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterPanel;
