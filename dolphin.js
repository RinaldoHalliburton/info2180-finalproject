window.onload = init;

function init() {
  setupLoginListeners();
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
    if (
      responseText === "Incorrect password." ||
      responseText === "Email not found." ||
      responseText === "Invalid request method."
    ) {
      showError(errorDiv, responseText);
    } else {
      // Successful login
      hideElement("login-div");
      hideElement("error-div");
      emailInput.value = "";
      passwordInput.value = "";
      loadDashboard(responseText);
    }
  } catch (error) {
    console.error("Login error:", error);
    showError(errorDiv, "An unexpected error occurred during login.");
  }
}

// ------------------ Dashboard ------------------
function loadDashboard(responseHTML) {
  const dashboardDiv = document.getElementById("dashboard-div");
  const filterDiv = document.getElementById("filter-div");
  const title = document.getElementById("title");

  title.innerHTML = "Dashboard";
  showElement(title);
  showElement(dashboardDiv);

  createNavigationMenu();

  // Insert dashboard HTML content
  dashboardDiv.innerHTML = responseHTML;

  setupDashboardUI(filterDiv);

  // Attach view button handlers
  attachViewButtonHandlers(dashboardDiv);

  // When filter changes, load filtered results
  const filterSelect = document.getElementById("filter");
  filterSelect.addEventListener("change", handleFilterChange);
}

function setupDashboardUI(filterDiv) {
  filterDiv.innerHTML = ""; // Clear previous elements if any
  showElement(filterDiv);

  const label = document.createElement("label");
  label.setAttribute("for", "filter");
  label.textContent = "Filter by:";

  const select = createFilterSelect();
  select.id = "filter";

  const addContact = document.createElement("button");
  addContact.textContent = "+ Add Contact";
  addContact.style.marginLeft = "10px";
  addContact.addEventListener("click", handleAddContact);

  filterDiv.appendChild(label);
  filterDiv.appendChild(select);
  filterDiv.appendChild(addContact);
}

function createFilterSelect() {
  const select = document.createElement("select");
  const options = ["All", "Sales Lead", "Support", "Assigned to me"];
  options.forEach((optText) => {
    const opt = document.createElement("option");
    opt.textContent = optText;
    select.appendChild(opt);
  });
  return select;
}

async function handleFilterChange(e) {
  const selected = e.target.value;
  const params = { selected };
  const dashboardDiv = document.getElementById("dashboard-div");
  const filterDiv = document.getElementById("filter-div");

  try {
    const responseText = await postData("filter.php", params);
    dashboardDiv.innerHTML = responseText;
    attachViewButtonHandlers(dashboardDiv);
  } catch (error) {
    console.error("Filter error:", error);
  }
}

// ------------------ View Buttons ------------------
function attachViewButtonHandlers(container) {
  // Find all "view" buttons and attach event listener
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

  // Assuming the ID is in the first cell
  const id = row.cells[0].textContent.trim();
  try {
    const responseText = await postData("viewcontact.php", { id });
    let response;
    try {
      response = JSON.parse(responseText);
    } catch (error) {
      console.log("Error parsing JSON:", error.message);
      return;
    }
    showContactDetails(response, `id=${encodeURIComponent(id)}`);
  } catch (error) {
    console.error("View Contact error:", error);
  }
}

// ------------------ Contact Details ------------------
function showContactDetails(response, params) {
  const dashboardDiv = document.getElementById("dashboard-div");
  const filterDiv = document.getElementById("filter-div");
  const title = document.getElementById("title");

  hideElement(dashboardDiv);
  hideElement(filterDiv);

  title.innerHTML = "Contact Details";

  loadContact(response, params);
}

