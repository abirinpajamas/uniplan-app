<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Predis\Client; 

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

    $commentid = $data->comment;
    
    

    $sql = "IF NOT EXISTS (SELECT 1 FROM liker WHERE comment_no = ? AND liker_id = ?) THEN
             INSERT INTO liker (comment_no, liker_id) VALUES (?, ?);
             ELSE
             DELETE FROM liker WHERE comment_no = ? AND liker_id = ?;
             END IF";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiiiii",  $commentid,$userId,  $commentid,$userId,  $commentid,$userId);

    if ($stmt->execute()) {
       
       
        if ($conn->affected_rows > 0) {
            $response=["success" => true, "message" => "Liked"];
            echo json_encode($response);
        }
        else { // MySQL error code for duplicate entry
            $response = ["success" => false, "message" => "You have already Liked this comment."];
            echo json_encode($response);

    }
  $redisPublishCommand = sprintf(
            "php -r 'require \"../vendor/autoload.php\"; \$redis = new Predis\Client(\"tcp://127.0.0.1:6379\"); try { \$redis->publish(\"likes\", json_encode([\"type\" => \"new_like\", \"commentid\" => \"%s\", \"likerId\" => \"%s\"])); } catch (\Predis\Connection\ConnectionException \$e) { error_log(\"Redis publish error: \" . \$e->getMessage()); }'",
            escapeshellarg($commentid),
            escapeshellarg($userId)
        );
        shell_exec($redisPublishCommand . " > /dev/null 2>&1 &");
     // Send the HTTP response
    }
    else {
     
        $response=["success" => false, "message" => "Error try again." ];
        echo json_encode($response);
        
    }



    $stmt->close();
    }
    
    $conn->close();

?>