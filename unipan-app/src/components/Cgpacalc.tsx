import React, { useState } from "react";
import "../index.css"; // Optional: Import CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

interface Course {
  code: string;
  credits: number;
  grade: string;
}

const gradePoints: { [key: string]: number } = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

const Cgpacalc: React.FC = () => {
  const [compcg, setCompcg] = useState<number>(0.0);
  const [compcredits, setCompcredits] = useState<number>(0.0);
  const [courses, setCourses] = useState<Course[]>([
    { code: "", credits: 3, grade: "" }, // Initial course
  ]);

  const [cgpa, setCGPA] = useState<number>(0.0);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [name]: value };
    setCourses(newCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { code: "", credits: 3, grade: "" }]);
  };

  const removeCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    let oldpoints = compcg * compcredits;

    for (const course of courses) {
      const points = gradePoints[course.grade.toUpperCase()];

      if (points !== undefined) {
        totalGradePoints += points * course.credits;
        totalCredits += course.credits;
      } else if (course.grade.trim() !== "") {
        alert(`Invalid grade entered for course: ${course.code}`);
        return;
      }
    }
    if (oldpoints > 0) {
      totalGradePoints += oldpoints;
      totalCredits += compcredits;
    }

    if (totalCredits > 0) {
      setCGPA(parseFloat((totalGradePoints / totalCredits).toFixed(2)));
    } else {
      setCGPA(0.0);
    }
  };

  return (
    <div className="cgpa-calculator">
      <h2>CGPA Calculator</h2>
      <div className="course-input">
        <input
          type="number"
          name="code"
          min="0"
          placeholder="Completed Credits"
          onChange={(e) => setCompcredits(Number(e.target.value))}
          style={{
            margin: "2px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            height: "35px",
            width: "155px",
          }}
        />
        <input
          type="text"
          name="code"
          placeholder="Current CGPA"
          onChange={(e) => setCompcg(Number(e.target.value))}
          //onChange={(event) => handleInputChange(index, event)}
          style={{
            margin: "2px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            height: "35px",
            width: "120px",
          }}
        />
      </div>
      {courses.map((course, index) => (
        <div key={index} className="course-input">
          <input
            type="text"
            name="code"
            placeholder="Course Code"
            value={course.code}
            onChange={(event) => handleInputChange(index, event)}
            style={{
              margin: "2px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              height: "35px",
            }}
          />
          <input
            type="number"
            name="credits"
            placeholder="Credits"
            min="0"
            //max="3"
            value={course.credits}
            onChange={(event) => handleInputChange(index, event)}
            style={{
              margin: "2px",
              width: "130px",
              height: "35px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <select
            name="grade"
            value={course.grade}
            onChange={(event) => handleInputChange(index, event)}
            style={{
              margin: "5px",
              width: "80px",
              height: "30px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Grade</option>
            {Object.keys(gradePoints).map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          {courses.length > 1 && (
            <button
              type="button"
              className="container"
              onClick={() => removeCourse(index)}
              style={{ margin: "5px", width: "75px", height: "30px" }}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="container"
        onClick={addCourse}
        style={{ margin: "1px", width: "100px", height: "50px" }}
      >
        Add Course
      </button>
      <button
        type="button"
        className="container"
        onClick={calculateCGPA}
        style={{ margin: "8px", width: "100px", height: "50px" }}
      >
        Calculate CGPA
      </button>
      {cgpa > 0 && (
        <div className="result">
          <h3>Your CGPA:</h3>
          <p className="cgpa-value">{cgpa}</p>
        </div>
      )}
      {cgpa === 0 && courses.length > 1 && (
        <div className="result">
          <h3>Your CGPA:</h3>
          <p className="cgpa-value">0.00</p>
        </div>
      )}
    </div>
  );
};

export default Cgpacalc;
