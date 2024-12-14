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
    echo "Database connection failed: " . $e->getMessage();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming note_id and comment are sent via POST
    // and that the user’s ID is stored in the session (for created_by field)
    $contact_id = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $comment = isset($_POST['note']) ? trim($_POST['note']) : '';
    $createdBy = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

    if ($contact_id && $comment && $createdBy) {
        $stmt = $pdo->prepare("INSERT INTO notes (contact_id, comment, created_by) VALUES (:id, :comment, :created_by)");
        $stmt->bindParam(':comment', $comment, PDO::PARAM_STR);
        $stmt->bindParam(':created_by', $createdBy, PDO::PARAM_INT);
        $stmt->bindParam(':id', $contact_id, PDO::PARAM_INT);

        try {
            $stmt->execute();
            echo "Note updated successfully.";
        } catch (PDOException $e) {
            echo "Error updating note: " . $e->getMessage();
        }
    } else {
        echo "Invalid input. Please provide a valid note_id, comment, and ensure you are logged in.";
    }
}
