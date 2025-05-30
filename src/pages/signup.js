import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth, handleSignup, validateEmail, validatePassword } from '../utils/auth.js';

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
  
  // Set up signup form
  setupSignupForm();
});

// Set up signup form validation and submission
function setupSignupForm() {
  const signupForm = document.getElementById('signup-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const termsCheckbox = document.getElementById('terms');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');
  const termsError = document.getElementById('terms-error');
  const signupError = document.getElementById('signup-error');
  
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
  
  confirmPasswordInput.addEventListener('blur', () => {
    if (confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordError.textContent = 'Passwords do not match';
    } else {
      confirmPasswordError.textContent = '';
    }
  });
  
  // Form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    termsError.textContent = '';
    signupError.textContent = '';
    
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
    
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordError.textContent = 'Passwords do not match';
      isValid = false;
    }
    
    if (!termsCheckbox.checked) {
      termsError.textContent = 'You must agree to the Terms & Conditions';
      isValid = false;
    }
    
    if (isValid) {
      // Disable submit button and show loading state
      const submitButton = signupForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Creating account...
      `;
      
      // Attempt signup
      const result = await handleSignup(emailInput.value, passwordInput.value, confirmPasswordInput.value);
      
      if (result.success) {
        // Show success message
        signupForm.innerHTML = `
          <div class="text-success text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h2>Account Created!</h2>
            <p>Your account has been successfully created.</p>
            <a href="/" class="btn btn-primary mt-4">Go to Homepage</a>
          </div>
        `;
      } else {
        // Show error message
        signupError.textContent = result.error;
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}