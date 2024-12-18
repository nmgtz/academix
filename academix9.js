const scriptURL = 'https://script.google.com/macros/s/AKfycbzB-933ZJWT5AStO7BdhxZCCyvZeRHgNEja_pqXNZXmGl8rmcdzcSJ6dilOTAbwrdXf/exec';

 document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const accountButton = document.getElementById("accountButton");
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");

  // Show the popup and overlay when the account button is clicked
  accountButton.addEventListener("click", () => {
    popup.style.display = "block"; // Show the popup
    overlay.style.display = "block"; // Show the overlay
  });

  // Hide the popup and overlay when the overlay is clicked
  overlay.addEventListener("click", () => {
    popup.style.display = "none"; // Hide the popup
    overlay.style.display = "none"; // Hide the overlay
  });

  // Add event listeners for login and register buttons
  if (loginButton && registerButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("nmgContainerDiv").style.display = "none";
      document.getElementById("login-form").style.display = "block";
      toggleForms("lg-form");
    });

    registerButton.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("nmgContainerDiv").style.display = "none";
      document.getElementById("login-form").style.display = "block";
      toggleForms("sp-form");
    });
  } else {
    console.error("Login or register button elements not found");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // Check login state on page load
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (isLoggedIn) {
    displayDashboard();
  } else {
    toggleForms('login-form');
  }

  // Handle token and email in URL parameters for password reset
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const token = urlParams.get('token');

  if (email && token) {
    toggleForms('new-password-form');
    document.querySelector('#new-password-form input[name="email"]').value = email;
    document.querySelector('#new-password-form input[name="token"]').value = token;
  }
});

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

// Function to toggle password visibility
function togglePasswordVisibility(inputName) {
  const inputField = document.querySelector(`input[name="${inputName}"]`);
  if (inputField) {
    inputField.type = inputField.type === 'password' ? 'text' : 'password';
  }
}

// Function to handle form submission (dummy example)
function submitForm(formType) {
  console.log(`Form submitted: ${formType}`);
  // Add your form handling logic here
}



function togglePasswordVisibility(inputName) {
  const passwordField = document.querySelector(`input[name="${inputName}"]`);
  if (passwordField) {
    const eyeIcon = passwordField.nextElementSibling;
    if (passwordField.type === "password") {
      passwordField.type = "text";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    } else {
      passwordField.type = "password";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    }
  }
}

function submitForm(action) {
  const formId = (action === 'signup') ? 'signup-form' :
                 (action === 'login') ? 'login-form' :
                 (action === 'generateToken') ? 'reset-form' :
                 (action === 'resetPassword') ? 'new-password-form' : null;

  if (!formId) {
    showMessage("Invalid action specified", false);
    return;
  }

  const form = document.getElementById(formId);

  if (validateForm(form, action)) {
    const formData = new FormData(form);
    formData.append("action", action);

    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        showMessage(data.message, data.result === "success");

        if (data.result === "success") {
          if (action === 'login') {
            isLoggedIn = true; // Update login state
            displayDashboard(data.dashboardData);
          } else if (['signup', 'resetPassword', 'generateToken'].includes(action)) {
            toggleForms('login-form');
          }
        }
      })
      .catch(error => showMessage('Error connecting to server', false));
  }
}

function validateForm(form, action) {
  let isValid = true;
  form.querySelectorAll('input[required], select[required]').forEach(input => {
    if (!input.value.trim()) {
      showMessage(`${input.previousElementSibling.textContent} is required.`, false);
      isValid = false;
      return;
    }
  });

  // Additional validation logic (e.g., email, phone number) can go here

  if ((action === 'signup' || action === 'resetPassword') && isValid) {
    const password = form.querySelector('input[name="newPassword"], input[name="password"]');
    const confirmPassword = form.querySelector('input[name="newConfirmPassword"], input[name="confirmPassword"]');
    
    if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/-]{8,}$/.test(password.value.trim())) {
        showMessage("Password must be at least 8 characters long and contain both letters and numbers.", false);
        isValid = false;
    }

    if (password && confirmPassword && password.value.trim() !== confirmPassword.value.trim()) {
        showMessage("Passwords do not match.", false);
        isValid = false;
    }
  }
  return isValid;
}

function showMessage(message, success = true) {
  const messageBox = document.getElementById("message-box");
  messageBox.style.display = "block";
  messageBox.className = `message ${success ? "success" : "error"}`;
  messageBox.textContent = message;

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 5000);
}

function displayDashboard(dashboardData = {}) {
  currentUsername = dashboardData.username || "";
  document.getElementById("total-views").textContent = dashboardData.totalViews || 0;
  document.getElementById("total-income").textContent = "TSHS " + (dashboardData.totalIncome || 0);

  document.getElementById("login-form").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("dashboard").querySelector("h2").textContent = `Welcome, ${currentUsername || "User"}!`;
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  toggleForms('login-form');
}
