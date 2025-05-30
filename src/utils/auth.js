import { auth, loginUser, registerUser, logoutUser, getCurrentUser } from '../services/firebase';

// Handle user authentication state
export const initAuth = async () => {
  const user = await getCurrentUser();
  updateAuthUI(user);
  
  // Listen for auth state changes
  auth.onAuthStateChanged(user => {
    updateAuthUI(user);
  });
};

// Update UI based on authentication state
const updateAuthUI = (user) => {
  const authLinks = document.querySelectorAll('.auth-links');
  const profileLinks = document.querySelectorAll('.profile-link');
  const userNameElements = document.querySelectorAll('.user-name');
  const authProtectedElements = document.querySelectorAll('[data-auth-required]');
  
  if (user) {
    // User is signed in
    authLinks.forEach(links => {
      links.innerHTML = `
        <a href="/profile.html" class="btn btn-sm btn-primary">Profile</a>
        <button id="logout-button" class="btn btn-sm btn-outline">Logout</button>
      `;
      
      const logoutButton = links.querySelector('#logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
          await logoutUser();
          window.location.href = '/';
        });
      }
    });
    
    profileLinks.forEach(link => {
      link.classList.remove('hidden');
    });
    
    userNameElements.forEach(element => {
      element.textContent = user.displayName || user.email.split('@')[0];
    });
    
    authProtectedElements.forEach(element => {
      element.classList.remove('hidden');
    });
  } else {
    // User is signed out
    authLinks.forEach(links => {
      links.innerHTML = `
        <a href="/login.html" class="btn btn-sm btn-outline">Login</a>
        <a href="/signup.html" class="btn btn-sm btn-primary">Sign Up</a>
      `;
    });
    
    profileLinks.forEach(link => {
      link.classList.add('hidden');
    });
    
    authProtectedElements.forEach(element => {
      element.classList.add('hidden');
    });
  }
};

// Form validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Handle login form submission
export const handleLogin = async (email, password) => {
  if (!validateEmail(email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }
  
  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }
  
  const result = await loginUser(email, password);
  
  if (result.user) {
    return { success: true };
  } else {
    return { success: false, error: result.error };
  }
};

// Handle signup form submission
export const handleSignup = async (email, password, confirmPassword) => {
  if (!validateEmail(email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }
  
  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }
  
  const result = await registerUser(email, password);
  
  if (result.user) {
    return { success: true };
  } else {
    return { success: false, error: result.error };
  }
};