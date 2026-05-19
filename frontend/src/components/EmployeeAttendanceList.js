import React, { useState } from "react";
import { Table, Card, Button } from "react-bootstrap";

const EmployeeAttendanceList = () => {
  const [attendance, setAttendance] = useState([
    { id: 1, name: "John Doe", date: "2026-01-25", status: "Present" },
    { id: 2, name: "Jane Smith", date: "2026-01-25", status: "Absent" },
    { id: 3, name: "Michael Johnson", date: "2026-01-25", status: "Present" },
    { id: 4, name: "Sara Williams", date: "2026-01-25", status: "Present" },
    { id: 5, name: "David Brown", date: "2026-01-25", status: "Absent" },
  ]);

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center">🗓️ Employee Attendance List</h3>

      <Card style={{ borderRadius: "18px", padding: "20px", boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}>
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === "Present" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => alert(`Edit Attendance for ${item.name}`)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      setAttendance(attendance.filter((att) => att.id !== item.id))
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default EmployeeAttendanceList;
