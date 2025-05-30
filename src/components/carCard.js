// Create a car card component
export function createCarCard(car) {
  const card = document.createElement('a');
  card.href = `/car-details.html?id=${car.id}`;
  card.className = 'car-card';
  card.style.textDecoration = 'none';
  card.style.color = 'inherit';
  card.style.display = 'block';
  
  // Format price in Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol'
  }).format(car.price);
  
  card.innerHTML = `
    <div class="car-image">
      <img src="${car.images[0]}" alt="${car.year} ${car.make} ${car.model}">
      <button class="save-button" data-action="save">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        Save
      </button>
    </div>
    <div class="car-info">
      <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
      <div class="car-price">${formattedPrice}</div>
      <div class="car-specs">
        <div class="spec">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          ${car.year}
        </div>
        <div class="spec">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gauge"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
          ${car.mileage.toLocaleString()}
        </div>
        <div class="spec">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
          ${car.type}
        </div>
      </div>
    </div>
  `;
  
  // Add event listener for save button
  const saveButton = card.querySelector('.save-button');
  saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle saved state
    const isSaved = saveButton.classList.contains('saved');
    
    if (isSaved) {
      saveButton.classList.remove('saved');
      saveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        Save
      `;
      
      // Remove from saved cars
      const savedCars = JSON.parse(localStorage.getItem('savedCars') || '[]');
      const updatedSavedCars = savedCars.filter(id => id !== car.id);
      localStorage.setItem('savedCars', JSON.stringify(updatedSavedCars));
    } else {
      saveButton.classList.add('saved');
      saveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
        Saved
      `;
      
      // Add to saved cars
      const savedCars = JSON.parse(localStorage.getItem('savedCars') || '[]');
      if (!savedCars.includes(car.id)) {
        savedCars.push(car.id);
      }
      localStorage.setItem('savedCars', JSON.stringify(savedCars));
    }
  });
  
  // Check if car is saved
  const savedCars = JSON.parse(localStorage.getItem('savedCars') || '[]');
  if (savedCars.includes(car.id)) {
    saveButton.classList.add('saved');
    saveButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
      Saved
    `;
  }
  
  return card;
}

// Render a list of car cards
export const renderCarList = (cars, container) => {
  container.innerHTML = '';
  
  if (cars.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-x"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <h3>No cars found</h3>
      <p>Try adjusting your filters or search terms</p>
    `;
    container.appendChild(noResults);
    return;
  }
  
  cars.forEach(car => {
    const card = createCarCard(car);
    container.appendChild(card);
  });
};