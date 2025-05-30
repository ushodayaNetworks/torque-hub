import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';

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
});