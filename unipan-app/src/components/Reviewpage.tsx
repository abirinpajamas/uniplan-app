import axios from "axios";
import React, { useEffect, useState } from "react";
import "../index.css";
import Facultyreview from "./Facultyreview";
import styled from "styled-components";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%; /* Ensure it takes full width to center within */
  /* You might need to adjust other styles as needed */
`;

interface ReviewpageProps {
  isLoggedIn: boolean;
}

const Reviewpage: React.FC<ReviewpageProps> = ({ isLoggedIn }) => {
  console.log("isLoggedIn in Reviewpage:", isLoggedIn);
  const [facultySearch, setFacultySearch] = useState("");
  const [filteredFaculties, setFilteredFaculties] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [facultydata, setFacultydata] = useState<any[]>([]);
  const [hidereviewpage, setHidereviewpage] = useState(false);

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

  const handleFacultySelection = async (facultyName: string) => {
    try {
      const response = await axios.get(
        `http://localhost/website/php/facultyinfo.php?search=${facultyName}`
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        setFacultydata(response.data);
        console.log("Faculty data:", response.data);
        setHidereviewpage(true);
      } else {
        console.error("Error: Faculty data is not an array:", response.data);
        // Set to empty array to prevent map error.
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  return (
    <CenteredContainer className="col-md-4">
      {!hidereviewpage ? (
        <div>
          <img
            src="/images/teacher.jpg"
            alt=""
            style={{ height: "200px", display: "block", margin: "0 auto" }}
          />
          <form
            id="facultysearch"
            style={{ boxShadow: "0 0 15px rgba(108, 91, 123, 0.5)" }}
          >
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
                  className={`list-group-item ${
                    selectedFaculty.includes(faculty.name) ? "active" : ""
                  }`}
                  onClick={() => handleFacultySelection(faculty.name)}
                  style={{ cursor: "pointer" }} // Indicate it's clickable
                >
                  {faculty.name}
                </li>
              ))}
            </ul>
          </form>
        </div>
      ) : (
        facultydata && (
          <Facultyreview
            isLoggedIn={isLoggedIn}
            professorName={facultydata[0].name}
            initial={facultydata[0].id}
            overallRating={
              facultydata[0].overallRating ? facultydata[0].overallRating : 0
            }
            ratingCount={
              facultydata[0].ratingCount ? facultydata[0].ratingCount : 0
            }
            department={facultydata[0]?.dept}
            wouldTakeAgainPercentage={
              facultydata[0].wouldTakeAgainPercentage
                ? facultydata[0].wouldTakeAgainPercentage
                : "0"
            }
            levelOfDifficulty={
              facultydata[0].levelOfDifficulty
                ? facultydata[0].levelOfDifficulty
                : 0
            } // Assuming this exists
            ratingDistribution={
              facultydata[0].ratingDistribution
                ? facultydata[0].ratingDistribution
                : 0
            }
            email={facultydata[0].email ? facultydata[0].email : ""}
            courses={facultydata.map((item) => ({
              courseName: item.course, // Assuming 'course' is the course name
              courseCode: item.coursename, // Assuming 'coursename' is the course code
            }))}
          />
        )
      )}
    </CenteredContainer>
  );
};

export default Reviewpage;
