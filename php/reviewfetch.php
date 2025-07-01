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
    
    

    $sql = "SELECT
    concat(users.fname, ' ', users.lname) AS name,
    facultyreview.user_idno AS idno,
    Review_Text,
    facultyreview.Comment_Num AS id,
    facultyreview.like_count AS likes,
    GROUP_CONCAT(liker.liker_id) AS liker_ids  
    FROM
    facultyreview
    INNER JOIN
    users ON facultyreview.user_idno = users.user_id
    LEFT JOIN  
    liker ON liker.comment_no = facultyreview.Comment_Num
    WHERE
    faculty_idno = ?
    GROUP BY
    facultyreview.Comment_Num, facultyreview.user_idno, users.fname, users.lname, Review_Text, facultyreview.like_count
    order by facultyreview.like_count DESC;";


    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",  $faculty);
    if (!$stmt->execute()) {
        echo json_encode(["error" => "Execute failed: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    $reviews = $result->fetch_all(MYSQLI_ASSOC);


    

    echo json_encode($reviews);
   
    $stmt->close();
    }
    
    $conn->close();

?>