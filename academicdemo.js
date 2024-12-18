// Function to toggle between forms
function toggleForms(formIdToShow) {
  // Get all form containers
  const forms = document.querySelectorAll('.form-container');
  
  // Hide all forms
  forms.forEach((form) => {
    form.style.display = 'none';
  });
  
  // Show the selected form
  const selectedForm = document.getElementById(formIdToShow);
  if (selectedForm) {
    selectedForm.style.display = 'block';
  }
}

// Initial setup: Show the login form by default
document.addEventListener('DOMContentLoaded', () => {
  toggleForms('lg-form'); // Show the login form initially
});
