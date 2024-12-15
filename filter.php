<?php
include 'config.php';

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $selected = filter_input(INPUT_POST, 'selected', FILTER_SANITIZE_STRING);
    if ($selected == "All") {
        $stmt = $pdo->prepare('SELECT * FROM contacts');
        $stmt->execute();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        loadContacts($contacts);
    } else if ($selected == "Sales Lead") {
        $stmt = $pdo->prepare('SELECT * FROM contacts WHERE type = :type');
        $stmt->bindParam(':type', $selected);
        $stmt->execute();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        loadContacts($contacts);
    } else if ($selected == "Support") {
        $stmt = $pdo->prepare('SELECT * FROM contacts WHERE type = :type');
        $stmt->bindParam(':type', $selected);
        $stmt->execute();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        loadContacts($contacts);
    } else if ($selected == "Assigned to me") {
        $stmt = $pdo->prepare('SELECT * FROM contacts WHERE assigned_to = :id');
        $stmt->bindParam(':id', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->execute();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        loadContacts($contacts);
    }
}


function loadContacts($contacts)
{
    // Start the table and add the header row

    echo '<table border="1"> 
            <tr>
                <th>ID</td>  
                <th>Name</th>  
                <th>Email</th>  
                <th>Company</th>  
                <th>Type</th>
                <th> </th>  
            </tr>';

    // Iterate through contacts and add rows
    foreach ($contacts as $contact) {
        // Combine title, firstname, and lastname into one string
        $fullName = htmlspecialchars($contact['title']) . ' ' .
            htmlspecialchars($contact['firstname']) . ' ' .
            htmlspecialchars($contact['lastname']);

        echo "<tbody>
                <tr>  
                    <td>" . htmlspecialchars($contact['id']) . "</td>
                    <td>" . $fullName . "</td>   
                    <td>" . htmlspecialchars($contact['email']) . "</td>    
                    <td>" . htmlspecialchars($contact['company']) . "</td>    
                    <td>" . htmlspecialchars($contact['type']) . "</td>
                    <td><button>view</button></td>
                </tr>
            </tbody>";
    }

    // Close the table
    echo '</table>';
    // $json_output = json_encode($contacts);
    //echo $json_output;
    return;
}
