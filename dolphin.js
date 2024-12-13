window.onload = loadLogin;

function loadLogin() {
  //Button action for login
  document
    .getElementById("login-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let errorDiv = document.getElementById("error-div");
      let loginDiv = document.getElementById("login-div");
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
            loginDiv.style.display = "none";
            errorDiv.style.display = "none";
            email_input.value = "";
            password_input.value = "";
            loadDashboard(response);
          }
        }
      };
      xhr.send(params);
    });
}

function loadDashboard(response) {
  var viewButton;
  let dashboardDiv = document.getElementById("dashboard-div");
  let filterDiv = document.getElementById("filter-div");
  let title = document.getElementById("title");

  // Load the response into the dashboard div
  title.innerHTML = "Dashboard";
  title.style.display = "block";
  dashboardDiv.style.display = "block";

  const label = document.createElement("label");
  label.setAttribute("for", "filter");
  label.textContent = "Filter by:";

  // Create the select element
  const select = document.createElement("select");
  select.id = "filter";

  // Create option elements
  const optionAll = document.createElement("option");
  optionAll.textContent = "All";

  const optionSales = document.createElement("option");
  optionSales.textContent = "Sales Lead";

  const optionSupport = document.createElement("option");
  optionSupport.textContent = "Support";

  const optionAssigned = document.createElement("option");
  optionAssigned.textContent = "Assigned to me";

  // Append the options to the select
  select.appendChild(optionAll);
  select.appendChild(optionSales);
  select.appendChild(optionSupport);
  select.appendChild(optionAssigned);

  //dashboardDiv.appendChild(label);
  //dashboardDiv.appendChild(select);

  dashboardDiv.innerHTML = response;
  filterDiv.appendChild(label);
  filterDiv.appendChild(select);

  const table = dashboardDiv.querySelector("table");
  const rows = table.querySelectorAll("tbody tr");
  rows.forEach((row, index) => {
    if (index === 0) {
      return;
    }
    // Create the new td
    const newTd = document.createElement("td");

    //create button for view
    viewButton = document.createElement("button");
    viewButton.textContent = "view";

    // Append the button to the td
    newTd.appendChild(viewButton);

    // Append the td to the row
    row.appendChild(newTd);
  });

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
          try {
            response = JSON.parse(response);
          } catch (error) {
            console.log("Error turning JSON to object ", error.message);
          }
          console.log(response);
          dashboardDiv.style.display = "none";
          filterDiv.style.display = "none";
          title.innerHTML = "Contact Details";
          loadContact(response, params);
        }
      };
      xhr.send(params);
    });
  }

  select.addEventListener("change", function (e) {
    const params = `selected=${e.target.value}`;
    console.log(params);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "filter.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        response = xhr.responseText;
        console.log(response);
        dashboardDiv.innerHTML = response;
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
            xhr.setRequestHeader(
              "Content-Type",
              "application/x-www-form-urlencoded"
            );

            xhr.onreadystatechange = function () {
              if (
                xhr.readyState === XMLHttpRequest.DONE &&
                xhr.status === 200
              ) {
                response = xhr.responseText;
                try {
                  response = JSON.parse(response);
                } catch (error) {
                  console.log("Error turning JSON to object ", error.message);
                }
                console.log(response);
                dashboardDiv.style.display = "none";
                filterDiv.style.display = "none";
                title.innerHTML = "Contact Details";
                loadContact(response, params);
              }
            };
            xhr.send(params);
          });
        }
      }
    };
    xhr.send(params);
  });
}

function loadContact(response, params) {
  let contactDiv = document.getElementById("view-contact-div");

  const detailsHtml = `
      <p><span>Name:</span> ${response["Name"]}</p>
      <p><span>Assigned to:</span> ${response["Assigned to"]}</p>
      <p><span>Company Name:</span> ${response["Company Name"]}</p>
      <p><span>Type:</span> ${response["Type"]}</p>
      <p><span>E-mail:</span> <a href="mailto:${response["E-mail"]}" class="highlight">${response["E-mail"]}</a></p>
      <p><span>Telephone:</span> <a href="tel:${response["Telephone"]}" class="highlight">${response["Telephone"]}</a></p>
      <p><span>Created by:</span> ${response["Created by"]}</p>
      <p><span>Created on:</span> ${response["Created on"]}</p>
      <p><span>Updated on:</span> ${response["Updated on"]}</p>
    `;
  contactDiv.innerHTML = detailsHtml;
}
