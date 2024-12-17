const scriptURL = 'https://script.google.com/macros/s/AKfycbzB-933ZJWT5AStO7BdhxZCCyvZeRHgNEja_pqXNZXmGl8rmcdzcSJ6dilOTAbwrdXf/exec';

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

function toggleForms(formId) {
  document.querySelectorAll('form').forEach(form => {
    form.classList.remove('active');
    form.style.display = 'none';
  });

  const formToShow = document.getElementById(formId);
  if (formToShow) {
    formToShow.classList.add('active');
    formToShow.style.display = 'block';
  }
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
