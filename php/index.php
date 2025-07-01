<?php
	  // Allow any origin (for testing; restrict in production)
	  header("Access-Control-Allow-Origin: *");
	  // Allow POST and OPTIONS methods
	 
	  // Allow headers that you expect to receive (e.g., Content-Type)
	  header("Access-Control-Allow-Headers: Content-Type");
	
  
	  // Handle preflight OPTIONS request
	if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
		  http_response_code(200);
		  exit();
	  }
	if($_SERVER["REQUEST_METHOD"] === "POST") {
	    $data = json_decode(file_get_contents("php://input")); 
	    $name = $data->fname; 
		$response = [  "status" => "success",
		               "message" => "Hello" . $name . "from PHP" ];

		echo json_encode($response); 
	}
	else { echo json_encode(["status" => "false", "message" => "error occured"]); 	
	     }		   
?>

