<?php
include("database.php"); 


header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$faculty = isset($_GET['search']) ? $_GET['search'] : '';

$stmt = $conn->prepare("SELECT
    f.faculty_id AS id,
    d.department_name AS dept,
    f.user_email as email,
    CONCAT(f.fname, ' ', f.lname) AS name,
    c.Course_Name as course,
    c.Course_Code as coursename
FROM
    faculties f
INNER JOIN
    departments d ON f.department_idno = d.department_id
INNER JOIN
    sections s ON f.faculty_id = s.faculty_id 
INNER JOIN
    courses c ON s.course_idno = c.course_id 
WHERE
    REPLACE(f.faculty_initial, ' ', '') LIKE ? GROUP BY c.Course_Name");
if ($stmt === false) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

$searchParam = '%' . $faculty . '%';
$stmt->bind_param("s", $searchParam);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Execute failed: " . $stmt->error]);
    exit;
}

$result = $stmt->get_result();

$faculties = $result->fetch_all(MYSQLI_ASSOC);


$logMessage = "Faculty:\n" . print_r($faculties, true) . "\n--------------------\n";
    file_put_contents('debug.log', $logMessage, FILE_APPEND);

echo json_encode($faculties);

$stmt->close();
$conn->close();
?>
