window.onload = function () {
  document
    .getElementById("login-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let email = document.getElementById("email-input").value.trim();
      let password = document.getElementById("password-input").value.trim();
      let xhr = new XMLHttpRequest();
      let params = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      xhr.open(
        "POST",
        "http://localhost/info2180-finalproject/dolphin.php",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          response = xhr.responseText;
          verify(response);
        }
      };
      xhr.send(params);
    });
};

function verify(response) {
  const errorDiv = document.getElementById("error-div");
  const loginDiv = document.getElementById("login-div");
  const dashboardDiv = document.getElementById("dashboard-div");

  if (response === "Incorrect password.") {
    // Display error message for incorrect password
    errorDiv.innerHTML = response;
    errorDiv.style.display = "block";
  } else if (response === "Email not found.") {
    // Display error message for email not found
    errorDiv.innerHTML = response;
    errorDiv.style.display = "block";
  } else if (response === "Invalid request method.") {
    // Display error message for invalid request method
    errorDiv.innerHTML = response;
    errorDiv.style.display = "block";
  } else {
    // Success - Hide error and login div, show dashboard
    if (errorDiv) errorDiv.style.display = "none"; // Hide error div
    if (loginDiv) loginDiv.style.display = "none"; // Hide login form

    if (dashboardDiv) {
      // Load the response into the dashboard div
      dashboardDiv.style.display = "block";
      dashboardDiv.innerHTML = response; // Assuming the response is HTML content
    }
  }
}
