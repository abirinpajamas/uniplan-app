<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


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

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$token = getBearerToken();	


if (!$token) {
   echo json_encode(["success" => false, "message" => "Authorization token not found"]);
   exit();
}

if (substr_count($token, '.') !== 2) {
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"Malformed token"]);
    exit();
}

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}
   
$decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

$userId = $decoded->data->user;

  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $faculty = $data->initial;
    $rating = $data->rating;
    $difficulty = $data->difficulty;
    $takeagain = $data->takeagain;
    
    

    $sql = "INSERT INTO facultyrating (faculty_idno, user_idno, rating, difficulty, takeagain)
            select ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
            SELECT 1
            FROM facultyrating
            WHERE faculty_idno = ?
            AND user_idno = ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sissssi",  $faculty,$userId,$rating,$difficulty,$takeagain,$faculty,$userId);

    if ($stmt->execute()) {
       
       
        if ($conn->affected_rows > 0) {
            $response=["success" => true, "message" => "Rating Posted"];
            echo json_encode($response);
        }
        else { // MySQL error code for duplicate entry
            $response = ["success" => false, "message" => "You have already rated this faculty."];
            echo json_encode($response);

    }
   
    }
    else {

    
     
        $response=["success" => false, "message" => "Error try again." ];
        echo json_encode($response);
        
    }
    $stmt->close();
    }
    
    $conn->close();

?>