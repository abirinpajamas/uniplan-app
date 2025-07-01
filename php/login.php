<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
	  // Allow POST and OPTIONS methods
	 
	  // Allow headers that you expect to receive (e.g., Content-Type)
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../vendor/autoload.php';
use Firebase\JWT\JWT;

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}
	

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}
   
$secretkey= "abir5046";
$issued= new DateTimeImmutable();
$expire=$issued ->modify("+84 hour")->getTimestamp(); 
$servername= "localhost";

  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $loginid = $data->loginid;
    $pass = $data->pass;



    $sql = "SELECT user_id, Pass, fname as name, user_type FROM users WHERE user_name = ? UNION SELECT user_id, Pass,concat(fname,' ',lname) as name, user_type FROM users WHERE user_email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $loginid, $loginid);
    $stmt->execute();
    $stmt->store_result();
    
    if($stmt->num_rows === 1){
      $stmt->bind_result($user_id,$password,$name,$usertype);
      $stmt->fetch();
         if($password==$pass){

           $userdata=['user'=> $user_id,'name'=>$name, 'usertype'=> $usertype ];
 
            
           $payload = [
            'iss'  => $servername,       // Issuer
            'aud'  => $servername,       // Audience
            'iat'  => $issued->getTimestamp(), // Issued at
            'nbf'  => $issued->getTimestamp(), // Not before
            'exp'  => $expire,           // Expire
            'data' => $userdata          // User data
        ];
         
        $jwt = JWT::encode($payload, $secretkey, 'HS256');

        $response = ['success'=> true,'message'=> 'Login successful.','name'=>$userdata['name'],'token' => $jwt];
        echo json_encode($response);
         }
        else{
           echo json_encode(["success"=> false,"message"=> "Incorrect Password."] );
         }
    }
    else{ echo json_encode(["success"=> false,"message"=> "Username or email doesnt exist."] );

    }
    $stmt->close();
    }
    
    $conn->close();

?>