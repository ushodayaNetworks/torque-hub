// Theme management functions
const THEME_KEY = 'torquehub-theme';

// Initialize theme based on user preference or system preference
export const initTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
  
  // Add scroll listener to handle navbar and theme toggle visibility
  window.addEventListener('scroll', handleScroll);
  handleScroll();
};

// Set theme and save preference
export const setTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcons('light');
  }
  
  localStorage.setItem(THEME_KEY, theme);
};

// Toggle between light and dark themes
export const toggleTheme = () => {
  const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
};

// Handle scroll events for navbar and theme toggle visibility
const handleScroll = () => {
  const scrollTop = window.scrollY;
  const header = document.querySelector('.header');
  
  if (scrollTop > 100) {
    document.body.classList.add('scrolled');
    if (header) {
      header.classList.add('hidden');
    }
  } else {
    document.body.classList.remove('scrolled');
    if (header) {
      header.classList.remove('hidden');
    }
  }
};

// Update SVG icons for the theme toggle buttons
const updateThemeIcons = (theme) => {
  const themeToggles = document.querySelectorAll('.theme-toggle, .theme-toggle-nav');
  
  themeToggles.forEach(toggle => {
    if (theme === 'dark') {
      toggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      `;
    } else {
      toggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      `;
    }
  });
};