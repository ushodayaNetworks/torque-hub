import { createHeader, createThemeToggleButton } from '../components/header.js';
import { createFooter } from '../components/footer.js';
import { initTheme, setTheme } from '../utils/theme.js';
import { initAuth } from '../utils/auth.js';

// Initialize FAQ dropdowns
function initFAQs() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.faq-icon');
      
      // Toggle current FAQ
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
      icon.style.transform = answer.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
      
      // Close other FAQs
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question) {
          const otherAnswer = otherQuestion.nextElementSibling;
          const otherIcon = otherQuestion.querySelector('.faq-icon');
          otherAnswer.style.display = 'none';
          otherIcon.style.transform = 'rotate(0)';
        }
      });
    });
  });
}

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
  
  // Add social button styles
  addSocialButtonStyles();
  
  // Initialize contact form
  initContactForm();
  
  // Initialize FAQs
  initFAQs();
});

// Add social button styles
function addSocialButtonStyles() {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .social-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--bg-secondary);
      color: var(--text-main);
      transition: all 0.2s ease;
    }
    
    .social-button:hover {
      background-color: var(--color-primary);
      color: white;
      transform: translateY(-3px);
    }
  `;
  
  document.head.appendChild(styleEl);
}

// Initialize contact form
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real app, we would send the form data to the server
    // For this demo, we'll just show a success message
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Show success message
    contactForm.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle" style="color: var(--success-color); margin-bottom: 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h2>Message Sent!</h2>
        <p>Thank you for contacting us, ${name}. We'll get back to you as soon as possible.</p>
      </div>
    `;
  });
}