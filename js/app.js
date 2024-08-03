document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll('.checkbox');
  const innerCircle = document.getElementById('innerCircle');
  const percentageSpan = document.getElementById('percentage');
  const soundClick = "sounds/click.mp3";
  const soundButton = "sounds/button.mp3";
  const soundButtonElement = document.querySelector('.sound-button');
  const volumeIcon = soundButtonElement.querySelector('.volume-icon');
  const mutedIcon = soundButtonElement.querySelector('.muted-icon');
  let soundEnabled = true;

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

        // Play the sound if enabled
        if (soundEnabled) {
          const sound = new Audio(soundClick);
          sound.play();
        }
      });
    });

    const savedProgressCirclePercentage = localStorage.getItem('progressCirclePercentage');
    if (savedProgressCirclePercentage) {
      // Update the progress circle if there is a saved state in localStorage
      const dashValue = `${savedProgressCirclePercentage} 100`;
      innerCircle.style.strokeDasharray = dashValue;
      percentageSpan.textContent = Math.round(savedProgressCirclePercentage) + '%';
    }

    // Load the sound button state
    const savedSoundState = localStorage.getItem('soundEnabled');
    if (savedSoundState === 'false') {
      soundEnabled = false;
      volumeIcon.style.display = 'none';
      mutedIcon.style.display = 'block';
      soundButtonElement.setAttribute('aria-label', 'Activar sonido');
    } else {
      soundEnabled = true;
      volumeIcon.style.display = 'block';
      mutedIcon.style.display = 'none';
      soundButtonElement.setAttribute('aria-label', 'Desactivar sonido');
    }
  }

  // Function to clear checkboxes and progress circle
  function clearCheckboxesAndProgressCircle() {
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      localStorage.removeItem(checkbox.id);
    });
    innerCircle.style.strokeDasharray = '0 100';
    percentageSpan.textContent = '0%';
    localStorage.removeItem('progressCirclePercentage');
  }

  // Function to toggle sound
  function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    if (soundEnabled) {
      volumeIcon.style.display = 'block';
      mutedIcon.style.display = 'none';
      soundButtonElement.setAttribute('aria-label', 'Desactivar sonido');
    } else {
      volumeIcon.style.display = 'none';
      mutedIcon.style.display = 'block';
      soundButtonElement.setAttribute('aria-label', 'Activar sonido');
    }
  }

  // Load checkboxes, progress circle, and sound state from localStorage
  loadFromLocalStorage();

  // Add click event to the sound button
  soundButtonElement.addEventListener('click', toggleSound);

  // Get the clear button
  const clearButton = document.querySelector('.clear-button');

  // Add click event to the clear button
  clearButton.addEventListener('click', function () {
    clearCheckboxesAndProgressCircle();

    // Play the clear button sound if enabled
    if (soundEnabled) {
      const sound = new Audio(soundButton);
      sound.play();
    }
  });
});
