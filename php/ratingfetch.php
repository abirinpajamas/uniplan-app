<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
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
    $faculty = $data->initial;
    
    

    $sql = "Select rating,difficulty,takeagain from facultyrating where faculty_idno=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",  $faculty);
    if (!$stmt->execute()) {
        echo json_encode(["error" => "Execute failed: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    $ratings = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($ratings);
   
    $stmt->close();
    }
    
    $conn->close();

?>