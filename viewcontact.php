<?php

session_start();

$host = 'localhost';
$db = 'dolphin_crm';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => "Database connection failed: " . $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize input
    $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);

    // Fetch all entries from the 'contacts' table
    $stmt = $pdo->prepare("SELECT * FROM contacts WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contact) {
        echo json_encode(['error' => 'No contact found for ID: ' . $id]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT comment, created_at FROM Notes WHERE contact_id = :contact_id AND created_by = :created_by");
    $stmt->bindParam(':contact_id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':created_by', $_SESSION["user_id"], PDO::PARAM_INT);
    $stmt->execute();
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $contact_info = [
        'Name' => $contact['title'] . ' ' . $contact['firstname'] . ' ' . $contact['lastname'],
        'E-mail' => $contact['email'],
        'Company Name' => $contact['company'],
        'Telephone' => $contact['telephone'],
        'Type' => $contact['type'],
        'Created on' => $contact['created_at'],
        'Updated on' => $contact['updated_at'],
        'Notes' => $notes
    ];

    // Additional queries to fetch names from user IDs can be included here

    header('Content-Type: application/json');
    echo json_encode($contact_info);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