function loadContact(response, params) {
  const contactDiv = document.getElementById("view-contact-div");
  showElement(contactDiv);
  console.log(response);

  // 1. Populate contact details first
  contactDiv.innerHTML = createContactDetailsHTML(response);

  // 2. Create the buttonDiv
  const buttonDiv = document.createElement("div");
  buttonDiv.style.marginBottom = "10px"; // Optional: Add some spacing

  // 3. Create the "Assign to me" button and "Swap button"
  const assignToMe = document.createElement("button");
  assignToMe.textContent = "Assign to me";
  assignToMe.style.marginRight = "10px"; // Optional: Spacing between buttons
  assignToMe.addEventListener("click", () => assigntome(params));
  buttonDiv.appendChild(assignToMe);

  const swap = document.createElement("button");
  swap.textContent = "Swap Type";
  swap.style.marginRight = "10px"; // Optional: Spacing between buttons
  swap.addEventListener("click", () => swapType(response, params));
  buttonDiv.appendChild(swap);

  // 5. Prepend buttonDiv to contactDiv to ensure it's at the top
  contactDiv.prepend(buttonDiv);

  // 6. Create the textarea for new notes
  const inputField = document.createElement("textarea");
  inputField.name = "newNote";
  inputField.placeholder = "Enter new Note";
  inputField.style.width = "300px";
  inputField.style.height = "80px";
  inputField.style.display = "block"; // Ensures it starts on a new line
  inputField.style.marginTop = "10px"; // Optional: Add some spacing

  // 7. Create the "Add note" button
  const addNoteButton = document.createElement("button");
  addNoteButton.textContent = "Add note";
  addNoteButton.style.marginTop = "5px"; // Optional: Spacing above the button
  addNoteButton.addEventListener("click", () =>
    addNoteToContact(params, inputField)
  );

  // 8. Append the textarea and "Add note" button to contactDiv
  contactDiv.appendChild(inputField);
  contactDiv.appendChild(addNoteButton);
}

function createContactDetailsHTML(response) {
  const createdOn = new Date(response["Created on"]);
  const updatedOn = new Date(response["Updated on"]);
  let detailsHtml = `
    <p><span>Name:</span> ${response["Name"]}</p>
    <p><span>Assigned to:</span> ${response["Assigned to"]}</p>
    <p><span>Company Name:</span> ${response["Company Name"]}</p>
    <p><span>Type:</span> ${response["Type"]}</p>
    <p><span>E-mail:</span> <a href="mailto:${
      response["E-mail"]
    }" class="highlight">${response["E-mail"]}</a></p>
    <p><span>Telephone:</span> <a href="tel:${
      response["Telephone"]
    }" class="highlight">${response["Telephone"]}</a></p>
    <p><span>Created by:</span> ${response["Created by"]}</p>
    <p><span>Created on:</span> ${createdOn.toLocaleString()}</p>
  <p><span>Updated on:</span> ${updatedOn.toLocaleString()}</p>
  `;

  response["Notes"].forEach((note) => {
    const createdAtDate = new Date(note["created_at"]);

    detailsHtml += `<p><span>Note:</span> ${note["comment"]} 
      <span>Note made on:</span> ${createdAtDate.toLocaleString()} </p>`;
  });

  return detailsHtml;
}

async function addNoteToContact(params, inputField) {
  const noteText = inputField.value.trim();
  if (!noteText) return;

  // Extract the contact ID from the params string
  const id = new URLSearchParams(params).get("id");
  if (!id) {
    console.error("No ID found in params.");
    return;
  }

  try {
    // Send the new note to the server
    const addNoteResponse = await postData("addnotes.php", {
      id,
      note: noteText,
    });
    console.log("Note added successfully:", addNoteResponse);

    // Clear the input field after success
    inputField.value = "";

    // Update the DOM with the new note
    const contactDiv = document.getElementById("view-contact-div");

    const currentDate = new Date().toLocaleString();

    // Create a new paragraph element for the note
    const newNoteParagraph = document.createElement("p");
    newNoteParagraph.innerHTML = `<span>Note:</span> ${noteText} <span>Note made on:</span> ${currentDate}`;

    // Append the new note to the contact details
    contactDiv.appendChild(newNoteParagraph);
  } catch (error) {
    console.error("Error adding note:", error);
  }
}

