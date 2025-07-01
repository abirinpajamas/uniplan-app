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
// $section_ids (an array of section IDs in the order they were selected)


if($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input")); 

  $section_ids = $data->sectionIds;


$stmt = $conn->prepare("INSERT INTO Routines (user_id) VALUES (?)");
$stmt->bind_param("i", $userId);
$stmt->execute();
$routine_id = $conn->insert_id; 
$stmt->close();

// 2. Insert into RoutineSections table
$stmt = $conn->prepare("INSERT INTO RoutineSections (routine_id, section_id) VALUES (?, ?)");

foreach ($section_ids as $section_id) {
    $stmt->bind_param("ii", $routine_id, $section_id);
    if(!$stmt->execute()){
         echo json_encode(["success"=>false,"message"=> "Failed to Save"]);
    }
}

$stmt->close();

echo json_encode(["success" => true, "message" => "Routine saved successfully"]);
}
$conn->close();

?>