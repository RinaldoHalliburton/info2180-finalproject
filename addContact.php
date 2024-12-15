<?php
include 'config.php'; // Include the database connection

header('Content-Type: application/json');

// Collecting and sanitizing input data
$title = $_POST['title'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$email = $_POST['email'] ?? '';
$telephone = $_POST['telephone'] ?? '';
$company = $_POST['company'] ?? '';
$type = $_POST['type'] ?? '';
$assignedTo = $_POST['assignedTo'] ?? '';

try {
    $stmt = $pdo->prepare("INSERT INTO Contacts (title, firstname, lastname, email, telephone, company, type, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $firstName, $lastName, $email, $telephone, $company, $type, $assignedTo]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
