import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth, handleLogin, validateEmail, validatePassword } from '../utils/auth.js';

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
  
  // Set up login form
  setupLoginForm();
});

// Set up login form validation and submission
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const loginError = document.getElementById('login-error');
  
  // Input validation
  emailInput.addEventListener('blur', () => {
    if (emailInput.value && !validateEmail(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address';
    } else {
      emailError.textContent = '';
    }
  });
  
  passwordInput.addEventListener('blur', () => {
    if (passwordInput.value && !validatePassword(passwordInput.value)) {
      passwordError.textContent = 'Password must be at least 6 characters long';
    } else {
      passwordError.textContent = '';
    }
  });
  
  // Form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';
    loginError.textContent = '';
    
    // Validate form
    let isValid = true;
    
    if (!validateEmail(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!validatePassword(passwordInput.value)) {
      passwordError.textContent = 'Password must be at least 6 characters long';
      isValid = false;
    }
    
    if (isValid) {
      // Disable submit button and show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Logging in...
      `;
      
      // Attempt login
      const result = await handleLogin(emailInput.value, passwordInput.value);
      
      if (result.success) {
        // Redirect to home page on successful login
        window.location.href = '/';
      } else {
        // Show error message
        loginError.textContent = result.error;
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}