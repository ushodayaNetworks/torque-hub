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

  const car = document.querySelector('.car');
  const road = document.querySelector('.road');
  let mouseX = 0;
  let mouseY = 0;
  let carX = 0;
  let carY = 0;
  let isMoving = false;
  let lastMouseX = 0;
  let direction = 1; // 1 for right, -1 for left

  // Add car details element
  const carBody = document.querySelector('.car-body');
  const carDetails = document.createElement('div');
  carDetails.className = 'car-details';
  carBody.appendChild(carDetails);

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    // Update direction based on mouse movement
    if (mouseX > lastMouseX) {
      direction = 1;
    } else if (mouseX < lastMouseX) {
      direction = -1;
    }
    lastMouseX = mouseX;
  });

  // Smooth animation function
  function animate() {
    // Calculate distance between car and mouse
    const dx = mouseX - carX;
    const dy = mouseY - carY;
    
    // Smooth movement
    carX += dx * 0.1;
    carY += dy * 0.1;
    
    // Keep car within road bounds
    const roadRect = road.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    
    // Limit car movement to road area
    if (carX < roadRect.left + carRect.width / 2) {
      carX = roadRect.left + carRect.width / 2;
    }
    if (carX > roadRect.right - carRect.width / 2) {
      carX = roadRect.right - carRect.width / 2;
    }
    if (carY < roadRect.top) {
      carY = roadRect.top;
    }
    if (carY > roadRect.bottom - carRect.height) {
      carY = roadRect.bottom - carRect.height;
    }
    
    // Apply movement with smooth transition
    car.style.transform = `translate(${carX - carRect.width / 2}px, ${carY - carRect.height / 2}px) scaleX(${direction})`;
    
    // Add tilt effect based on movement
    const tilt = Math.min(Math.abs(dx) * 0.1, 15);
    car.style.transform += ` rotate(${direction * tilt}deg)`;
    
    // Continue animation
    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Add hover effect for car lights
  car.addEventListener('mouseenter', () => {
    const lights = document.querySelectorAll('.car-light');
    lights.forEach(light => {
      light.style.animation = 'none';
      light.style.opacity = '1';
      light.style.filter = 'brightness(1.5)';
    });
  });

  car.addEventListener('mouseleave', () => {
    const lights = document.querySelectorAll('.car-light');
    lights.forEach(light => {
      light.style.animation = 'lightBlink 1s infinite';
    });
  });
});