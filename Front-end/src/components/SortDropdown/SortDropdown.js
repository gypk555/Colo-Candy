import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sortByAtom } from '../../atoms/productAtoms';

const SortDropdown = () => {
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: '', label: 'Sort By', icon: '⬍' },
    { value: 'price-low-high', label: 'Price: Low to High', icon: '↑' },
    { value: 'price-high-low', label: 'Price: High to Low', icon: '↓' },
    { value: 'popularity', label: 'Popularity', icon: '⭐' }
  ];

  const currentSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-semibold text-gray-700 min-w-48"
      >
        <span className="text-xl">{currentSort.icon}</span>
        <span className="flex-1 text-left">{currentSort.label}</span>
        <span className={`text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 overflow-hidden">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 ${
                sortBy === option.value
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
              {sortBy === option.value && (
                <span className="ml-auto text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
