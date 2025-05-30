import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';
import { cars } from '../data/cars.js';
import { createCarCard } from '../components/carCard.js';

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
  
  // Load featured cars (first 3 cars from the data)
  loadFeaturedCars();
});

// Load featured cars
function loadFeaturedCars() {
  const featuredCarsContainer = document.getElementById('featured-cars');
  
  // Get first 3 cars for featured section
  const featuredCars = cars.slice(0, 3);
  
  featuredCars.forEach(car => {
    const card = createCarCard(car);
    featuredCarsContainer.appendChild(card);
  });
}