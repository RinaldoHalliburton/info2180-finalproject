<?php

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
    // Sanitize input
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
   foreach($contacts as $contact)
    {
        if($contact['email'] === $email)
        {
            $contact_info = [
                'Name' => $contact['title'] . ' ' . $contact['firstname'] . ' ' . $contact['lastname'],
                'E-mail' => $contact['email'],
                'Company Name' => $contact['company'],
                'Telephone' => $contact['telephone'],
                'Created on' => $contact['created_at'],
                'Updated on' => $contact['updated_at']
            ];
            
            // Prepare the query with a placeholder for the ID
            $stmt = $pdo->prepare("SELECT CONCAT(firstname, ' ', lastname) AS fullname FROM Users WHERE id = :id");
            // Bind the dynamic ID parameter
            $stmt->bindParam(':id', $contact['assigned_to'], PDO::PARAM_INT);
            // Execute the query
            $stmt->execute();
            // Fetch the result
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            //array_push($contact_info, $user['fullname']);
            $contact_info['Assigned to admin'] = $user['fullname'];
            
            
            $json_output = json_encode($contact_info);
            echo $json_output;
            return;
        }
    }
}

?>