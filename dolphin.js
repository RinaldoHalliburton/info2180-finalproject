window.onload = init;

function init() {
  setupLoginListeners();
  loadUsers(); // Ensure to load users for any forms needing user data
}

// ------------------ Login ------------------
function setupLoginListeners() {
  const loginButton = document.getElementById("login-button");
  if (loginButton) {
    loginButton.addEventListener("click", handleLoginClick);
  }
}

async function handleLoginClick(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const errorDiv = document.getElementById("error-div");

  try {
    const responseText = await postData("startup.php", { email, password });
    if (responseText === "Incorrect password." ||
        responseText === "Email not found." ||
        responseText === "Invalid request method.") {
      showError(errorDiv, responseText);
    } else {
      window.location.href = 'dashboard.html'; // Redirects to the dashboard page after successful login
    }
  } catch (error) {
    console.error("Login error:", error);
    showError(errorDiv, "An unexpected error occurred during login.");
  }
}

// ------------------ Dashboard ------------------
function loadDashboard() {
  fetch('loadContacts.php')
    .then(response => response.json())
    .then(data => displayContacts(data))
    .catch(error => console.error('Error loading contacts:', error));
}

function displayContacts(contacts) {
  const dashboardDiv = document.getElementById("dashboard-div");
  dashboardDiv.innerHTML = ''; // Clear previous contents
  contacts.forEach(contact => {
    dashboardDiv.innerHTML += `<div>${contact.firstname} ${contact.lastname} - ${contact.email}</div>`;
  });
}

// ------------------ View Contact Details ------------------
function attachViewButtonHandlers(container) {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.textContent === "view") {
      button.addEventListener("click", handleViewButtonClick);
    }
  });
}

async function handleViewButtonClick(event) {
  const row = event.target.closest("tr");
  if (!row) return;

  const id = row.cells[0].textContent.trim();
  try {
    const responseText = await postData("viewcontact.php", { id });
    let response = JSON.parse(responseText);
    showContactDetails(response, `id=${encodeURIComponent(id)}`);
  } catch (error) {
    console.error("View Contact error:", error);
  }
}

function showContactDetails(response, params) {
  const contactDiv = document.getElementById("view-contact-div");
  contactDiv.innerHTML = createContactDetailsHTML(response);
}

function createContactDetailsHTML(response) {
  const createdOn = new Date(response["Created on"]);
  const updatedOn = new Date(response["Updated on"]);
  let detailsHtml = `
    <p><span>Name:</span> ${response["Name"]}</p>
    <p><span>Assigned to:</span> ${response["Assigned to"]}</p>
    <p><span>Company Name:</span> ${response["Company Name"]}</p>
    <p><span>Type:</span> ${response["Type"]}</p>
    <p><span>E-mail:</span> <a href="mailto:${response["E-mail"]}" class="highlight">${response["E-mail"]}</a></p>
    <p><span>Telephone:</span> <a href="tel:${response["Telephone"]}" class="highlight">${response["Telephone"]}</a></p>
    <p><span>Created by:</span> ${response["Created by"]}</p>
    <p><span>Created on:</span> ${createdOn.toLocaleString()}</p>
    <p><span>Updated on:</span> ${updatedOn.toLocaleString()}</p>
  `;
  return detailsHtml;
}

// ------------------ Utility Functions ------------------
function showError(errorDiv, message) {
  errorDiv.innerHTML = message;
  errorDiv.style.display = "block";
}

async function postData(url, data) {
  const formBody = Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

  const response = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: formBody
  });

  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.text();
}

// ------------------ Additional Functions for Loading Users and Submitting Forms ------------------
function loadUsers() {
  fetch('getUsers.php')
    .then(response => response.json())
    .then(users => {
      const select = document.getElementById('assignedTo');
      users.forEach(user => {
          const option = document.createElement('option');
          option.value = user.id;
          option.textContent = user.name;
          select.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading users:', error));
}

function submitContactForm() {
  const formData = {
    title: document.getElementById('title').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    telephone: document.getElementById('telephone').value,
    company: document.getElementById('company').value,
    type: document.getElementById('type').value,
    assignedTo: document.getElementById('assignedTo').value
  };

  fetch('addContact.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(formData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Contact added successfully!');
      } else {
          alert('Failed to add contact: ' + data.message);
      }
  })
  .catch(error => console.error('Error:', error));
}
