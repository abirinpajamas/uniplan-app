<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}	
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'abir5046';
function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}


if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}


$token=getBearerToken();
if (!$token) {
    echo json_encode(["success" => false, "message" => "Authorization token not found"]);
    exit();
 }
   


  $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

  $userId = $decoded->data->user;
  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $review = $data->commentText;
    $faculty = $data->initial;
    
    

    $sql = "insert into facultyreview (user_idno,faculty_idno, Review_Text)
            values (?,?,?);";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iss",  $userId,$faculty,$review);

    if ($stmt->execute()) {
        $response=["success" => true, "message" => "Review Posted"];
        echo json_encode($response);
    }
    else {

    
     
        $response=["success" => false, "message" => "Error try again." ];
        echo json_encode($response);
        
    }
    $stmt->close();
    }
    
    $conn->close();

?>