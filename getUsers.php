<?php
include 'config.php';

session_start();
include 'config.php'; // Contains your DB connection logic

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $dbpass);
    $stmt = $pdo->query("SELECT id, CONCAT(firstname, ' ', lastname) AS name FROM Users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
