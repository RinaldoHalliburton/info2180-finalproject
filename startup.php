<?php
// Database connection
session_start();

$host = 'localhost';
$db = 'dolphin_crm';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch all entries from the 'contacts' table
    $stmt = $pdo->query("SELECT * FROM contacts");
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
    exit();
}

// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize input
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

    // Query the database for the user
    $stmt = $pdo->prepare('SELECT id, email, password FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Store user info in the session
            $_SESSION['user_id'] = $user['id'];
            //$_SESSION['firstname'] = $user['firstname'];
            //$_SESSION['lastname'] = $user['lastname'];
            //$_SESSION['role'] = $user['role'];
            $_SESSION['email'] = $user['email'];

            //echo table of users by calling a func to create table
            loadContacts($contacts);
        } else {
            echo "Incorrect password.";
        }
    } else {
        echo "Email not found.";
    }
} else {
    echo "Invalid request method.";
}


function loadContacts($contacts) {
    // Start the table and add the header row
    echo '<table border="1"> 
            <tr>  
                <th>Name</th>  
                <th>Email</th>  
                <th>Company</th>  
                <th>Type</th>  
            </tr>';

    // Iterate through contacts and add rows
    foreach ($contacts as $contact) {
        // Combine title, firstname, and lastname into one string
        $fullName = htmlspecialchars($contact['title']) . ' ' .
                    htmlspecialchars($contact['firstname']) . ' ' .
                    htmlspecialchars($contact['lastname']);

        echo "<tr>  
                <td>" . $fullName . "</td>   
                <td>" . htmlspecialchars($contact['email']) . "</td>    
                <td>" . htmlspecialchars($contact['company']) . "</td>    
                <td>" . htmlspecialchars($contact['type']) . "</td>  
    
              </tr>";
    }

    // Close the table
    echo '</table>';
}




?>