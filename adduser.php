<?php

session_start();

// Database credentials
$host = 'localhost';
$db = 'dolphin_crm';
$username = 'root';
$password = '';

try {
    // Create a PDO instance for database connection
    $pdo = new PDO("mysql:host=$host;dbname=$db", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
    exit();
}

// Validate input fields
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = trim($_POST['fname']);
    $lastName = trim($_POST['lname']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $role = trim($_POST['role']);



    // Hash the password using PHP's password_hash() function
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Prepare an SQL statement to prevent SQL injection
        $stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, email, password, role) 
                               VALUES (:first_name, :last_name, :email, :password, :role)");
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role', $role);

        // Execute the prepared statement
        $stmt->execute();

        echo "success";
    } catch (PDOException $e) {
        echo "Error creating new user: " . $e->getMessage();
    }
}
