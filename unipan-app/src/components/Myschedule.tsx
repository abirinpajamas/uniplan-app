import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for fetching data

// Define the structure of a saved routine item
interface SavedRoutine {
  id: string; // Unique ID for the saved routine
  name: string; // Name given by the user to the routine
  sectionIds: number[]; // Array of section IDs
  routineDetails: SectionDetail[]; // Array of SectionDetail objects
  createdAt: Date;
}

// Define the structure of a section detail (adjust to your backend data)
interface SectionDetail {
  section_id: number;
  course_code: string;
  day: string;
  start_time: string;
  end_time: string;
  faculty: string;
  room: string;
  // Add other relevant fields
}

// Styled components (same as before)
const SavedRoutinesContainer = styled.div`
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const RoutinesHeader = styled.h2`
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

const RoutineCard = styled.div`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 15px;
  display: flex;
  justifycontent: space-between;
  align-items: center;
`;

const RoutineName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #218838;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c82333;
  }
`;

const RoutineDataPreview = styled.div`
  padding: 15px;
  font-size: 0.85rem;
  color: #555;
  border-top: 1px solid #eee;

  p {
    margin-bottom: 5px;
  }
`;

interface SavedRoutinesProps {
  savedRoutines: SavedRoutine[];
  onViewRoutine: (routineData: any) => void; // Function to display the full routine
  onDeleteRoutine: (routineId: string) => void;
  isLoggedIn: boolean;
}

const Myschedule: React.FC<SavedRoutinesProps> = ({
  savedRoutines,
  onViewRoutine,
  onDeleteRoutine,
  isLoggedIn,
}) => {
  const [routinesWithDetails, setRoutinesWithDetails] = useState<
    SavedRoutine[]
  >([]);

  // Function to fetch section details for a given array of sectionIds
  const fetchRoutineDetails = async () => {
    const sectionIds = routineData.map((section) => section.section_id);
    console.log("Section IDs to save:", sectionIds);
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);

    try {
      const response = await axios.post(
        "http://localhost/website/php/saveroutines.php",
        {
          sectionIds: sectionIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.data.success) {
        //alert(response.data.message);
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const loadRoutineDetails = async () => {
      const detailedRoutines = [];
      for (const routine of savedRoutines) {
        const routineDetails = await fetchRoutineDetails(routine.sectionIds);
        detailedRoutines.push({ ...routine, routineDetails });
      }
      setRoutinesWithDetails(detailedRoutines);
    };

    if (isLoggedIn && savedRoutines.length > 0) {
      loadRoutineDetails();
    }
  }, [isLoggedIn, savedRoutines]); // Re-run when isLoggedIn or savedRoutines changes

  if (!isLoggedIn) {
    return (
      <SavedRoutinesContainer>
        <p>
          Please{" "}
          <Link to="/login" style={{ color: "#007bff" }}>
            log in
          </Link>{" "}
          to see your saved routines.
        </p>
      </SavedRoutinesContainer>
    );
  }

  if (routinesWithDetails.length === 0 && savedRoutines.length > 0) {
    return (
      <SavedRoutinesContainer>
        <RoutinesHeader>Saved Class Routines</RoutinesHeader>
        <p>Loading routine details...</p>
      </SavedRoutinesContainer>
    );
  }

  if (routinesWithDetails.length === 0 && savedRoutines.length === 0) {
    return (
      <SavedRoutinesContainer>
        <RoutinesHeader>Saved Class Routines</RoutinesHeader>
        <p>You haven't saved any class routines yet.</p>
      </SavedRoutinesContainer>
    );
  }

  return (
    <SavedRoutinesContainer>
      <RoutinesHeader>Saved Class Routines</RoutinesHeader>
      {routinesWithDetails.map((routine) => (
        <RoutineCard key={routine.id}>
          <CardHeader>
            <RoutineName>
              {routine.name ||
                `Routine created on ${routine.createdAt.toLocaleDateString()}`}
            </RoutineName>
            <Actions>
              <ViewButton onClick={() => onViewRoutine(routine.routineDetails)}>
                View
              </ViewButton>
              <DeleteButton onClick={() => onDeleteRoutine(routine.id)}>
                Delete
              </DeleteButton>
            </Actions>
          </CardHeader>
          <RoutineDataPreview>
            {/* More detailed preview using fetched section data */}
            {routine.routineDetails &&
              routine.routineDetails.slice(0, 3).map((section, index) => (
                <p key={index}>
                  {section.course_code} - {section.day} ({section.start_time} -{" "}
                  {section.end_time}) - {section.faculty}
                </p>
              ))}
            {routine.routineDetails && routine.routineDetails.length > 3 && (
              <p>...</p>
            )}
            {!routine.routineDetails && <p>No preview available.</p>}
          </RoutineDataPreview>
        </RoutineCard>
      ))}
    </SavedRoutinesContainer>
  );
};

export default Myschedule;
