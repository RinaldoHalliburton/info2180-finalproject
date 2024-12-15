// Function to submit the add contact form via AJAX
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
            // Optionally clear the form or update UI
        } else {
            alert('Failed to add contact: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to populate 'Assigned To' dropdown
function loadUsers() {
    fetch('getUsers.php')
    .then(response => response.json())
    .then(users => {
        const select = document.getElementById('assignedTo');
        users.forEach(user => {
            const option = new Option(user.name, user.id);
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading users:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
});
