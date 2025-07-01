<?php
// search_courses.php
include("database.php"); // This file sets up $conn using mysqli_connect

// Enable CORS (Cross-Origin Resource Sharing) if needed
header("Access-Control-Allow-Origin: *"); // Or specify your React app's origin
header("Content-Type: application/json");

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';

// Prepare the SQL statement using MySQLi
$stmt = $conn->prepare("SELECT course_id AS id, course_code AS name FROM courses WHERE REPLACE(course_code,' ','') LIKE ?");
if ($stmt === false) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

$searchParam = '%' . $searchTerm . '%';
$stmt->bind_param("s", $searchParam);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Execute failed: " . $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$courses = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($courses);

$stmt->close();
$conn->close();
?>
