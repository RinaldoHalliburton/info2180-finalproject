window.onload = function () {
  //Button action for login
  document
    .getElementById("login-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let email = document.getElementById("email-input").value.trim();
      let password = document.getElementById("password-input").value.trim();
      var viewButton;
      var errorDiv = document.getElementById("error-div");
      var loginDiv = document.getElementById("login-div");
      var dashboardDiv = document.getElementById("dashboard-div");
      var viewContactDiv = document.getElementById("view-contacts-div");
      let xhr = new XMLHttpRequest();
      let params = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      xhr.open(
        "POST",
        "http://localhost/info2180-finalproject/startup.php",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          response = xhr.responseText;
          loadDashboard(response);
        }
      };
      xhr.send(params);
    });

  //Button action for view contact
  document
    .getElementById("dashboard-div")
    .addEventListener("click", function (event) {
      let params;
      // Check if the clicked element is a View button
      if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "view"
      ) {
        const columnIndex = 1;
        const row = event.target.closest("tr");
        //console.log(row.cells[columnIndex].textContent.trim());
        params = `email=${encodeURIComponent(
          row.cells[columnIndex].textContent.trim()
        )}`;
      }
      let xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "http://localhost/info2180-finalproject/viewcontact.php",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          response = xhr.responseText;
          console.log(response);
          //loadContact(response);
        }
      };
      xhr.send(params);
    });
};

function loadDashboard(response) {
  errorDiv = document.getElementById("error-div");
  loginDiv = document.getElementById("login-div");
  dashboardDiv = document.getElementById("dashboard-div");

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
      dashboardDiv.innerHTML = "Dashboard";
      dashboardDiv.innerHTML += response;

      const table = dashboardDiv.querySelector("table");
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row, index) => {
        if (index === 0) {
          return;
        }
        // Create the new td
        const newTd = document.createElement("td");

        // Create the button
        viewButton = document.createElement("button");
        viewButton.textContent = "view";

        // Append the button to the td
        newTd.appendChild(viewButton);

        // Append the td to the row
        row.appendChild(newTd);
      });
    }
  }
}
