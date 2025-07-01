<?php
include("database.php");
header("Access-Control-Allow-Origin: *");
	  // Allow POST and OPTIONS methods
	 
	  // Allow headers that you expect to receive (e.g., Content-Type)
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
   
$coursesWithLabs = 
   ["CSE 115",
    'CSE 215',
    'CSE 225',
    'CSE 231',
    'CSE 311',
    'CSE 331',
    'CSE 332',
    'EEE 141',
    'EEE 111',
  ]; 

  

  function hasTimeConflict($section, $schedule) {
    // Mapping of timeslot IDs to their corresponding time intervals
    $timeslotMapping = [
        1  => ['08:00', '09:30'],
        2  => ['09:40', '11:10'],
        3  => ['11:20', '12:50'],
        4  => ['13:00', '14:30'],
        5  => ['14:40', '16:10'],
        6  => ['16:20', '17:50'],
        7  => ['18:00', '19:30'],
        8  => ['08:00', '11:10'],  // Overlaps with timeslot 1 (and 2 partially)
        9  => ['09:40', '12:50'],  // Overlaps with timeslot 2 (and 3 partially)
        10 => ['11:20', '14:30'],  // Overlaps with timeslot 3 (and 4 partially)
        11 => ['13:00', '16:10'],  // Overlaps with timeslot 4 (and 5 partially)
        12 => ['14:40', '17:50'],  // Overlaps with timeslot 5 (and 6 partially)
        13 => ['16:20', '19:30']   // Overlaps with timeslot 6 (and 7 partially)
    ];

  
    if (!isset($section['day'], $section['timeslot_id']) || !isset($timeslotMapping[$section['timeslot_id']])) {
        return false;
    }

    
    $startTime = DateTime::createFromFormat('H:i', $timeslotMapping[$section['timeslot_id']][0]);
    $endTime   = DateTime::createFromFormat('H:i', $timeslotMapping[$section['timeslot_id']][1]);


    $secday=str_split($section['day']);
    if (!$startTime || !$endTime) {
        return false;
    }
    foreach ($schedule as $scheduledSection) {
        if (!isset($scheduledSection['day'], $scheduledSection['timeslot_id']) || !isset($timeslotMapping[$scheduledSection['timeslot_id']])) {
            continue;
        }

        $schday=str_split($scheduledSection['day']);
        // Only consider sections on the same day

        //$logM= "Routine array:\n" . print_r($schday, true) . "\n--------------------\n";
        //file_put_contents('debug5.log', $logM, FILE_APPEND);
    

        $check=0;
        
        foreach( $secday as $day) {
            foreach ($schday as $scheduledDay) {
               if( $day == $scheduledDay){
                $check=1 ; 
               }// Skip to the next scheduled section if the day doesn't match
            }
        } 
        if ($check == 0) {
            continue;
        
        }

        // Create DateTime objects for the scheduled section's start and end times
        $scheduledStart = DateTime::createFromFormat('H:i', $timeslotMapping[$scheduledSection['timeslot_id']][0]);
        $scheduledEnd   = DateTime::createFromFormat('H:i', $timeslotMapping[$scheduledSection['timeslot_id']][1]);
        if (!$scheduledStart || !$scheduledEnd) {
            continue;
        }
        if ($endTime > $scheduledStart && $startTime < $scheduledEnd) {
            return true;
        }
        
        
    }

    return false;
}


  

      function generateRoutine(
        $index,
        $currentSchedule,
        $currentCredits,
        $selectedCoursesWithPairs,
        $sectionsByCourse,
        $totalCredits,
        $faculties,
        &$bestRoutine,
        &$minConflicts,
        &$foundRoutineWithPreferredFaculty,
        $theoryLabMap
    ) {
        // Base case: Check if all courses have been considered
        if ($index === count($selectedCoursesWithPairs)) {
            // Check if the total credits fit within the desired range
            if ($currentCredits > $totalCredits + 1) {
                return;
            }
    
            // Calculate faculty penalty based on preference
            $facultyPenalty = 0;
            foreach ($currentSchedule as $section) {
                if (!isset($section['faculty']) || !in_array($section['faculty'], $faculties)) {
                    $facultyPenalty++;
                }
            }
    
            // Update the best routine found based on the current penalty
            if ($facultyPenalty < $minConflicts) {
                $minConflicts = $facultyPenalty;
                $bestRoutine = $currentSchedule;
            }
    
            // If routine with preferred faculty is found, set the flag
            if ($facultyPenalty == 0) {
                $foundRoutineWithPreferredFaculty = true;
            }
            return;
        }
    
        // Contrast with the provided code, iterate over theory and lab courses when applicable
        $theoryCourse = $selectedCoursesWithPairs[$index];
        $labCourse = isset($theoryLabMap[$theoryCourse]) ? $theoryLabMap[$theoryCourse] : null;
    
        if ($labCourse && isset($sectionsByCourse[$theoryCourse]) && isset($sectionsByCourse[$labCourse])) {
            foreach ($sectionsByCourse[$theoryCourse] as $theorySection) {
                foreach ($sectionsByCourse[$labCourse] as $labSection) {
                    if (isset($theorySection['faculty'], $labSection['faculty']) &&
                        $theorySection['faculty'] === $labSection['faculty'] &&
                        !hasTimeConflict($theorySection, $currentSchedule) &&
                        !hasTimeConflict($labSection, $currentSchedule)) {
    
                        $newSchedule = $currentSchedule;
                        $newSchedule[] = $theorySection;
                        $newSchedule[] = $labSection;
    
                        $newCredits = $currentCredits + ($theorySection['credits'] ?? 0) + ($labSection['credits'] ?? 0);
    
                        // Recursively generate the routine
                        generateRoutine(
                            $index + 1,
                            $newSchedule,
                            $newCredits,
                            $selectedCoursesWithPairs,
                            $sectionsByCourse,
                            $totalCredits,
                            $faculties,
                            $bestRoutine,
                            $minConflicts,
                            $foundRoutineWithPreferredFaculty,
                            $theoryLabMap
                        );
                    }
                }
            }
        } elseif (!$labCourse && isset($sectionsByCourse[$theoryCourse])) {
            foreach ($sectionsByCourse[$theoryCourse] as $theorySection) {
                if (!hasTimeConflict($theorySection, $currentSchedule)) {
                    $newSchedule = $currentSchedule;
                    $newSchedule[] = $theorySection;
    
                    $newCredits = $currentCredits + ($theorySection['credits'] ?? 0);
    
                    // Recursively generate the routine
                    generateRoutine(
                        $index + 1,
                        $newSchedule,
                        $newCredits,
                        $selectedCoursesWithPairs,
                        $sectionsByCourse,
                        $totalCredits,
                        $faculties,
                        $bestRoutine,
                        $minConflicts,
                        $foundRoutineWithPreferredFaculty,
                        $theoryLabMap
                    );
                }
            }
        }
    }  



  if($_SERVER["REQUEST_METHOD"] === "POST") {
      $data = json_decode(file_get_contents("php://input")); 

    $credits = $data->totalCredits;
    $courses = $data->selectedCourse;
    $faculties = $data->selectedFaculty;
    $starttime = $data->startTime;
    $endTime = $data->endTime;
    $daycom = $data->dayCombination;

    $timeslots = [
        "08:00-09:30" => 1,
        "09:40-11:10" => 2,
        "11:20-12:50" => 3,
        "13:00-14:30" => 4,
        "14:40-16:10" => 5,
        "16:20-17:50" => 6,
        "18:00-19:30" => 7,
        "08:00-11:10" => 8,
        "09:40-12:50" => 9,
        "11:20-14:30" => 10,
        "13:00-16:10" => 11,
        "14:40-17:50" => 12,
        "16:20-19:30" => 13,
    ];

    $start = DateTime::createFromFormat('H:i', $starttime);
    $end = DateTime::createFromFormat('H:i', $endTime);
    $slots=[];

    $results=[];
    $sectionsByCourse = [];

    foreach($timeslots as $timeslot => $id){
       list($starttim, $endtim) = explode("-", $timeslot);
         
    
      $startTi = DateTime::createFromFormat('H:i', $starttim);
      $endTi = DateTime::createFromFormat('H:i', $endtim);
      if( $start <= $startTi && $endTi <= $end){
       $slots[] = $id;
       }
    }

  
    $days=str_split(string: $daycom);

    $result=[];
    
    foreach ($courses as $course) {
     
        foreach ($days as $day) {
              
            $sql = "SELECT courses.Course_Code, sections.section_id,sections.sec_num, sections.time_slot_id, courses.Credits, faculties.faculty_initial, sections.starttime_ID, sections.endtime_ID, sections.day, sections.room_no
            FROM sections
            INNER JOIN courses ON sections.course_idno = courses.course_id
            INNER JOIN faculties ON sections.faculty_id = faculties.faculty_id
            WHERE courses.Course_Code = ? AND sections.day LIKE '" . $day. "%'";
            
        
        if(!empty($slots)){

          $placehold=implode(",",array_fill(0,count( $slots),"?"));
          $sql.= "and sections.time_slot_id IN ($placehold)";
        }   

        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
        echo json_encode(["success" => false, "error" => "SQL prepare failed: " . $conn->error]);
        exit;
        }

        if(!empty($slots)){
         $types=str_repeat("s",1) .str_repeat("i",count($slots));
         $params=array_merge([$course],$slots);
         $stmt->bind_param($types, ...$params);
        }else{
        $stmt->bind_param("s", $course);
        }

        if (!$stmt->execute()) {
        echo json_encode(["success" => false, "error" => "SQL execute failed: " . $stmt->error]);
         exit;
        }
        
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
          $formattedRow = [
              'section_id' => $row['section_id'],
              'section_num' => $row['sec_num'],        
              'course_code' => $row['Course_Code'],
              'credits' => $row['Credits'],
              'faculty' => $row['faculty_initial'],
              'timeslot_id'=> $row['time_slot_id'],
              'start_time' => $row['starttime_ID'],
              'end_time' => $row['endtime_ID'],
              'day' => $row['day'],
              'room' => $row['room_no'],
          ];
          $results[] = $formattedRow;
          if (!isset($sectionsByCourse[$row['Course_Code']])) {
              $sectionsByCourse[$row['Course_Code']] = [];
          }
          $sectionsByCourse[$row['Course_Code']][] = $formattedRow;
      }
        
        
        
      }

    } 
   
    $stmt->close();




    
    $allSelectedCourses = $courses;
    $theoryLabMap = [];
    $selectedTheoryCourses = [];

    foreach ($allSelectedCourses as $course) {
        $isLab = in_array(trim($course), array_map(function ($c) { return trim($c) . 'L'; }, $coursesWithLabs));
        $isTheoryWithPotentialLab = in_array(trim($course), $coursesWithLabs);

        if ($isLab) {
            $theoryEquivalent = rtrim(trim($course), 'L');
            if (!in_array(trim($theoryEquivalent), $allSelectedCourses)) {
                echo json_encode(["success" => false, "error" => "Lab course '$course' selected without its theory counterpart '$theoryEquivalent'."]);
                exit;
            }
        } elseif ($isTheoryWithPotentialLab) {
            $labEquivalent = trim($course) . 'L';
            if (in_array(trim($labEquivalent), $allSelectedCourses)) {
                $theoryLabMap[trim(string: $course)] = trim($labEquivalent);
                $selectedTheoryCourses[] = trim($course);
            } else {
              echo json_encode(["success" => false, "error" => "Theory course '$course' requires its lab course '$labEquivalent' to also be selected."]);
              exit;
            }
        } else {
            $selectedTheoryCourses[] = trim($course); // Course without a known lab
        }
    }



    $bestRoutine = [];
    $minConflicts = PHP_INT_MAX;
    $foundRoutineWithPreferredFaculty = false;

    generateRoutine(
        0,
        [],
        0,
        array_unique($selectedTheoryCourses),
        $sectionsByCourse,
        $credits,
        $faculties,
        $bestRoutine,
        $minConflicts,
        $foundRoutineWithPreferredFaculty,
        $theoryLabMap
    );
      
    if (!empty($bestRoutine)) {
      echo json_encode(["success" => true, "routine" => $bestRoutine]);
    } else {
      echo json_encode(["success" => false, "error" => "No valid routine found matching your criteria."]);
  }
  }
  
  $logMess = "Start Time: " . $starttime . "\n";
  $logMess .= "End Time: " . $endTime . "\n"; 
  $logMess .= "Results array:\n" . print_r($slots, true) . "\n--------------------\n";
  file_put_contents('debug2.log', $logMess, FILE_APPEND);

    

   // echo json_encode( $results);
    
    $logMessage = "Routine array:\n" . print_r($results, true) . "\n--------------------\n";
    file_put_contents('debug.log', $logMessage, FILE_APPEND);
    $logMe= "Routine array:\n" . print_r($bestRoutine, true) . "\n--------------------\n";
    file_put_contents('debug3.log', $logMe, FILE_APPEND);
    $logM= "Routine array:\n" . print_r($sectionsByCourse, true) . "\n--------------------\n";
    file_put_contents('debug4.log', $logM, FILE_APPEND);


    $conn->close();

?>