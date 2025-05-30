import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';
import { auth, logoutUser } from '../services/firebase.js';
import { cars, getCarById } from '../data/cars.js';
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
  
  // Check if user is authenticated
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, show profile content
      document.querySelector('[data-auth-required]').style.display = 'block';
      document.getElementById('auth-required-message').style.display = 'none';
      
      // Initialize profile page
      initProfilePage(user);
    } else {
      // User is not signed in, show auth required message
      document.querySelector('[data-auth-required]').style.display = 'none';
      document.getElementById('auth-required-message').style.display = 'block';
    }
  });
  
  // Add modal styles if not already added
  addModalStyles();
});

// Add modal styles
function addModalStyles() {
  if (!document.getElementById('modal-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'modal-styles';
    styleEl.textContent = `
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        overflow: auto;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .modal.active {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
      }

      .modal-content {
        background-color: var(--card-bg);
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }

      .modal.active .modal-content {
        transform: translateY(0);
      }

      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-header h2 {
        margin-bottom: 0;
      }

      .modal-close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
      }

      .modal-body {
        padding: 1.5rem;
      }
    `;
    
    document.head.appendChild(styleEl);
  }
}

// Initialize profile page
function initProfilePage(user) {
  // Set user information
  document.querySelector('.user-name').textContent = user.displayName || user.email.split('@')[0];
  document.querySelector('.user-email').textContent = user.email;
  document.querySelector('.user-initial').textContent = (user.displayName || user.email)[0].toUpperCase();
  
  document.getElementById('email').value = user.email;
  
  if (user.displayName) {
    document.getElementById('display-name').value = user.displayName;
  }
  
  // Load saved cars
  loadSavedCars();
  
  // Set up logout button
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await logoutUser();
    window.location.href = '/';
  });
  
  // Set up save profile button
  document.getElementById('save-profile-btn').addEventListener('click', () => {
    // Show success message
    const displayName = document.getElementById('display-name').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    
    // In a real app, we would update the user profile in the database
    
    // Show success alert
    alert('Profile updated successfully!');
    
    // Update display name in the UI
    document.querySelector('.user-name').textContent = displayName || user.email.split('@')[0];
    document.querySelector('.user-initial').textContent = (displayName || user.email)[0].toUpperCase();
  });
  
  // Set up dark mode toggle
  const darkModeCheckbox = document.getElementById('dark-mode');
  const currentTheme = localStorage.getItem('torquehub-theme') || 'light';
  
  darkModeCheckbox.checked = currentTheme === 'dark';
  
  darkModeCheckbox.addEventListener('change', () => {
    const newTheme = darkModeCheckbox.checked ? 'dark' : 'light';
    document.dispatchEvent(new CustomEvent('themeToggle', { detail: { theme: newTheme } }));
  });
  
  // Set up change password modal
  const passwordModal = document.getElementById('password-modal');
  const changePasswordBtn = document.getElementById('change-password-btn');
  const closeModalBtn = passwordModal.querySelector('.modal-close');
  const changePasswordForm = document.getElementById('change-password-form');
  
  changePasswordBtn.addEventListener('click', () => {
    passwordModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeModalBtn.addEventListener('click', () => {
    passwordModal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close when clicking outside the modal content
  passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
      passwordModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Handle password change form submission
  changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Clear previous errors
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirm-password-error').textContent = '';
    
    // Validate new password
    if (newPassword.length < 6) {
      document.getElementById('password-error').textContent = 'Password must be at least 6 characters long';
      return;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
      return;
    }
    
    // In a real app, we would update the user's password in the database
    
    // Show success message
    changePasswordForm.innerHTML = `
      <div style="text-align: center; padding: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle" style="color: var(--success-color); margin-bottom: 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h3>Password Updated</h3>
        <p>Your password has been changed successfully.</p>
      </div>
    `;
    
    // Close modal after 2 seconds
    setTimeout(() => {
      passwordModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form
      setTimeout(() => {
        changePasswordForm.innerHTML = `
          <div class="form-group">
            <label for="current-password" class="form-label">Current Password</label>
            <input type="password" id="current-password" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label for="new-password" class="form-label">New Password</label>
            <input type="password" id="new-password" class="form-input" required>
            <div id="password-error" class="form-error"></div>
          </div>
          
          <div class="form-group">
            <label for="confirm-password" class="form-label">Confirm New Password</label>
            <input type="password" id="confirm-password" class="form-input" required>
            <div id="confirm-password-error" class="form-error"></div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-block">Update Password</button>
          </div>
        `;
      }, 500);
    }, 2000);
  });
}

// Load saved cars
function loadSavedCars() {
  const savedCarsContainer = document.getElementById('saved-cars');
  const savedCarIds = JSON.parse(localStorage.getItem('savedCars') || '[]');
  
  if (savedCarIds.length === 0) {
    // Show no saved cars message
    return;
  }
  
  // Clear no saved cars message
  savedCarsContainer.innerHTML = '';
  
  // Get saved cars data
  const savedCars = savedCarIds.map(id => getCarById(id)).filter(car => car !== undefined);
  
  // Create car cards
  savedCars.forEach(car => {
    const card = createCarCard(car);
    savedCarsContainer.appendChild(card);
  });
}