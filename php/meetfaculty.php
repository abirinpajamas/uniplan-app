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
    $dept = $data->selectedDepartment;
    
    

    $sql = "SELECT
     f.faculty_id,
    f.faculty_initial,
    AVG(fr.rating) AS rating
    FROM
    faculties f
    INNER JOIN
    departments d ON f.department_idno = d.department_id
    LEFT JOIN
    facultyrating fr ON fr.faculty_idno = f.faculty_id
    WHERE
    d.department_name Like ?
    GROUP BY
    f.faculty_initial
    ORDER BY
    rating DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",  $dept);
    if (!$stmt->execute()) {
        echo json_encode(["error" => "Execute failed: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    $fac = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($fac);
   
    $stmt->close();
    }
    
    $conn->close();

?>