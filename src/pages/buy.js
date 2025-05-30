import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';
import { cars, filterCars, getUniqueValues } from '../data/cars.js';
import { renderCarList } from '../components/carCard.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Create header and footer
  createHeader();
  createFooter();
  createThemeToggleButton();
  
  // Initialize theme
  initTheme();
  
  // Initialize authentication
  initAuth();
  
  // Listen for theme toggle events
  document.addEventListener('themeToggle', (e) => {
    setTheme(e.detail.theme);
  });
  
  // Initialize filter form
  initFilterForm();
  
  // Load all cars initially
  loadCars(cars);
});

// Initialize filter form with options
function initFilterForm() {
  const filterForm = document.getElementById('car-filter-form');
  const makeSelect = document.getElementById('make');
  const typeSelect = document.getElementById('type');
  
  // Populate make dropdown
  const makes = getUniqueValues('make');
  makes.forEach(make => {
    const option = document.createElement('option');
    option.value = make;
    option.textContent = make;
    makeSelect.appendChild(option);
  });
  
  // Clear existing type options except "All Types"
  while (typeSelect.options.length > 1) {
    typeSelect.remove(1);
  }
  
  // Add predefined type options
  const types = ['Luxury', 'Sports', 'Electric', 'Hybrid'];
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
  
  // Add filter form submit event
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const filters = {
      make: makeSelect.value,
      type: typeSelect.value,
      minPrice: document.getElementById('min-price').value ? parseInt(document.getElementById('min-price').value) : null,
      maxPrice: document.getElementById('max-price').value ? parseInt(document.getElementById('max-price').value) : null,
      minYear: document.getElementById('min-year').value ? parseInt(document.getElementById('min-year').value) : null,
      maxYear: document.getElementById('max-year').value ? parseInt(document.getElementById('max-year').value) : null
    };
    
    const sortBy = document.getElementById('sort-by').value;
    
    // Filter cars
    let filteredCars = filterCars(filters);
    
    // Sort cars
    filteredCars = sortCars(filteredCars, sortBy);
    
    // Display filtered cars
    loadCars(filteredCars);
  });
}

// Sort cars based on selected criteria
function sortCars(cars, sortBy) {
  const sortedCars = [...cars];
  
  switch (sortBy) {
    case 'price-asc':
      sortedCars.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedCars.sort((a, b) => b.price - a.price);
      break;
    case 'year-desc':
      sortedCars.sort((a, b) => b.year - a.year);
      break;
    case 'year-asc':
      sortedCars.sort((a, b) => a.year - b.year);
      break;
    case 'mileage-asc':
      sortedCars.sort((a, b) => a.mileage - b.mileage);
      break;
    default:
      // Default to price low to high
      sortedCars.sort((a, b) => a.price - b.price);
  }
  
  return sortedCars;
}

// Load cars into the listings container
function loadCars(cars) {
  const carListingsContainer = document.getElementById('car-listings');
  const resultsCount = document.getElementById('results-count');
  
  // Update results count
  resultsCount.textContent = cars.length;
  
  // Render car list
  renderCarList(cars, carListingsContainer);
}