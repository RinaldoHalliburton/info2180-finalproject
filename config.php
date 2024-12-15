<?php
// Database configuration settings
$host = 'localhost';
$dbname = 'dolphin_crm';
$dbuser = 'root';
$dbpass = '';  // Adjust the password as necessary

// Create a PDO instance as a database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
