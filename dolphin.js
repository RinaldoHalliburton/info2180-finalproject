window.onload = loadLogin;

function loadLogin() {
  //Button action for login
  document
    .getElementById("login-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var email_input = document.getElementById("email-input");
      var password_input = document.getElementById("password-input");
      let email = email_input.value.trim();
      let password = password_input.value.trim();
      let xhr = new XMLHttpRequest();
      let params = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      xhr.open("POST", "startup.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          response = xhr.responseText;
          loadDashboard(response, email_input, password_input);
        }
      };
      xhr.send(params);
    });
}

function loadDashboard(response, email_input, password_input) {
  let errorDiv = document.getElementById("error-div");
  let loginDiv = document.getElementById("login-div");
  let dashboardDiv = document.getElementById("dashboard-div");
  var viewButton;
  let title = document.getElementById("title-div");

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
      email_input.value = "";
      password_input.value = "";
      title.innerHTML = "Dashboard";
      dashboardDiv.style.display = "block";
      dashboardDiv.innerHTML = response;

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
  const buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      let params;
      // Check if the clicked element is a View button
      if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "view" &&
        event.target
      ) {
        const columnIndex = 0;
        const row = event.target.closest("tr");
        //console.log(row.cells[columnIndex].textContent.trim());
        params = `id=${encodeURIComponent(
          row.cells[columnIndex].textContent.trim()
        )}`;
      }
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "viewcontact.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          response = xhr.responseText;
          title.style.display = "none";
          loadContact(response, params);
        }
      };
      xhr.send(params);
    });
  }
}

function loadContact(response, params) {
  let contactDiv = document.getElementById("view-contact-div");
  let errorDiv = document.getElementById("error-div");
  let loginDiv = document.getElementById("login-div");
  let dashboardDiv = document.getElementById("dashboard-div");
  let assignButton = document.createElement("button");
  let typeButton = document.createElement("button");
  let addnote = document.createElement("button");
  let buttonDiv = document.createElement("div");
  let title = document.createElement("title-div");
  buttonDiv.className = "button-group";
  let htmlCont = "";
  if (errorDiv) errorDiv.style.display = "none"; // Hide error div
  if (loginDiv) loginDiv.style.display = "none"; // Hide login form
  if (dashboardDiv) dashboardDiv.style.display = "none"; // Hide dashboard
  if (contactDiv) {
    contactDiv.style.display = "block";
    title.style.display = "block";
    try {
      response = JSON.parse(response);
    } catch (error) {
      console.log("An error occurred:", error.message);
    }

    for (const [key, value] of Object.entries(response)) {
      htmlCont += `<p>${key}: ${value}</p>`;
    }

    contactDiv.innerHTML = htmlCont;

    //Assign to me button
    assignButton.textContent = "Assign to me ";
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-hand-paper-o");
    assignButton.appendChild(icon);
    assignButton.classList.add("styled-button");
    buttonDiv.appendChild(assignButton);

    //Swap type Button
    typeButton.textContent = "Swap type";
    typeButton.classList.add("styled-button");
    buttonDiv.appendChild(typeButton);

    //contactDiv.appendChild(assignButton);
    //typeButton.textContent = "Swap type";
    //contactDiv.appendChild(typeButton);
    //saveButton.textContent = "Save notes";
    contactDiv.appendChild(buttonDiv);
  }
  assignButton.addEventListener("click", function (e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "switchAdmin.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        response = xhr.responseText;
        console.log(response);
        try {
          response = JSON.parse(response);
        } catch (error) {
          console.log("An error occurred:", error.message);
        }
        console.log(response);
        let htmlCont = "";
        //contactDiv.innerHTML = htmlCont;
        //response = JSON.parse(response);
        for (const [key, value] of Object.entries(response)) {
          htmlCont += `<p>${key}: ${value}</p>`;
        }
        console.log(htmlCont);
        contactDiv.innerHTML = htmlCont;
      }
    };
    xhr.send(params);
  });
  return;
}
