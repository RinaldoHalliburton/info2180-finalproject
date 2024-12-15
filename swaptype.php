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
    $type = filter_input(INPUT_POST, 'newType', FILTER_SANITIZE_STRING);

    // Query the database for update
    if ($id) {
        $stmt = $pdo->prepare('UPDATE contacts SET type = :type WHERE id = :id');
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();


        if ($id != $_SESSION['user_id']) {
            date_default_timezone_set('America/Jamaica');
            $currentTime = date('Y-m-d H:i:s');
            $stmt = $pdo->prepare('UPDATE contacts SET updated_at = :update_at WHERE id = :id');
            $stmt->bindParam(':update_at', $currentTime);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        }

        echo "Type change successful.";
        return;
    } else {
        echo "Not successfully changed";
    }
} else {
    echo "POST invalid";
}
