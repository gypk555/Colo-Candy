import { atom } from 'jotai';

/**
 * Product Atoms
 *
 * Global state for products, filters, and search
 */

// All products from API
export const productsAtom = atom([]);

// Search query
export const searchQueryAtom = atom('');

// Sort option: 'price-low-high', 'price-high-low', 'popularity'
export const sortByAtom = atom('');

// Active filters
export const activeFiltersAtom = atom({
  brands: [], // Array of selected brand names
  priceRange: null, // { min, max }
  availability: null, // true/false or null
});

// Dynamically calculated filter options based on products
export const filterOptionsAtom = atom((get) => {
  const products = get(productsAtom);

  // Get unique brands
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

  // Calculate dynamic price ranges
  if (products.length === 0) {
    return { brands: [], priceRanges: [] };
  }

  const prices = products.map(p => p.price).sort((a, b) => a - b);
  const minPrice = Math.floor(prices[0]);
  const maxPrice = Math.ceil(prices[prices.length - 1]);

  // Generate price ranges: 0-500, 500-1000, 1000-1500, etc.
  const priceRanges = [];
  const interval = 500;

  for (let i = minPrice; i < maxPrice; i += interval) {
    priceRanges.push({
      label: `${i} - ${Math.min(i + interval - 1, maxPrice)}`,
      min: i,
      max: Math.min(i + interval - 1, maxPrice)
    });
  }

  // Add final range for remaining prices
  if (maxPrice > minPrice && priceRanges[priceRanges.length - 1]?.max < maxPrice) {
    priceRanges.push({
      label: `${priceRanges[priceRanges.length - 1]?.max + 1}+`,
      min: priceRanges[priceRanges.length - 1]?.max + 1,
      max: maxPrice
    });
  }

  return { brands, priceRanges };
});

// Filtered and sorted products
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchQuery = get(searchQueryAtom).toLowerCase();
  const filters = get(activeFiltersAtom);
  const sortBy = get(sortByAtom);

  // Apply search filter
  let filtered = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery));

    return matchesSearch;
  });

  // Apply brand filter
  if (filters.brands.length > 0) {
    filtered = filtered.filter(product =>
      filters.brands.includes(product.brand)
    );
  }

  // Apply price filter
  if (filters.priceRange) {
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );
  }

  // Apply availability filter
  if (filters.availability !== null) {
    filtered = filtered.filter(product =>
      product.available === filters.availability
    );
  }

  // Apply sorting
  if (sortBy === 'price-low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high-low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'popularity') {
    // Assuming products have a popularity/rating field
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return filtered;
});

// Action atoms

// Set search query
export const setSearchQueryAtom = atom(
  null,
  (get, set, query) => {
    set(searchQueryAtom, query);
  }
);

// Set sort by
export const setSortByAtom = atom(
  null,
  (get, set, sortOption) => {
    set(sortByAtom, sortOption);
  }
);

// Update filters
export const setFiltersAtom = atom(
  null,
  (get, set, filters) => {
    set(activeFiltersAtom, filters);
  }
);

// Toggle brand filter
export const toggleBrandFilterAtom = atom(
  null,
  (get, set, brand) => {
    const filters = get(activeFiltersAtom);
    const updatedBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];

    set(activeFiltersAtom, {
      ...filters,
      brands: updatedBrands
    });
  }
);

// Set price range filter
export const setPriceRangeAtom = atom(
  null,
  (get, set, priceRange) => {
    const filters = get(activeFiltersAtom);
    set(activeFiltersAtom, {
      ...filters,
      priceRange
    });
  }
);

// Set availability filter
export const setAvailabilityAtom = atom(
  null,
  (get, set, available) => {
    const filters = get(activeFiltersAtom);
    set(activeFiltersAtom, {
      ...filters,
      availability: available
    });
  }
);

// Clear all filters
export const clearFiltersAtom = atom(
  null,
  (get, set) => {
    set(activeFiltersAtom, {
      brands: [],
      priceRange: null,
      availability: null
    });
    set(searchQueryAtom, '');
    set(sortByAtom, '');
  }
);

// Set all products
export const setProductsAtom = atom(
  null,
  (get, set, products) => {
    set(productsAtom, products);
  }
);
