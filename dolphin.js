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

    // If the server returns the exact date or timestamp for the note, use that.
    // Otherwise, we can use a client-side timestamp as a placeholder.
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

// ------------------ Assign to Me ------------------
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

    // Assuming the server returns a success message or the updated assigned user
    // You may need to adjust this based on your server's response
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

      // Optionally, display a success message to the user
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

    // Assuming the server returns a success message or the updated assigned user
    // You may need to adjust this based on your server's response
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

      // Optionally, display a success message to the user
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