// ------------------ Assign to Me and Swap ------------------
async function assigntome(params) {
  // Extract the contact ID from the params string
  const urlParams = new URLSearchParams(params);
  const id = urlParams.get("id");
  let time = new Date();

  if (!id) {
    console.error("No ID found in params.");
    return;
  }

  try {
    // Send the POST request to switchAdmin.php with the contact ID
    const responseText = await postData("switchAdmin.php", { id });

    if (responseText === "Assignment successful.") {
      console.log(`Contact ID ${id} has been assigned to you.`);

      // Update the "Assigned to" field in the UI
      const contactDiv = document.getElementById("view-contact-div");
      const assignedToElement = contactDiv.querySelector("p:nth-child(3)");
      const updatedonElement = contactDiv.querySelector("p:nth-child(10)");

      if (assignedToElement) {
        assignedToElement.innerHTML = `<span>Assigned to:</span> You`;
        updatedonElement.innerHTML = `<span>Updated on:</span> ${time.toLocaleString()}`;
      }

      alert("You have successfully been assigned to this contact.");
    } else {
      // Handle unexpected responses
      console.error("Unexpected response from switchAdmin.php:", responseText);
      alert("Failed to assign contact to you. Please try again.");
    }
  } catch (error) {
    console.error("Error assigning contact to you:", error);
    alert("An error occurred while assigning the contact. Please try again.");
  }
}

async function swapType(response, params) {
  // Extract the contact ID from the params string
  const urlParams = new URLSearchParams(params);
  const id = urlParams.get("id");
  const targetParagraph = document.querySelector("p:nth-child(5)");
  const type = targetParagraph.textContent;
  let time = new Date();
  let newType;
  if (type === "Type: Sales Lead") {
    newType = "Support";
  } else if (type === "Type: Support") {
    newType = "Sales Lead";
  }
  console.log(newType);

  if (!id) {
    console.error("No ID found in params.");
    return;
  }

  try {
    // Send the POST request to switchAdmin.php with the contact ID
    const responseText = await postData("swaptype.php", { id, newType });
    console.log(responseText);

    if (responseText === "Type change successful.") {
      console.log(`Contact ID ${id} has been swapped to ${newType}.`);

      // Update the "Assigned to" field in the UI
      const contactDiv = document.getElementById("view-contact-div");
      const assignedToElement = contactDiv.querySelector("p:nth-child(5)");
      const updatedonElement = contactDiv.querySelector("p:nth-child(10)");

      if (assignedToElement) {
        assignedToElement.innerHTML = `<span>Type:</span> ${newType}`;
        updatedonElement.innerHTML = `<span>Updated on:</span> ${time.toLocaleString()}`;
      }

      alert("You have successfully changed type for this contact.");
    } else {
      // Handle unexpected responses
      console.error("Unexpected response from swaptype.php:", responseText);
      alert("Failed to change type. Please try again.");
    }
  } catch (error) {
    console.error("Error changing type:", error);
    alert("An error changing type. Please try again.");
  }
}

//-------------------Add Contacts---------------

