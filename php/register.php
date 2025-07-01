<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
	  // Allow POST and OPTIONS methods
	 
	  // Allow headers that you expect to receive (e.g., Content-Type)
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
	

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}
   
  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $fname = $data->fname;
    $lname = $data->lname;
    $email = $data->email;
    $username = $data->username;
    $pass = $data->pass;



    $sql = "insert into users (user_name,Pass,user_email,fname,lname,user_type) 
       values (?,?,?,?,?,'student')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $username, $pass, $email, $fname, $lname);

    if ($stmt->execute()) {
        $response=["success" => true, "message" => "Registration successful"];
        echo json_encode($response);
    }
    else {

        $error=$stmt->error;
        if (strpos($error, "user_name") !== false){
            $response=["success" => false, "message" => "Username already taken." ];
            echo json_encode($response);
        }
        else if (strpos($error, "user_email") !== false){
            $response=["success" => false, "message" => "Email already exists." ];
            echo json_encode($response);
        }
        else {
        $response=["success" => false, "message" => "Error try again." ];
        echo json_encode($response);
        }
    }
    $stmt->close();
    }
    
    $conn->close();

?>