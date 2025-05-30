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

  // Initialize review functionality
  initReviews();
  
  // Initialize animated rating counter
  initRatingCounter();
});

function initReviews() {
  const reviewModal = document.getElementById('review-modal');
  const writeReviewBtn = document.getElementById('write-review');
  const closeModalBtn = reviewModal.querySelector('.modal-close');
  const reviewForm = document.getElementById('review-form');
  const loadMoreBtn = document.getElementById('load-more');
  const reviewSort = document.getElementById('review-sort');
  const ratingInput = document.querySelector('.rating-input');

  // Initialize star rating system
  initStarRating();

  // Write Review Button
  writeReviewBtn.addEventListener('click', () => {
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close Modal
  closeModalBtn.addEventListener('click', () => {
    reviewModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close when clicking outside modal
  reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Handle form submission
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const title = document.getElementById('review-title').value;
    const text = document.getElementById('review-text').value;
    const carDetails = document.getElementById('car-details').value;
    
    // Store review in localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push({
      rating,
      title,
      text,
      carDetails,
      date: new Date().toISOString(),
      user: {
        name: 'Anonymous User',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Show success message
    reviewForm.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle" style="color: var(--success-color); margin-bottom: 1rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h2>Thank You!</h2>
        <p>Your review has been submitted successfully.</p>
      </div>
    `;

    // Close modal and refresh reviews
    setTimeout(() => {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
      loadReviews();
      
      // Reset form
      setTimeout(() => {
        reviewForm.reset();
      }, 500);
    }, 2000);
  });

  // Load More Button
  let currentPage = 1;
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    loadReviews(currentPage);
  });

  // Sort Reviews
  reviewSort.addEventListener('change', () => {
    currentPage = 1;
    loadReviews(currentPage, reviewSort.value);
  });

  // Initial load
  loadReviews();
}

function initStarRating() {
  const stars = document.querySelectorAll('.rating-input label');
  
  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const rating = star.getAttribute('for').replace('star', '');
      highlightStars(rating);
    });
    
    star.addEventListener('mouseout', () => {
      const selectedRating = document.querySelector('input[name="rating"]:checked')?.value || 0;
      highlightStars(selectedRating);
    });
  });
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.rating-input label');
  stars.forEach((star, index) => {
    star.style.color = index < rating ? 'var(--color-accent)' : 'var(--text-secondary)';
  });
}

function initRatingCounter() {
  const ratingElement = document.querySelector('.rating-summary div');
  const targetRating = 4.8;
  let currentRating = 0;
  
  const animate = () => {
    if (currentRating < targetRating) {
      currentRating += 0.1;
      ratingElement.textContent = currentRating.toFixed(1);
      requestAnimationFrame(animate);
    } else {
      ratingElement.textContent = targetRating.toFixed(1);
    }
  };
  
  animate();
}

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "2 days ago",
    title: "Excellent buying experience!",
    content: "Found my dream car within a week in Mumbai. The process was smooth and transparent. The car was exactly as described, and I got a great deal. The team was very professional and helpful throughout the process.",
    car: "2020 BMW 3 Series"
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "1 week ago",
    title: "Quick and easy selling process",
    content: "Listed my car in Delhi and had multiple interested buyers within days. The platform made it easy to communicate and finalize the sale. The verification process was thorough but quick.",
    car: "2019 Honda Civic"
  },
  {
    id: 3,
    name: "Arjun Reddy",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4,
    date: "2 weeks ago",
    title: "Good experience overall",
    content: "The website was easy to navigate and I found what I was looking for in Bangalore. The only minor issue was scheduling the viewing, but the customer service team was very helpful in resolving it.",
    car: "2021 Toyota Camry"
  },
  {
    id: 4,
    name: "Ananya Patel",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "3 weeks ago",
    title: "Fantastic platform!",
    content: "As a first-time seller in Chennai, I was nervous about the process. TorqueHub made everything straightforward and secure. The payment process was smooth and I received my money quickly.",
    car: "2018 Hyundai Creta"
  },
  {
    id: 5,
    name: "Vikram Singh",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "1 month ago",
    title: "Best car buying experience ever",
    content: "The detailed car history reports and transparent pricing made it easy to make an informed decision in Pune. The test drive was well-organized and the staff was knowledgeable.",
    car: "2022 Tata Nexon EV"
  },
  {
    id: 6,
    name: "Meera Kapoor",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4,
    date: "1 month ago",
    title: "Great service, minor delays",
    content: "The car selection was excellent and the prices were competitive in Hyderabad. There were some delays in the paperwork processing, but the team kept me informed throughout.",
    car: "2020 Mahindra XUV700"
  },
  {
    id: 7,
    name: "Rahul Verma",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "2 months ago",
    title: "Smooth transaction from start to finish",
    content: "I sold my car through TorqueHub in Kolkata and couldn't be happier. The valuation was fair, and the buyer verification process gave me peace of mind. Highly recommend!",
    car: "2019 Maruti Swift"
  },
  {
    id: 8,
    name: "Sneha Gupta",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "2 months ago",
    title: "Excellent customer support",
    content: "The customer service team was incredibly helpful throughout my car buying journey in Ahmedabad. They answered all my questions promptly and made the process stress-free.",
    car: "2021 Kia Seltos"
  }
];

// Function to load reviews
function loadReviews(page = 1, sortBy = 'recent') {
  const reviewsContainer = document.querySelector('.reviews-grid');
  if (!reviewsContainer) return;

  // Clear existing reviews
  reviewsContainer.innerHTML = '';

  // Sort reviews based on the selected option
  let sortedReviews = [...sampleReviews];
  switch (sortBy) {
    case 'highest':
      sortedReviews.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      sortedReviews.sort((a, b) => a.rating - b.rating);
      break;
    case 'recent':
    default:
      // Already sorted by date in the sample data
      break;
  }

  // Show only first 3 reviews initially
  const reviewsToShow = page === 1 ? sortedReviews.slice(0, 3) : sortedReviews;

  // Create and append review cards
  reviewsToShow.forEach(review => {
    const reviewCard = createReviewCard(review);
    reviewsContainer.appendChild(reviewCard);
  });

  // Update load more button text
  const loadMoreBtn = document.getElementById('load-more');
  if (page === 1 && sortedReviews.length > 3) {
    loadMoreBtn.textContent = 'See More Reviews';
    loadMoreBtn.disabled = false;
  } else {
    loadMoreBtn.textContent = 'All Reviews Loaded';
    loadMoreBtn.disabled = true;
  }
}

// Function to create a review card
function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card';
  
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  
  card.innerHTML = `
    <div class="review-header">
      <img src="${review.avatar}" alt="${review.name}" class="review-avatar">
      <div>
        <h3>${review.name}</h3>
        <div class="rating-stars">${stars}</div>
      </div>
    </div>
    <p class="review-date">${review.date}</p>
    <h4>${review.title}</h4>
    <p>${review.content}</p>
    <div class="review-car">
      <p>${review.car}</p>
    </div>
  `;
  
  return card;
} 