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
    $title = trim($_POST['title']);
    $firstName = trim($_POST['fname']);
    $lastName = trim($_POST['lname']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['tel']);
    $company = trim($_POST['comp']);
    $type = trim($_POST['type']);
    $assign = trim($_POST['assign']);

    $parts = explode(' ', $assign);
    $fname = $parts[0];
    $lname = $parts[1];


    $stmt = $pdo->prepare("SELECT id FROM users WHERE firstname = :firstname AND lastname = :lastname");
    $stmt->bindParam(':firstname', $fname, PDO::PARAM_STR);
    $stmt->bindParam(':lastname', $lname, PDO::PARAM_STR);
    $stmt->execute();
    $assignid = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $assignid = (int) $assignid[0]['id'];



    try {
        // Prepare an SQL statement to prevent SQL injection
        $stmt = $pdo->prepare("INSERT INTO contacts (title, firstname, lastname, email, telephone, company, type, assigned_to, created_by) 
                               VALUES (:title, :firstname, :lastname, :email, :telephone, :company, :type, :assigned_to, :created_by)");
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':firstname', $firstName);
        $stmt->bindParam(':lastname', $lastName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':telephone', $phone);
        $stmt->bindParam(':company', $company);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':assigned_to', $assignid);
        $stmt->bindParam(':created_by', $_SESSION["user_id"]);
        //$stmt->bindParam(':created_by', $r);

        // Execute the prepared statement
        $stmt->execute();

        echo "Success adding contact.";
    } catch (PDOException $e) {
        echo "Error adding new contact: " . $e->getMessage();
    }
}