async function handleAddContact() {
  let response = await postData("getusers.php", "");
  let title;
  let fname;
  let lname;
  let email;
  let tel;
  let comp;
  let type;
  let assign;
  response = JSON.parse(response);
  console.log(response);
  let users = [];
  for (i = 0; i < response.length; i++) {
    users.push(response[i]["firstname"] + " " + response[i]["lastname"]);
  }
  addContactDiv = document.getElementById("add-contact-div");
  dashboard = document.getElementById("dashboard-div");
  filterDiv = document.getElementById("filter-div");
  titleDiv = document.getElementById("title");
  titleDiv.innerHTML = "Add Contact";
  hideElement(dashboard);
  hideElement(filterDiv);
  showElement(addContactDiv);

  // Clear the addContactDiv before appending new elements
  addContactDiv.innerHTML = "";
  //create a add button
  let button = document.createElement("button");
  button.textContent = "Add";
  button.addEventListener(
    "click",
    postData("addcontact.php", {
      title,
      fname,
      lname,
      email,
      tel,
      comp,
      type,
      assign,
    })
  );

  // Create a label and dropdown for Title
  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title: ";
  titleLabel.setAttribute("for", "title-select");
  titleLabel.classList.add("form-label");

  const titleSelect = document.createElement("select");
  titleSelect.id = "title-select";
  titleSelect.classList.add("form-input");
  const titleOptions = ["Mr.", "Ms.", "Mrs.", "Dr.", "Sir"];
  titleOptions.forEach((optText) => {
    const opt = document.createElement("option");
    opt.textContent = optText;
    titleSelect.appendChild(opt);
  });

  // Create a label and dropdown for type
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Type: ";
  typeLabel.setAttribute("for", "type-select");
  typeLabel.classList.add("form-label");

  const typeSelect = document.createElement("select");
  typeSelect.id = "title-select";
  typeSelect.classList.add("form-input");
  const typeOptions = ["Sales Lead", "Support"];
  typeOptions.forEach((optText) => {
    const opt = document.createElement("option");
    opt.textContent = optText;
    typeSelect.appendChild(opt);
  });

  // Create a label and dropdown for assign to
  const assignLabel = document.createElement("label");
  assignLabel.textContent = "Assign to: ";
  assignLabel.setAttribute("for", "assign-select");
  assignLabel.classList.add("form-label");

  const assignSelect = document.createElement("select");
  assignSelect.id = "assign-select";
  assignSelect.classList.add("form-input");
  users.forEach((optText) => {
    const opt = document.createElement("option");
    opt.textContent = optText;
    assignSelect.appendChild(opt);
  });

  // Create a container for First Name and Last Name
  const nameContainer = document.createElement("div");
  nameContainer.classList.add("name-container");

  // Create a label and input for First Name
  const firstNameLabel = document.createElement("label");
  firstNameLabel.textContent = "First Name: ";
  firstNameLabel.setAttribute("for", "first-name-input");
  firstNameLabel.classList.add("form-label");

  const firstNameInput = document.createElement("input");
  firstNameInput.type = "text";
  firstNameInput.id = "first-name-input";
  firstNameInput.placeholder = "Enter First Name";
  firstNameInput.classList.add("form-input-inline");

  // Create a label and input for Last Name
  const lastNameLabel = document.createElement("label");
  lastNameLabel.textContent = "Last Name: ";
  lastNameLabel.setAttribute("for", "last-name-input");
  lastNameLabel.classList.add("form-label");

  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.id = "last-name-input";
  lastNameInput.placeholder = "Enter Last Name";
  lastNameInput.classList.add("form-input-inline");

  // Create a label and input for email
  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email: ";
  emailLabel.setAttribute("for", "email-input");
  emailLabel.classList.add("form-label");

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email-input";
  emailInput.placeholder = "Enter Email";
  emailInput.classList.add("form-input");

  // Create a label and input for phone
  const phoneLabel = document.createElement("label");
  phoneLabel.textContent = "Telephone: ";
  phoneLabel.setAttribute("for", "phone-input");
  phoneLabel.classList.add("form-label");

  const phoneInput = document.createElement("input");
  phoneInput.type = "tel";
  phoneInput.id = "phone-input";
  phoneInput.placeholder = "Enter Telephone";
  phoneInput.classList.add("form-input");

  // Create a label and input for company
  const companyLabel = document.createElement("label");
  companyLabel.textContent = "Company: ";
  companyLabel.setAttribute("for", "company-input");
  companyLabel.classList.add("form-label");

  const companyInput = document.createElement("input");
  companyInput.type = "text";
  companyInput.id = "company-input";
  companyInput.placeholder = "Enter company name";
  companyInput.classList.add("form-input");

  // Append First Name and Last Name elements to the nameContainer
  nameContainer.appendChild(firstNameLabel);
  nameContainer.appendChild(firstNameInput);
  nameContainer.appendChild(lastNameLabel);
  nameContainer.appendChild(lastNameInput);
  nameContainer.appendChild(emailLabel);

  // Add styling class to addContactDiv
  addContactDiv.classList.add("form");

  // Append elements to the addContactDiv
  addContactDiv.appendChild(titleLabel);
  addContactDiv.appendChild(titleSelect);
  addContactDiv.appendChild(nameContainer);
  addContactDiv.appendChild(emailLabel);
  addContactDiv.appendChild(emailInput);
  addContactDiv.appendChild(phoneLabel);
  addContactDiv.appendChild(phoneInput);
  addContactDiv.appendChild(companyLabel);
  addContactDiv.appendChild(companyInput);
  addContactDiv.appendChild(typeLabel);
  addContactDiv.appendChild(typeSelect);
  addContactDiv.appendChild(assignLabel);
  addContactDiv.appendChild(assignSelect);
  addContactDiv.appendChild(button);
}

