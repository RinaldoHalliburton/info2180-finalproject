<?php
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
    
    if ($id)
    {
        $stmt = $pdo->prepare('UPDATE contacts SET assigned_to = :assigned_to WHERE id = :id');
        $stmt->bindParam(':assigned_to', $_SESSION['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $stmt = $pdo->prepare("SELECT * FROM contacts WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $contact = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($id != $_SESSION['user_id'])
        {
        date_default_timezone_set('America/Jamaica');
        $currentTime = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare('UPDATE contacts SET updated_at = :update_at WHERE id = :id');
        $stmt->bindParam(':update_at',$currentTime);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        }
        
        //echo "Successfully changed";
       /* $contact_info = [
            'Name' => $contact['title'] . ' ' . $contact['firstname'] . ' ' . $contact['lastname'],
            'E-mail' => $contact['email'],
            'Company Name' => $contact['company'],
            'Telephone' => $contact['telephone'],
            'Type' => $contact['type'],
            'Created on' => $contact['created_at'],
            'Updated on' => $contact['updated_at']
        ];
        
        // Prepare the query with a placeholder for the ID
        $stmt = $pdo->prepare("SELECT CONCAT(firstname, ' ', lastname) AS fullname FROM Users WHERE id = :id");
        // Bind the dynamic ID parameter
        $stmt->bindParam(':id', $contact['assigned_to'], PDO::PARAM_INT);
        // Execute the query
        $stmt->execute();
        // Fetch the result
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        //array_push($contact_info, $user['fullname']);
        $contact_info['Assigned to'] = $user['fullname'];


        $stmt = $pdo->prepare("SELECT CONCAT(firstname, ' ', lastname) AS fullname FROM Users WHERE id = :id");
        $stmt->bindParam(':id', $contact['created_by'], PDO::PARAM_INT);
        $stmt->execute();
        $contact_info['Created by'] = $user['fullname'];
        
        
        $json_output = json_encode($contact_info);
        echo $json_output;*/
        $json_output = json_encode($contact);
        echo $json_output;
        return;
        //echo "success";

    }else 
    {
        echo "Not successfully changed";
    }
} else 
{
    echo "POST invalid";
}

?>