import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";
import Routine from "./Routine.tsx";
//import { CSSTransition } from "react-transition-group";
//import "../transitions.css";

//function Courseroutineform() {

interface CourseroutineformProps {
  isLoggedIn: boolean;
}

const Courseroutineform: React.FC<CourseroutineformProps> = ({
  isLoggedIn,
}) => {
  const [generatedRoutine, setGeneratedRoutine] = useState<any[] | null>(null); // State to hold the generated routine
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRoutineVisible, setIsRoutineVisible] = useState(false);
  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [faculties, setFaculties] = useState<
    { id: number; name: string; courses: string[] }[]
  >([]);
  const [selectedCourse, setSelectedCourse] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [totalCredits, setTotalCredits] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dayCombination, setDayCombination] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<
    { id: number; name: string }[]
  >([]);
  const [filteredFaculties, setFilteredFaculties] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingFaculties, setLoadingFaculties] = useState(false);

  const labcourses = [
    "CSE 115",
    "CSE 215",
    "CSE 225",
    "CSE 231",
    "CSE 311",
    "CSE 331",
    "CSE 332",
    "EEE 141",
    "EEE 111",
  ];

  const handleCourseSelection = (courseName: string) => {
    let isLab = courseName.endsWith("L");
    let cn = courseName.slice(0, -1);
    if (!selectedCourse.includes(courseName)) {
      let newCourses = [...selectedCourse, courseName];
      if (labcourses.includes(courseName) && !isLab) {
        newCourses.push(courseName + "L");
      } else if (labcourses.includes(cn) && isLab) {
        newCourses.push(cn);
      }
      setSelectedCourse(newCourses);
    }
  };
  const handleCourseRemove = (courseName: string) => {
    if (
      labcourses.includes(courseName) ||
      labcourses.includes(courseName.slice(0, -1))
    ) {
      const isLab = courseName.endsWith("L");
      const theoryCourse = isLab ? courseName.slice(0, -1) : courseName;
      const labCourse = theoryCourse + "L";

      setSelectedCourse(
        selectedCourse.filter(
          (course) => course !== theoryCourse && course !== labCourse
        )
      );
    } else {
      setSelectedCourse(
        selectedCourse.filter((course) => course !== courseName)
      );
    }
  };

  const handleFacultySelection = (Facultyname: string) => {
    if (!selectedFaculty.includes(Facultyname)) {
      setSelectedFaculty([...selectedFaculty, Facultyname]); //adding new course to the existing array
    }
  };

  const handleFacultyRemove = (Facultyname: string) => {
    setSelectedFaculty(
      selectedFaculty.filter((faculty) => faculty !== Facultyname)
    );
  };
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await axios.get(
          `http://localhost/website/php/search_courses.php?search=${courseSearch}`
        );
        if (Array.isArray(response.data)) {
          // Check if response.data is an array
          setFilteredCourses(response.data.slice(0, 5));
        } else {
          console.error("Error: Courses data is not an array:", response.data);
          setFilteredCourses([]); // Set to empty array to prevent map error.
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setFilteredCourses([]); // Set to empty array on error.
      } finally {
        setLoadingCourses(false);
      }
    };

    if (courseSearch) {
      fetchCourses();
    } else {
      setFilteredCourses([]);
    }
  }, [courseSearch]);

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoadingFaculties(true);
      try {
        const response = await axios.get(
          `http://localhost/website/php/search_faculties.php?search=${facultySearch}`
        );
        if (Array.isArray(response.data)) {
          // Check if response.data is an array
          setFilteredFaculties(response.data.slice(0, 5));
        } else {
          console.error("Error: Faculty data is not an array:", response.data);
          setFilteredFaculties([]); // Set to empty array to prevent map error.
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
      } finally {
        setLoadingFaculties(false);
      }
    };

    if (facultySearch) {
      fetchFaculties();
    } else {
      setFilteredFaculties([]);
    }
  }, [facultySearch]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [start] = startTime.split(":").map(Number);
    const [end] = endTime.split(":").map(Number);
    if (!totalCredits || !selectedCourse.length || !selectedFaculty.length) {
      alert("Please fill in all fields.");
      return;
    }
    if (!startTime || !endTime || !dayCombination) {
      alert("Please fill in all fields.");
      return;
    }
    if (start === end) {
      alert("Invalid timing.");
      return;
    }

    if (start >= 12 && end >= 12) {
      if (start > end) {
        alert("End time must be after start time.");
        return;
      }
    } else if (start < 8 && end < 8) {
      if (start > end) {
        alert("End time must be after start time.");
        return;
      }
    } else if (start < 8 && end >= 8) {
      alert("End time must be after start time.");
      return;
    }
    // totalCredits = Math.abs(totalCredits);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost/website/php/course_scheduler.php",

        {
          totalCredits,
          selectedCourse,
          selectedFaculty,
          startTime,
          endTime,
          dayCombination,
        }
      );

      setLoading(false);
      console.log(response.data);

      if (response.data && response.data.success && response.data.routine) {
        setGeneratedRoutine(response.data.routine); // Store the routine in state
        setIsRoutineVisible(true); // Show the routine
      } else {
        setGeneratedRoutine(null);
        setError(response.data?.error || "No valid routine found.");
        setIsRoutineVisible(false);
        alert(error);
        setIsRoutineVisible(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
    console.log({
      totalCredits,
      selectedCourse,
      selectedFaculty,
      startTime,
      endTime,
      dayCombination,
    });
  };
  const handleCloseRoutine = () => {
    setIsRoutineVisible(false);
    setGeneratedRoutine(null); // Optionally clear the routine data
  };

  return (
    <div>
      {!generatedRoutine || !isRoutineVisible ? (
        <form
          className="row g-3 needs-validation"
          id="myForm"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="col-md-4">
            <label htmlFor="totalCredits" className="form-label">
              Total Credits
            </label>
            <input
              type="number"
              min="0"
              max="30"
              className="form-control"
              id="totalCredits"
              value={totalCredits}
              onChange={(e) => setTotalCredits(e.target.value)}
              required
            />
            <div className="invalid-feedback">Please enter total credits.</div>
          </div>

          <div className="col-md-4">
            <label htmlFor="courseSearch" className="form-label">
              Search Course
            </label>
            <input
              type="text"
              className="form-control"
              id="courseSearch"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
            <ul className="list-group">
              {loadingCourses && (
                <li className="list-group-item">Loading...</li>
              )}
              {filteredCourses.map((course) => (
                <li
                  key={course.id}
                  className="list-group-item"
                  onClick={() => handleCourseSelection(course.name)}
                  style={{ cursor: "pointer" }}
                >
                  {course.name}
                </li>
              ))}
            </ul>
            {selectedCourse.length > 0 && (
              <div>
                Courses:{" "}
                {selectedCourse.map((courseName) => (
                  <span key={courseName}>
                    {courseName}
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={
                        {
                          "--bs-btn-padding-y": ".03rem",
                          "--bs-btn-padding-x": ".12rem",
                          "--bs-btn-font-size": ".60rem",
                          borderRadius: "50%",
                        } as React.CSSProperties
                      }
                      onClick={() => handleCourseRemove(courseName)}
                    >
                      x
                    </button>
                    {", "}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="facultySearch" className="form-label">
              Search Faculty
            </label>
            <input
              type="text"
              className="form-control"
              id="facultySearch"
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
            />
            <ul className="list-group">
              {loadingFaculties && (
                <li className="list-group-item">Loading...</li>
              )}
              {filteredFaculties.map((faculty) => (
                <li
                  key={faculty.id}
                  className="list-group-item"
                  onClick={() => handleFacultySelection(faculty.name)}
                  style={{ cursor: "pointer" }}
                >
                  {faculty.name}
                </li>
              ))}
            </ul>
            {selectedFaculty.length > 0 && (
              <div>
                Faculties:{" "}
                {selectedFaculty.map((Facultyname) => (
                  <span key={Facultyname}>
                    {Facultyname}
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={
                        {
                          "--bs-btn-padding-y": ".03rem",
                          "--bs-btn-padding-x": ".12rem",
                          "--bs-btn-font-size": ".60rem",
                          borderRadius: "50%",
                        } as React.CSSProperties
                      }
                      onClick={() => handleFacultyRemove(Facultyname)}
                    >
                      x
                    </button>
                    {", "}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-4">
            <label htmlFor="startTime" className="form-label">
              Preferred Start Time
            </label>
            <select
              className="form-select"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              <option value="">Choose...</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:40">09:40 AM</option>
              <option value="11:20">11:20 AM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:40">02:40 PM</option>
              <option value="16:20">04:20 PM</option>
            </select>
            <div className="invalid-feedback">Please select a start time.</div>
          </div>

          <div className="col-md-4">
            <label htmlFor="endTime" className="form-label">
              Preferred End Time
            </label>
            <select
              className="form-select"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              <option value="">Choose...</option>
              <option value="09:30">09:30 AM</option>
              <option value="11:10">11:10 AM</option>
              <option value="12:50">12:50 PM</option>
              <option value="14:30">02:30 PM</option>
              <option value="16:10">04:10 PM</option>
              <option value="17:50">05:50 PM</option>
              <option value="19:30">07:30 PM</option>
            </select>
            <div className="invalid-feedback">Please select an end time.</div>
          </div>

          <div className="col-md-4">
            <label htmlFor="dayCombination" className="form-label">
              Day Combination
            </label>
            <select
              className="form-select"
              id="dayCombination"
              value={dayCombination}
              onChange={(e) => setDayCombination(e.target.value)}
              required
            >
              <option value="">Choose...</option>
              <option value="ST">ST</option>
              <option value="RA">RA</option>
              <option value="MW">MW</option>
              <option value="STRA">STRA</option>
              <option value="MWRA">MWRA</option>
              <option value="STMW">STMW</option>
            </select>
            <div className="invalid-feedback">
              Please select a day combination.
            </div>
          </div>

          <div className="col-12">
            <button className="container" type="submit" disabled={loading}>
              {loading ? "Generating Routine..." : "Generate Routine"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </form>
      ) : (
        <Routine
          routineData={generatedRoutine}
          onClose={handleCloseRoutine}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default Courseroutineform;
