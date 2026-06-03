import React, { useState } from "react";

const AddSubUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE / UPDATE USER
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = formData;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      setUsers([...users, formData]);
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  // EDIT USER
  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
  };

  // DELETE USER
  const handleDelete = (index) => {
    const filtered = users.filter((_, i) => i !== index);
    setUsers(filtered);
  };

  return (
  <div className="container py-3">

    <div className="row g-3">

      {/* FORM */}
      <div className="col-12 col-md-4">
        <div className="card shadow p-2 p-md-3">
          <h5 className="text-center mb-3">
            {editIndex !== null ? "Update Sub User" : "Add Sub User"}
          </h5>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              className="form-control form-control-sm mb-2"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              className="form-control form-control-sm mb-2"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              className="form-control form-control-sm mb-2"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              className="form-select form-select-sm mb-2"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>

            <button className={`btn w-100 btn-sm ${editIndex !== null ? "btn-primary" : "btn-success"}`}>
              {editIndex !== null ? "Update User" : "Create User"}
            </button>

          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="col-12 col-md-8">
        <div className="card shadow p-2 p-md-3">
          <h5 className="mb-3">Sub Users List</h5>

          {/* 🔥 IMPORTANT FIX */}
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No Users Found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-1"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  </div>
  );
};

export default AddSubUser;