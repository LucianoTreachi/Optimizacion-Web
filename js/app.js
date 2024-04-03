document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll('.checkbox');
  const innerCircle = document.getElementById('innerCircle');
  const percentageSpan = document.getElementById('percentage');

  // Function to update the progress circle
  function updateProgressCircle() {
    const totalCheckboxes = checkboxes.length;
    const checkedCheckboxes = document.querySelectorAll('.checkbox:checked').length;
    const percentage = (checkedCheckboxes / totalCheckboxes) * 100;
    percentageSpan.textContent = Math.round(percentage) + '%';

    // Modify the stroke-dasharray property of the inner circle
    const dashValue = `${percentage} 100`;
    innerCircle.style.strokeDasharray = dashValue;

    // Save the state of the circle in localStorage
    localStorage.setItem('progressCirclePercentage', percentage);
  }

  // Function to load checkboxes and progress circle state from localStorage
  function loadFromLocalStorage() {
    checkboxes.forEach(checkbox => {
      const savedState = localStorage.getItem(checkbox.id);
      if (savedState) {
        checkbox.checked = savedState === 'true';
      }
      checkbox.addEventListener('change', function () {
        localStorage.setItem(checkbox.id, checkbox.checked);
        updateProgressCircle();
      });
    });

    const savedProgressCirclePercentage = localStorage.getItem('progressCirclePercentage');
    if (savedProgressCirclePercentage) {
      // Update the progress circle if there is a saved state in localStorage
      const dashValue = `${savedProgressCirclePercentage} 100`;
      innerCircle.style.strokeDasharray = dashValue;
      percentageSpan.textContent = Math.round(savedProgressCirclePercentage) + '%';
    }
  }

  // Clear checkboxes and progress circle
  function clearCheckboxesAndProgressCircle() {
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      localStorage.removeItem(checkbox.id);
    });
    innerCircle.style.strokeDasharray = '0 100';
    percentageSpan.textContent = '0%';
    localStorage.removeItem('progressCirclePercentage');
  }

  // Load checkboxes and progress circle state from localStorage
  loadFromLocalStorage();

  // Get the clear button
  const clearButton = document.querySelector('.clear-button');

  // Add click event to the clear button
  clearButton.addEventListener('click', clearCheckboxesAndProgressCircle);
});