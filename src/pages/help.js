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
  
  // Initialize search functionality
  initSearch();
});

// Initialize search functionality
function initSearch() {
  const searchInput = document.querySelector('.help-search-input');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const helpTopics = document.querySelectorAll('.help-topic-group li');
    
    helpTopics.forEach(topic => {
      const text = topic.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        topic.style.display = '';
      } else {
        topic.style.display = 'none';
      }
    });
  });
}