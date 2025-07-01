<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Check for connection error
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Fetch all clubs
$sql = "SELECT * FROM clubs";
$result = $conn->query($sql);

$clubs = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $clubs[] = $row;
    }
}
$logM= "clubs:\n" . print_r($clubs, true) . "\n--------------------\n";
file_put_contents('debug4.log', $logM, FILE_APPEND);
echo json_encode($clubs);

$conn->close();
?>