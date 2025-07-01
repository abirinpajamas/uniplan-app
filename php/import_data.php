<?php
include("database.php"); // Assuming this file establishes your $conn

// Error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

global $num,$num2,$num3;
$num = 0;
$num2=0;
$num3=0;
function getCourseId($conn, $courseName) {
    $courseName = preg_replace('/([A-Za-z]+)(\d+)/', '$1 $2', $courseName);
    $courseName = mysqli_real_escape_string($conn, $courseName);
    $query = "SELECT course_id FROM courses WHERE course_code Like '$courseName'";
    $result = mysqli_query($conn, $query);
    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        mysqli_free_result($result);
        return $row['course_id'];
    }
    return null;
}

// Function to get faculty ID
function getFacultyId($conn, $facultyName) {
    global $num;
    $facultyName = mysqli_real_escape_string($conn, $facultyName);
    $query = "SELECT faculty_id FROM faculties WHERE faculty_initial LIKE '$facultyName'";
    $result = mysqli_query($conn, $query);
    if ($result && mysqli_num_rows($result) > 0) {
        
        $row = mysqli_fetch_assoc($result);
        mysqli_free_result($result);
        return $row['faculty_id'];
    }
    return null;
}



if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Path to your CSV file (adjust as needed)
$csvFile = 'C:\Users\Abir hasan\Documents\offered summer final - Sheet1.csv';

if (($handle = fopen($csvFile, "r")) !== FALSE) {
    // Get the header row to use as keys
    $header = fgetcsv($handle);
    if ($header === false) {
        die("Error reading CSV header.");
    }

    while (($row = fgetcsv($handle)) !== FALSE) {
        // Combine header and row data into an associative array
        $rowData = array_combine($header, $row);

        $sectionNum = isset($rowData['Section']) ? trim($rowData['Section']) : null;
        $courseName = isset($rowData['Course']) ? trim($rowData['Course']) : null;
        $day = isset($rowData['Day']) ? trim($rowData['Day']) : null;
        $starttime = isset($rowData['startime_ID']) ? trim($rowData['startime_ID']) : null;
        $endtime = isset($rowData['endtime_ID']) ? trim($rowData['endtime_ID']) : null;
        $timeslot = isset($rowData['timeslot_ID']) ? trim($rowData['timeslot_ID']) : null;
        $roomNo = isset($rowData['Room']) ? trim($rowData['Room']) : null;
        $facultyName = isset($rowData['Faculty']) ? trim($rowData['Faculty']) : null;

        if ($courseName && $sectionNum && $facultyName && $roomNo) {
            
            $courseId = getCourseId($conn, $courseName);
            $facultyId = getFacultyId($conn, $facultyName);
           
            if($facultyId !==null){
                $num=$num+1;
            }
            if($courseId !==null){
                $num2=$num2+1;
            }
            if($timeslot !==null){
                $num3=$num3+1;
            }

            if ($courseId !== null && $facultyId !== null && $timeslot !== null) {
               
                $sectionNum = mysqli_real_escape_string($conn, $sectionNum);
                $roomNo = mysqli_real_escape_string($conn, $roomNo);
                $day = mysqli_real_escape_string($conn, $day);

                $query = "INSERT INTO sections (sec_num, course_idno, starttime_ID, endtime_ID, room_no, day, faculty_id, time_slot_id)
                          VALUES ('$sectionNum', '$courseId', '$starttime', '$endtime', '$roomNo', '$day', '$facultyId', '$timeslot')";

                if (mysqli_query($conn, $query)) {
                    
                    // echo "Section '$sectionNum' inserted successfully.<br>";
                } else {
                    
                    echo "Error inserting section '$sectionNum': " . mysqli_error($conn) . "<br>";
                }
            } else {
                echo "Skipping row due to missing course_id, faculty_id, or timeslot_id for Course: '$courseId', Section: '$sectionNum', faculty:'$facultyId'.<br>";
            }
        } else {
            echo "Skipping row due to missing data: Course: '$courseName', Section: '$sectionNum', faculty:'$facultyName'.php<br>";
        }
    }
    fclose($handle);
    echo "Data import process completed.<br>";
    echo "runs fac '$num',course: '$num2', timeslot: '$num3' <br>";
} else {
    die("Error opening the CSV file.");
}

mysqli_close($conn);
?>