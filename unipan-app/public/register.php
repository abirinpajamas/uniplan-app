<?php


include("database.php");
header('Content-Type: application/json');

if ($conn) {

    
    $data = json_decode(file_get_contents('php://input'), true);

    $fname = $data['fname'];
    $lname = $data['lname'];
    $email = $data['email'];
    $username = $data['username'];
    $pass = $data['pass'];



    $sql = "insert into users (user_name,Pass,user_email,fname,lname,user_type) 
       values (?,?,?,?,?,'student')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $username, $pass, $email, $fname, $lname);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['error' => 'Error: ' . $sql . '<br>' . $conn->error]);
    }

    $conn->close();
} else {
    echo json_encode(['error' => 'No data received']);
}

?>