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
  priceRanges: [], // Array of selected price ranges [{ min, max }, ...]
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

  // Generate price ranges with smart intervals
  const priceRanges = [];
  const priceRange = maxPrice - minPrice;

  // Determine interval based on price range
  let interval;
  if (priceRange <= 1000) {
    interval = 100;
  } else if (priceRange <= 5000) {
    interval = 500;
  } else if (priceRange <= 20000) {
    interval = 1000;
  } else {
    interval = 5000;
  }

  // Generate ranges starting from minPrice
  for (let i = minPrice; i < maxPrice; i += interval) {
    const rangeMax = Math.min(i + interval - 1, maxPrice);
    priceRanges.push({
      label: `${i.toLocaleString('en-IN')} - ${rangeMax.toLocaleString('en-IN')}`,
      min: i,
      max: rangeMax
    });
  }

  // Ensure we have at least the full range option
  if (priceRanges.length === 0) {
    priceRanges.push({
      label: `${minPrice.toLocaleString('en-IN')} - ${maxPrice.toLocaleString('en-IN')}`,
      min: minPrice,
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

  // Apply price filter (supports multiple price ranges)
  if (filters.priceRanges.length > 0) {
    filtered = filtered.filter(product =>
      filters.priceRanges.some(range =>
        product.price >= range.min && product.price <= range.max
      )
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

// Toggle price range filter (supports multiple selections)
export const setPriceRangeAtom = atom(
  null,
  (get, set, priceRange) => {
    const filters = get(activeFiltersAtom);
    const priceRanges = filters.priceRanges;

    // Check if this range is already selected
    const isAlreadySelected = priceRanges.some(r =>
      r.min === priceRange.min && r.max === priceRange.max
    );

    // Toggle: add if not selected, remove if already selected
    const updatedPriceRanges = isAlreadySelected
      ? priceRanges.filter(r => !(r.min === priceRange.min && r.max === priceRange.max))
      : [...priceRanges, priceRange];

    set(activeFiltersAtom, {
      ...filters,
      priceRanges: updatedPriceRanges
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
      priceRanges: [],
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
