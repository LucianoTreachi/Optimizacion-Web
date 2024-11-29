// Get the hero title
const heroTitle = document.querySelector('.hero-title');
const localStorageKey = heroTitle.textContent.trim();

// Progress elements and checkboxes
const checkboxes = document.querySelectorAll('.checkbox');
const progressBar = document.querySelector('.progress-bar');
const progressPercentage = document.querySelector('.progress-percentage');
const totalCheckboxes = checkboxes.length;

// Clear button
const clearButton = document.querySelector('.clear-checkboxes-btn');

// Store progress in localStorage
function storeProgress() {
  // Get checked indices
  const checkedIndexes = Array.from(checkboxes)
    .map((checkbox, index) => checkbox.checked ? index : null)
    .filter(index => index !== null); // Keep only checked indices

  // Calculate progress percentage
  const progress = Math.round((checkedIndexes.length / totalCheckboxes) * 100);

  // Store both progress percentage and checked indices
  localStorage.setItem(`${localStorageKey}-progress`, progress);
  localStorage.setItem(`${localStorageKey}-checked`, JSON.stringify(checkedIndexes));
}

// Get stored progress percentage
function getStoredProgress() {
  return parseInt(localStorage.getItem(`${localStorageKey}-progress`)) || 0;
}

// Get stored checked indices
function getStoredCheckedIndexes() {
  const stored = localStorage.getItem(`${localStorageKey}-checked`);
  return stored ? JSON.parse(stored) : [];
}

// Interpolate color based on progress percentage
function interpolateColor(percent) {
  const startColor = { r: 255, g: 165, b: 0 }; // Orange
  const endColor = { r: 138, g: 207, b: 130 }; // Green

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percent / 100));
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percent / 100));
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percent / 100));

  return `rgb(${r}, ${g}, ${b})`;
}

// Update the progress bar
function updateProgressBar() {
  const checkedCheckboxes = document.querySelectorAll('.checkbox:checked').length;
  const progress = Math.round((checkedCheckboxes / totalCheckboxes) * 100);

  // Update progress bar visually
  progressBar.style.width = progress + '%';
  progressBar.style.backgroundColor = interpolateColor(progress);
  progressPercentage.textContent = progress + '%';

  // Update ARIA attribute for accessibility
  progressBar.setAttribute('aria-valuenow', progress);

  storeProgress();
}

// Restore progress when the page loads
function restoreProgress() {
  const storedProgress = getStoredProgress();
  const storedCheckedIndexes = getStoredCheckedIndexes();

  // Restore checked checkboxes
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = storedCheckedIndexes.includes(index);
  });

  // Update progress bar visually 
  progressBar.style.width = storedProgress + '%';
  progressBar.style.backgroundColor = interpolateColor(storedProgress);
  progressPercentage.textContent = storedProgress + '%';

  // Update ARIA attribute for accessibility
  progressBar.setAttribute('aria-valuenow', storedProgress);
}

// Clear (uncheck) all checkboxes
function clearCheckboxes() {
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Update progress after clearing checkboxes
  updateProgressBar();
}

// Add listeners to checkboxes
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateProgressBar);
});

// Add event listener to the clear button
clearButton.addEventListener('click', clearCheckboxes);

// Restore progress when the page loads
restoreProgress();
