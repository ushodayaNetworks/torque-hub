import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';
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
  
  // Get car ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get('id');
  
  if (carId) {
    // Load car details
    loadCarDetails(parseInt(carId));
    
    // Set up modal functionality
    setupModal();
  } else {
    // Redirect to buy page if no car ID
    window.location.href = '/buy.html';
  }
});

// Load car details
function loadCarDetails(carId) {
  const car = getCarById(carId);
  
  if (!car) {
    // Redirect to 404 page if car not found
    window.location.href = '/404.html';
    return;
  }
  
  // Update page title
  document.title = `${car.year} ${car.make} ${car.model} - TorqueHub`;
  
  // Update car details in the DOM
  document.getElementById('car-title').textContent = `${car.year} ${car.make} ${car.model}`;
  document.getElementById('car-price').textContent = `$${car.price.toLocaleString()}`;
  document.getElementById('car-year').textContent = car.year;
  document.getElementById('car-mileage').textContent = `${car.mileage.toLocaleString()} mi`;
  document.getElementById('car-fuel').textContent = car.fuelType;
  document.getElementById('car-transmission').textContent = car.transmission;
  document.getElementById('car-color').textContent = car.color;
  document.getElementById('car-description').textContent = car.description;
  
  // Set main image
  const mainImage = document.getElementById('main-car-image');
  mainImage.src = car.images[0];
  mainImage.alt = `${car.year} ${car.make} ${car.model}`;
  
  // Create thumbnails
  const thumbnailContainer = document.getElementById('thumbnail-container');
  car.images.forEach((image, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
    thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}">`;
    
    thumbnail.addEventListener('click', () => {
      // Update main image
      mainImage.src = image;
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
      });
      thumbnail.classList.add('active');
    });
    
    thumbnailContainer.appendChild(thumbnail);
  });
  
  // Populate features list
  const featuresList = document.getElementById('car-features');
  car.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featuresList.appendChild(li);
  });
  
  // Set up save car button
  const saveCarBtn = document.getElementById('save-car-btn');
  const savedCars = JSON.parse(localStorage.getItem('savedCars') || '[]');
  
  if (savedCars.includes(car.id)) {
    saveCarBtn.classList.add('saved');
    saveCarBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
      Saved
    `;
  }
  
  saveCarBtn.addEventListener('click', () => {
    const isSaved = saveCarBtn.classList.contains('saved');
    
    if (isSaved) {
      // Remove from saved cars
      const updatedSavedCars = savedCars.filter(id => id !== car.id);
      localStorage.setItem('savedCars', JSON.stringify(updatedSavedCars));
      
      saveCarBtn.classList.remove('saved');
      saveCarBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        Save Car
      `;
    } else {
      // Add to saved cars
      if (!savedCars.includes(car.id)) {
        savedCars.push(car.id);
      }
      localStorage.setItem('savedCars', JSON.stringify(savedCars));
      
      saveCarBtn.classList.add('saved');
      saveCarBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        Saved
      `;
    }
  });
  
  // Load similar cars (same make or same vehicle type)
  loadSimilarCars(car);
}

// Load similar cars
function loadSimilarCars(currentCar) {
  const similarCarsContainer = document.getElementById('similar-cars');
  
  // Find cars of the same make or similar price range
  const similarCars = cars.filter(car => 
    car.id !== currentCar.id && 
    (car.make === currentCar.make || 
     Math.abs(car.price - currentCar.price) < 5000)
  ).slice(0, 3);
  
  if (similarCars.length === 0) {
    // If no similar cars found, just show random cars
    const randomCars = cars
      .filter(car => car.id !== currentCar.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    randomCars.forEach(car => {
      const card = createCarCard(car);
      similarCarsContainer.appendChild(card);
    });
  } else {
    similarCars.forEach(car => {
      const card = createCarCard(car);
      similarCarsContainer.appendChild(card);
    });
  }
}

// Set up contact modal functionality
function setupModal() {
  const contactBtn = document.getElementById('contact-seller-btn');
  const modal = document.getElementById('contact-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const contactForm = document.getElementById('contact-form');
  
  contactBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Handle form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success message
    const formActions = contactForm.querySelector('.form-actions');
    formActions.innerHTML = `
      <div class="text-success" style="text-align: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h3>Message Sent!</h3>
        <p>The seller will contact you soon.</p>
      </div>
    `;
    
    // Close modal after 3 seconds
    setTimeout(() => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form
      setTimeout(() => {
        contactForm.reset();
        formActions.innerHTML = `
          <button type="submit" class="btn btn-primary btn-block">Send Message</button>
        `;
      }, 500);
    }, 3000);
  });
}