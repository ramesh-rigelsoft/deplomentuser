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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear error on typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // CREATE / UPDATE USER
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return; // ❌ stop if invalid

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

    setErrors({});
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
    setErrors({});
  };

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

              {/* NAME */}
              <input
                type="text"
                name="name"
                className="form-control form-control-sm mb-1"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}

              {/* EMAIL */}
              <input
                type="text"
                name="email"
                className="form-control form-control-sm mb-1 mt-2"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}

              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                className="form-control form-control-sm mb-1 mt-2"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}

              {/* ROLE */}
              <select
                name="role"
                className="form-select form-select-sm mb-1 mt-2"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
              {errors.role && (
                <small className="text-danger">{errors.role}</small>
              )}

              <button
                className={`btn w-100 btn-sm mt-3 ${
                  editIndex !== null ? "btn-primary" : "btn-success"
                }`}
              >
                {editIndex !== null ? "Update User" : "Create User"}
              </button>
            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-12 col-md-8">
          <div className="card shadow p-2 p-md-3">
            <h5 className="mb-3">Sub Users List</h5>

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