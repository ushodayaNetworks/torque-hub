// Create and append the header to the page
export const createHeader = () => {
  const header = document.createElement('header');
  header.className = 'header';
  
  header.innerHTML = `
    <div class="navbar">
      <a href="/" class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        TorqueHub
      </a>
      
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/buy.html">Buy Cars</a>
        <a href="/sell.html">Sell Your Car</a>
        <a href="/reviews.html">Reviews</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
      </nav>
      
      <div class="nav-actions">
        <div class="auth-links">
          <!-- Will be populated by auth.js -->
        </div>
        
        <button class="theme-toggle-nav">
          <!-- Will be populated by theme.js -->
        </button>
        
        <button class="mobile-menu-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </div>
    
    <div class="mobile-menu">
      <div class="mobile-menu-header">
        <a href="/" class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          TorqueHub
        </a>
        
        <button class="mobile-menu-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <nav class="mobile-nav-links">
        <a href="/">Home</a>
        <a href="/buy.html">Buy Cars</a>
        <a href="/sell.html">Sell Your Car</a>
        <a href="/reviews.html">Reviews</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a href="/login.html">Login</a>
        <a href="/signup.html">Sign Up</a>
        <a href="/profile.html" class="profile-link hidden">Profile</a>
      </nav>
    </div>
  `;
  
  document.body.prepend(header);
  
  // Add event listeners for mobile menu
  const mobileMenuToggle = header.querySelector('.mobile-menu-toggle');
  const mobileMenuClose = header.querySelector('.mobile-menu-close');
  const mobileMenu = header.querySelector('.mobile-menu');
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
  });
  
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
  
  // Add theme toggle event listener
  const themeToggleNav = header.querySelector('.theme-toggle-nav');
  themeToggleNav.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('torquehub-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.dispatchEvent(new CustomEvent('themeToggle', { detail: { theme: newTheme } }));
  });
  
  // Add scroll detection for theme toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  });
  
  return header;
};

// Add floating theme toggle button
export const createThemeToggleButton = () => {
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  
  document.body.appendChild(themeToggle);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('torquehub-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.dispatchEvent(new CustomEvent('themeToggle', { detail: { theme: newTheme } }));
  });
  
  return themeToggle;
};