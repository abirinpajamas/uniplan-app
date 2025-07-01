<?php
include("database.php"); // This file sets up $conn using mysqli_connect

// Enable CORS (Cross-Origin Resource Sharing) if needed
header("Access-Control-Allow-Origin: *"); // Or specify your React app's origin
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';

// Prepare the SQL statement using MySQLi
$stmt = $conn->prepare("SELECT faculty_id AS id, faculty_initial AS name FROM faculties WHERE REPLACE(faculty_initial,' ','') LIKE ?");
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
$faculties = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($faculties);

$stmt->close();
$conn->close();
?>
