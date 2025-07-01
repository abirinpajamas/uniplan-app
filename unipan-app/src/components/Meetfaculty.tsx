import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  background: #ffffff; /* Changed to solid white */
  color: #333333; /* Dark text color for contrast */
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.h2`
  font-size: 2.8rem;
  margin-bottom: 3rem;
  color: #4a148c; /* Added dark purple color for title */
  text-shadow: 2px 2px 4px rgba(74, 20, 140, 0.2); /* Updated shadow color */
  letter-spacing: 0.05em;
`;

const DepartmentSelect = styled.select`
  padding: 1.2rem 1.5rem;
  border: 1px solid #673ab7;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.9); /* Light background */
  color: #673ab7; /* Purple text color */
  font-size: 1.1rem;
  margin-bottom: 3rem;
  width: 350px;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23673ab7" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position-x: 96%;
  background-position-y: center;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #9575cd;
    box-shadow: 0 0 10px rgba(103, 58, 183, 0.7);
  }
`;

const FacultyTable = styled.div`
  width: 90%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(103, 58, 183, 0.2); /* Purple shadow */
  background-color: rgba(103, 58, 183, 0.05); /* Very light purple background */
`;

const TableHeader = styled.div`
  background-color: rgba(103, 58, 183, 0.3);
  color: #fce4ec;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const TableRow = styled.div`
  padding: 1.2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1.2rem;
  border-bottom: 1px solid rgba(103, 58, 183, 0.1);
  transition: background-color 0.3s ease;
  color: #4a148c; /* Dark purple text color */

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background-color: rgba(103, 58, 183, 0.03); /* Light purple even rows */
  }

  &:hover {
    background-color: rgba(103, 58, 183, 0.08); /* Subtle hover effect */
  }
`;

// Updated message colors for better visibility
const LoadingMessage = styled.p`
  font-size: 1.4rem;
  color: #673ab7;
  margin-top: 3rem;
  font-weight: 500;
`;

const ErrorMessage = styled.p`
  font-size: 1.4rem;
  color: #d32f2f;
  margin-top: 3rem;
  font-weight: 500;
`;

const NoFacultyMessage = styled.p`
  font-size: 1.4rem;
  color: #673ab7;
  margin-top: 3rem;
  font-weight: 500;
`;
interface Meetfaculty {
  name: string;
  rating: number;
  isLoggedIn: boolean;
  // Add more properties as needed from your backend response
  [key: string]: any; // To accommodate additional dynamic columns
}

const Meetfaculty: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [facultyData, setFacultyData] = useState<
    { faculty_id: number; faculty_initial: string; rating: string | null }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const departments = ["ECE", "EEE", "Mathematics", "Physics", "Art"]; // Example departments

  useEffect(() => {
    if (selectedDepartment) {
      const fetchFaculty = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post(
            "http://localhost/website/php/meetfaculty.php",
            { selectedDepartment }
          );
          if (response.data) {
            console.log(response.data);
            setFacultyData(response.data);
          }
        } catch (e: any) {
          setError(e.message);
          setFacultyData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchFaculty();
    } else {
      setFacultyData([]); // Clear data when no department is selected
    }
  }, [selectedDepartment]);

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedDepartment(event.target.value);
  };

  return (
    <Container
      style={{ fontFamily: '"Special Gothic Expanded One", sans-serif' }}
    >
      <Title>Get to Know Before</Title>
      <DepartmentSelect
        value={selectedDepartment}
        onChange={handleDepartmentChange}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </DepartmentSelect>

      {loading && <LoadingMessage>Fetching Faculty Data...</LoadingMessage>}
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
      {!loading && !error && facultyData.length === 0 && selectedDepartment && (
        <NoFacultyMessage>
          No faculty found for {selectedDepartment}.
        </NoFacultyMessage>
      )}

      {!loading && !error && facultyData.length > 0 && (
        <FacultyTable className="factab">
          <TableHeader>
            <div>Name</div>
            <div>Rating</div>
            {/* Add more header columns based on your FacultyInfo interface */}
            <div>Details</div>
          </TableHeader>
          {facultyData.map((faculty) => (
            <TableRow
              key={
                faculty.faculty_id /* Assuming your backend returns a unique ID */
              }
            >
              <div>{faculty.faculty_initial}</div>
              <div>
                {Number(faculty.rating)
                  ? Number(faculty.rating).toFixed(2)
                  : "N/A"}
              </div>
              {/* Add more data cells based on your FacultyInfo interface */}
              <div>
                <button
                  style={{
                    background:
                      "rgba(103, 58, 183, 0.5)" /* Vibrant purple button */,
                    border: "none",
                    color: "#fce4ec",
                    borderRadius: "4px",
                    padding: "0.7rem 1.2rem",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#673ab7")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(103, 58, 183, 0.5)")
                  }
                >
                  View
                </button>
              </div>
            </TableRow>
          ))}
        </FacultyTable>
      )}
    </Container>
  );
};

export default Meetfaculty;
