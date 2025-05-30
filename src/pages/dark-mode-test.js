import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme, toggleTheme } from '../utils/theme.js';
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
  
  // Get current theme
  const currentTheme = localStorage.getItem('torquehub-theme') || 'light';
  document.getElementById('current-theme').textContent = currentTheme;
  
  // Set up theme toggle button
  const toggleButton = document.getElementById('toggle-theme-btn');
  
  toggleButton.addEventListener('click', () => {
    toggleTheme();
    
    // Update current theme display
    const newTheme = localStorage.getItem('torquehub-theme') || 'light';
    document.getElementById('current-theme').textContent = newTheme;
  });
  
  // Listen for theme toggle events
  document.addEventListener('themeToggle', (e) => {
    setTheme(e.detail.theme);
    document.getElementById('current-theme').textContent = e.detail.theme;
  });
});