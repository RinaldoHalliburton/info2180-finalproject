<?php
include 'config.php'; // Ensure this includes your PDO connection setup
session_start();

if (isset($_SESSION['user_id'])) { // Check if the user is logged in
    try {
        $stmt = $pdo->query("SELECT * FROM contacts");
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($contacts); // Sending back a JSON response
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'User not authenticated']); // Handling cases where session is not set
}
