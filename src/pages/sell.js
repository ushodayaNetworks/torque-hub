import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';
import { auth } from '../services/firebase.js';

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
  
  // Add styles for sell page
  addSellStyles();
  
  // Check if user is authenticated
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in, show sell form
      document.querySelector('[data-auth-required]').style.display = 'block';
      document.getElementById('auth-required-message').style.display = 'none';
      
      // Initialize sell form
      initSellForm();
    } else {
      // User is not signed in, show auth required message
      document.querySelector('[data-auth-required]').style.display = 'none';
      document.getElementById('auth-required-message').style.display = 'block';
    }
  });
});

// Add sell page specific styles
function addSellStyles() {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Styles for sell page */
    .file-upload-container {
      margin-bottom: 1rem;
    }

    .file-upload-input {
      display: none;
    }

    .file-upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .file-upload-label:hover {
      background-color: var(--bg-secondary);
    }

    .file-upload-label svg {
      margin-bottom: 1rem;
      color: var(--color-primary);
    }

    .photo-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .photo-item {
      position: relative;
      height: 150px;
      border-radius: 8px;
      overflow: hidden;
    }

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-remove {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 24px;
      height: 24px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .photo-remove:hover {
      background-color: var(--error-color);
    }

    /* Success Message */
    .success-message {
      text-align: center;
      padding: 3rem;
    }

    .success-message svg {
      color: var(--success-color);
      margin-bottom: 1rem;
    }

    .success-message h2 {
      margin-bottom: 1rem;
    }

    .success-message p {
      margin-bottom: 2rem;
    }
  `;
  
  document.head.appendChild(styleEl);
}

// Initialize sell form
function initSellForm() {
  const sellForm = document.getElementById('sell-car-form');
  const photoInput = document.getElementById('car-photos');
  const photoPreview = document.getElementById('photo-preview');
  
  // Handle photo upload
  photoInput.addEventListener('change', (e) => {
    const files = e.target.files;
    
    if (files.length > 5) {
      alert('You can only upload up to 5 photos');
      return;
    }
    
    photoPreview.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
          <img src="${e.target.result}" alt="Car photo">
          <div class="photo-remove">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
        `;
        
        photoPreview.appendChild(photoItem);
        
        // Add remove event listener
        const removeButton = photoItem.querySelector('.photo-remove');
        removeButton.addEventListener('click', () => {
          photoItem.remove();
        });
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // Handle form submission
  sellForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;
    const mileage = document.getElementById('mileage').value;
    const color = document.getElementById('color').value;
    const fuelType = document.getElementById('fuel-type').value;
    const transmission = document.getElementById('transmission').value;
    const description = document.getElementById('description').value;
    
    // Get selected features
    const features = [];
    if (document.getElementById('feature-ac').checked) features.push('Air Conditioning');
    if (document.getElementById('feature-bluetooth').checked) features.push('Bluetooth');
    if (document.getElementById('feature-camera').checked) features.push('Backup Camera');
    if (document.getElementById('feature-leather').checked) features.push('Leather Seats');
    if (document.getElementById('feature-navigation').checked) features.push('Navigation System');
    if (document.getElementById('feature-sunroof').checked) features.push('Sunroof');
    if (document.getElementById('feature-cruise').checked) features.push('Cruise Control');
    if (document.getElementById('feature-keyless').checked) features.push('Keyless Entry');
    if (document.getElementById('feature-heated').checked) features.push('Heated Seats');
    
    // For a real app, we would submit this data to the server
    // For this demo, we'll just show a success message
    
    // Show success message
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = `
      <div class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h2>Listing Submitted!</h2>
        <p>Your ${year} ${make} ${model} has been submitted for review.</p>
        <p>We'll notify you once your listing is live.</p>
        <a href="/" class="btn btn-primary">Return to Home</a>
      </div>
    `;
  });
}