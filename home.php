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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
}
