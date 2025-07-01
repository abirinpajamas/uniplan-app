import React, { useEffect, useState } from "react";

interface Club {
  club_id: number;
  club_name: string;
  department: string;
  description: string;
  recruitment_date: string;
  facebook_link: string;
}

const ClubPreferences: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  // Fetch clubs from PHP backend
  useEffect(() => {
    fetch("http://localhost/website/php/get_clubs.php")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClubs(data);
      })
      .catch((err) => console.error("Error fetching clubs:", err));
  }, []);

  // Get unique departments
  const departments = Array.from(new Set(clubs.map((club) => club.department)));

  // Filter based on selection
  const filteredClubs =
    selectedDepartment === ""
      ? []
      : clubs.filter((club) => club.department === selectedDepartment);

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: '"Special Gothic Expanded One", sans-serif',
      }}
    >
      <h2>🎓 NSU Club Preferences</h2>

      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem" }}
      >
        <option value="">All Departments</option>
        {departments.map((dept, idx) => (
          <option key={idx} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {selectedDepartment === "" ? (
        <div style={{ color: "gray", fontStyle: "italic" }}>
          Select a department to view its clubs.
        </div>
      ) : filteredClubs.length === 0 ? (
        <div>No clubs found for this department.</div>
      ) : (
        filteredClubs.map((club) => (
          <div
            key={club.club_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h3>{club.club_name}</h3>
            <p>
              <strong>Description:</strong> {club.description}
            </p>
            <p>
              <strong>Recruitment Date:</strong> {club.recruitment_date}
            </p>
            <p>
              <strong>Facebook Page:</strong>{" "}
              <a href={club.facebook_link} target="_blank" rel="noreferrer">
                {club.facebook_link}
              </a>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ClubPreferences;