// ------------------ Utilities ------------------
function showElement(elementOrId) {
  const el =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;
  if (el) el.style.display = "block";
}

function hideElement(elementOrId) {
  const el =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;
  if (el) el.style.display = "none";
}

function showError(errorDiv, message) {
  errorDiv.innerHTML = message;
  errorDiv.style.display = "block";
}

async function postData(url, data) {
  const formBody = Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody,
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.status}`);
  }

  return response.text();
}

function createNavigationMenu() {
  // Check if nav already exists to avoid duplication
  if (document.getElementById("nav-menu")) {
    return;
  }

  // Get the header element and its computed styles
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;

  // Create nav element
  const nav = document.createElement("nav");
  nav.id = "nav-menu";
  nav.style.position = "fixed";
  nav.style.left = "0"; // Align to the left edge
  nav.style.top = `${headerHeight}px`; // Position directly below the header
  nav.style.height = `calc(100% - ${headerHeight}px)`; // Fill the remaining viewport height
  nav.style.width = "200px";
  nav.style.backgroundColor = "#1c2431"; // Match the header's background color for consistency
  nav.style.color = "#fff";
  nav.style.borderRight = "1px solid #333"; // Subtle border for separation
  nav.style.padding = "1rem";
  nav.style.boxSizing = "border-box";

  // Menu items with handlers and links
  const menuItems = [
    { text: "Home", handler: () => home() },
    { text: "Users", handler: () => alert("Navigating to Users!") },
    { text: "Logout", link: "index.html" }, // Logout remains a link
  ];

  menuItems.forEach((item) => {
    if (item.handler) {
      // Create a button for items with handlers
      const menuItem = document.createElement("button");
      menuItem.innerText = item.text;
      menuItem.style.display = "block";
      menuItem.style.marginBottom = "1rem";
      menuItem.style.color = "#fff";
      menuItem.style.background = "none";
      menuItem.style.border = "none";
      menuItem.style.textAlign = "left";
      menuItem.style.fontSize = "1rem";
      menuItem.style.cursor = "pointer";
      menuItem.style.padding = "0";
      menuItem.style.textDecoration = "underline";

      // Add hover effect
      menuItem.addEventListener("mouseover", () => {
        menuItem.style.color = "#007BFF";
      });
      menuItem.addEventListener("mouseout", () => {
        menuItem.style.color = "#fff";
      });

      // Attach the function handler
      menuItem.addEventListener("click", item.handler);

      nav.appendChild(menuItem);
    } else if (item.link) {
      // Create an anchor for items with links
      const menuItem = document.createElement("a");
      menuItem.href = item.link;
      menuItem.innerText = item.text;
      menuItem.style.display = "block";
      menuItem.style.marginBottom = "1rem";
      menuItem.style.color = "#fff";
      menuItem.style.textDecoration = "none";
      menuItem.style.fontSize = "1rem";
      menuItem.style.textDecoration = "underline";

      // Add hover effect
      menuItem.addEventListener("mouseover", () => {
        menuItem.style.color = "#007BFF";
      });
      menuItem.addEventListener("mouseout", () => {
        menuItem.style.color = "#fff";
      });

      nav.appendChild(menuItem);
    }
  });

  // Append nav to the body
  document.body.appendChild(nav);

  // Add padding to dashboard to avoid overlap
  const dashboardDiv = document.getElementById("dashboard-div");
  dashboardDiv.style.marginLeft = "200px";
}

async function home() {
  dashboardDiv = document.getElementById("dashboard-div");
  viewcon = document.getElementById("view-contact-div");
  addcon = document.getElementById("add-contact-div");
  hideElement(viewcon);
  hideElement(addcon);
  response = await postData("home.php", "");
  loadDashboard(response);
}
