import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const EmployeeEntryForm = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Data:", employee);
    alert(`Employee ${employee.name} added successfully!`);
    setEmployee({
      name: "",
      email: "",
      phone: "",
      position: "",
      salary: "",
      joiningDate: "",
    });
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center">👤 Employee Entry Form</h3>
      <Card style={{ borderRadius: "18px", padding: "20px", boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employee Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={employee.name} 
                  onChange={handleChange} 
                  placeholder="Enter full name" 
                  required 
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={employee.email} 
                  onChange={handleChange} 
                  placeholder="Enter email" 
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control 
                  type="tel" 
                  name="phone" 
                  value={employee.phone} 
                  onChange={handleChange} 
                  placeholder="Enter phone number" 
                  required 
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Position</Form.Label>
                <Form.Control 
                  type="text" 
                  name="position" 
                  value={employee.position} 
                  onChange={handleChange} 
                  placeholder="Enter position" 
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Salary</Form.Label>
                <Form.Control 
                  type="number" 
                  name="salary" 
                  value={employee.salary} 
                  onChange={handleChange} 
                  placeholder="Enter salary" 
                  required 
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Joining Date</Form.Label>
                <Form.Control 
                  type="date" 
                  name="joiningDate" 
                  value={employee.joiningDate} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary">
            Add Employee
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeEntryForm;
