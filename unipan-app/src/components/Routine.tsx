import React from "react";
import "../index.css";
import axios from "axios";

interface Section {
  course_code: string;
  day: string;
  start_time: string;
  end_time: string;
  faculty: string;
  room: string;
  timeslot_id: number;
  section_id: number;
}

interface RoutineProps {
  routineData: Section[];
  onClose: () => void;
  isLoggedIn: boolean;
}

const Routine: React.FC<RoutineProps> = ({
  isLoggedIn,
  routineData,
  onClose,
}) => {
  const timeSlots = [
    "08:00-09:30 AM",
    "09:40-11:10 AM",
    "11:20 AM-12:50 PM",
    "01:00-02:30 PM",
    "02:40-04:10 PM",
    "04:20-05:50 PM",
    "06:00-07:30 PM",
  ];
  console.log(routineData);
  const uniqueDays = [...new Set(routineData.map((item) => item.day))].sort();

  const timeSlotIdToDetailsMap: {
    [key: number]: { startIndex: number; span: number };
  } = {
    1: { startIndex: 0, span: 1 }, // "08:00-09:30 AM"
    2: { startIndex: 1, span: 1 }, // "09:40-11:10 AM"
    3: { startIndex: 2, span: 1 }, // "11:20 AM-12:50 PM"
    4: { startIndex: 3, span: 1 }, // "01:00-02:30 PM"
    5: { startIndex: 4, span: 1 }, // "02:40-04:10 PM"
    6: { startIndex: 5, span: 1 }, // "04:20-05:50 PM"
    7: { startIndex: 6, span: 1 }, // "06:00-07:30 PM"
    8: { startIndex: 0, span: 2 }, // "08:00-11:10 AM"
    9: { startIndex: 1, span: 2 }, // "09:40-12:50 PM"
    10: { startIndex: 2, span: 2 }, // "11:20 AM-02:30 PM"
    11: { startIndex: 3, span: 2 }, // "01:00-04:10 PM"
    12: { startIndex: 4, span: 2 }, // "02:40-05:50 PM"
    13: { startIndex: 5, span: 2 }, // "04:20-07:30 PM"
  };
  //console.log("loggedin:", isLoggedIn);

  const sectionIds = routineData.map((section) => section.section_id);
  console.log("Section IDs to save:", sectionIds);
  const saveroutine = async () => {
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

  return (
    <div className="routine-display">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h4>Generated Routine</h4>
        <button
          onClick={onClose}
          className="btn btn-secondary"
          id="routinebutton"
          style={{
            backgroundColor: "rgb(160, 22, 12)",
            border: "none",
            padding: "4px 10px",
          }}
        >
          X
        </button>
      </div>
      <div className="routine-table-container">
        <table
          //className="routine-table"
          style={{
            width: "100%",
            tableLayout: "fixed",
            borderCollapse: "collapse",
            margin: "20px auto",
          }}
        >
          <thead>
            <tr style={{ height: "50px" }}>
              <th style={tableCellStyle}>Day</th>
              {timeSlots.map((time, index) => (
                <th key={index} style={tableCellStyle}>
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueDays.map((day) => (
              <tr key={day} style={{ height: "40px" }}>
                <td style={tableCellStyle}>{day}</td>
                {timeSlots.map((time, index) => {
                  const classInfo = routineData.find(
                    (item) =>
                      item.day === day &&
                      timeSlotIdToDetailsMap[item.timeslot_id]?.startIndex ===
                        index
                  );

                  const colSpan = classInfo
                    ? timeSlotIdToDetailsMap[classInfo.timeslot_id]?.span || 1
                    : 1;

                  if (
                    classInfo &&
                    timeSlotIdToDetailsMap[classInfo.timeslot_id]
                      ?.startIndex === index
                  ) {
                    return (
                      <td
                        key={`${day}-${index}`}
                        style={{ ...tableCellStyle, textAlign: "center" }}
                        colSpan={colSpan}
                      >
                        <div>{classInfo.course_code}</div>
                        <div>{classInfo.faculty}</div>
                        <div>{classInfo.section_num}</div>
                        <div>{classInfo.room}</div>
                      </td>
                    );
                  } else if (
                    !routineData.some(
                      (item) =>
                        item.day === day &&
                        timeSlotIdToDetailsMap[item.timeslot_id]?.startIndex ===
                          index
                    )
                  ) {
                    return (
                      <td key={`${day}-${index}`} style={tableCellStyle}></td>
                    );
                  }
                  return null;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {isLoggedIn && (
          <button
            className="container"
            style={{ position: "absolute", bottom: "100px", right: "100px" }}
            onClick={() => saveroutine()}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

const tableCellStyle = {
  border: "1px solid black",
  padding: "8px",
};

export default Routine;
