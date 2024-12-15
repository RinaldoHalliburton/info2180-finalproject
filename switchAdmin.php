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
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
    exit();
}


// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize input
    $id = filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT);


    // Query the database for update

    if ($id) {
        $stmt = $pdo->prepare('UPDATE contacts SET assigned_to = :assigned_to WHERE id = :id');
        $stmt->bindParam(':assigned_to', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        /*$stmt = $pdo->prepare("SELECT * FROM contacts WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $contact = $stmt->fetchAll(PDO::FETCH_ASSOC);*/

        if ($id != $_SESSION['user_id']) {
            date_default_timezone_set('America/Jamaica');
            $currentTime = date('Y-m-d H:i:s');
            $stmt = $pdo->prepare('UPDATE contacts SET updated_at = :update_at WHERE id = :id');
            $stmt->bindParam(':update_at', $currentTime);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        }

        echo "Assignment successful.";
        return;
    } else {
        echo "Not successfully changed";
    }
} else {
    echo "POST invalid";
}
