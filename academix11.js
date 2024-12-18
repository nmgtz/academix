  // Get elements
  const accountButton = document.getElementById("accountButton");
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");

  // Show the popup and overlay when the account button is clicked
  accountButton.addEventListener("click", (e) => {
    e.preventDefault();
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
