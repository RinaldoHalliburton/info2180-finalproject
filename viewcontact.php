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
    $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);
    $stmt = $pdo->prepare("SELECT comment,created_at FROM Notes WHERE contact_id = :contact_id AND created_by = :created_by");
    $stmt->bindParam(':contact_id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':created_by', $_SESSION["user_id"], PDO::PARAM_INT);
    $stmt->execute();
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($contacts as $contact) {
        if ($contact['id'] === $id) {
            $contact_info = [
                'Name' => $contact['title'] . ' ' . $contact['firstname'] . ' ' . $contact['lastname'],
                'E-mail' => $contact['email'],
                'Company Name' => $contact['company'],
                'Telephone' => $contact['telephone'],
                'Type' => $contact['type'],
                'Created on' => $contact['created_at'],
                'Updated on' => $contact['updated_at'],
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
            $contact_info['Assigned to'] = $user['fullname'];


            $stmt = $pdo->prepare("SELECT CONCAT(firstname, ' ', lastname) AS fullname FROM Users WHERE id = :id");
            $stmt->bindParam(':id', $contact['created_by'], PDO::PARAM_INT);
            $stmt->execute();
            $contact_info['Created by'] = $user['fullname'];

            $contact_info['Notes'] = $notes;



            $json_output = json_encode($contact_info);
            echo $json_output;
            return;
        }
    }
}
