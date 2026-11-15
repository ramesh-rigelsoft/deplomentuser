import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";

const AddSubUser = () => {
  const ownerId = parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email_id: "",
    password: "",
    ownerId: ownerId,
    mobile_no: "",
    status: 1,
    role: "",
    branchCode: ""
  });

  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [branches, setBranches] = useState([]);
  useEffect(() => {
    if (ownerId) {
      API.fetchOfficeBranch(dispatch, { userId: ownerId })
        .then((res) => {
          const list = res?.payload?.data?.branchList || res?.data?.branchList || [];
          setBranches(list);
          if (list.length > 0) {
            setFormData((prev) => ({
              ...prev,
              branchCode: prev.branchCode || list[0].branchCode,
            }));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ownerId, dispatch]);

  useEffect(() => {
   userList();
  }, [ownerId]);

  const userList = () => {
    if (ownerId) {
      API.fetchSubUser(dispatch, { userId: ownerId })
        .then((res) => {
          setUsers(res?.payload?.data?.userList || res?.data?.userList || []);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  
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

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email_id?.trim()) {
      newErrors.email_id = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = "Invalid email format";
    }
    
    if (!formData.mobile_no?.trim()) {
      newErrors.mobile_no = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Mobile number must be 10 digits";
    }

    if (editIndex === null) {
      if (!formData.password?.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      if (formData.password?.trim() && formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.branchCode) {
      newErrors.branchCode = "Please select an Office";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: "",
      email_id: "",
      mobile_no: "",
      password: "",
      status: 1,
      role: "",
      branchCode: branches.length > 0 ? branches[0].branchCode : "",
      ownerId: ownerId,
    });
    setEditIndex(null);
    setErrors({});
  };

  // CREATE / UPDATE USER
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    API.addUser(dispatch, formData)
      .then((res) => {
        const code = String(res?.payload?.code || res?.code);
        if (code === '200') {
          success(res?.payload?.message || res?.message || (editIndex !== null ? "User updated successfully" : "User created successfully"));
          resetForm();
          userList();
        } else {
          fail(res?.payload?.message || res?.message || "Operation failed");
        }
      })
      .catch((err) => {
        console.error(err);
        fail('Please contact service provider.');
      });
  };

  const handleEdit = (index) => {
    const u = users[index];
    setFormData({
      id: u.id,
      name: u.name || "",
      email_id: u.email_id || "",
      mobile_no: u.mobile_no || "",
      password: "", // User leaves blank to keep existing password
      status: u.status !== undefined ? u.status : 1,
      role: u.role || "",
      branchCode: u.branchCode || (branches.length > 0 ? branches[0].branchCode : ""),
      ownerId: u.ownerId || ownerId,
    });
    setEditIndex(index);
    setErrors({});
  };


  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 page-scroll">
      <Header
        title="User Management"
        subTitle="Manage everything in one place"
        dashboard="1"
      />

      {branches.length === 0 && (
        <div className="alert alert-warning border-0 shadow-sm d-flex justify-content-between align-items-center mb-3 rounded-3 flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <span className="me-2 fs-5">⚠</span>
            <div>
              <strong>No Branch Found:</strong> Sub-users create karne ke liye pehle Office Location me ek branch add karein.
            </div>
          </div>
          <Link to="/officeLocation" className="btn btn-warning btn-sm fw-bold px-3">
            + Add Branch
          </Link>
        </div>
      )}

      <div className="row g-3">

        {/* FORM */}
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">
                {editIndex !== null ? "Update Sub User" : "Add Sub User"}
              </h5>
              {editIndex !== null && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  Full Name <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* email_id */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  Email ID <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <input
                  type="text"
                  name="email_id"
                  className="form-control form-control-sm"
                  placeholder="Email ID"
                  value={formData.email_id}
                  onChange={handleChange}
                />
                {errors.email_id && (
                  <small className="text-danger">{errors.email_id}</small>
                )}
              </div>

              {/* mobile_no */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  Mobile Number <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <input
                  type="text"
                  name="mobile_no"
                  className="form-control form-control-sm"
                  placeholder="Mobile Number (10 digits)"
                  value={formData.mobile_no}
                  onChange={handleChange}
                />
                {errors.mobile_no && (
                  <small className="text-danger">{errors.mobile_no}</small>
                )}
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  Password {editIndex === null && <span className="text-danger fw-bold ms-1">*</span>}
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder={
                      editIndex !== null
                        ? "Leave blank to keep existing password"
                        : "Password (min 6 characters)"
                    }
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} />
                  </button>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* BRANCH */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  Select Office <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <select
                  name="branchCode"
                  className="form-select form-select-sm"
                  value={formData.branchCode}
                  onChange={handleChange}
                >
                  {branches.length === 0 ? (
                    <option value="">No Branch Found</option>
                  ) : (
                    <>
                      <option value="">Select Office</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.branchCode}>
                          {b.branchName} ({b.branchCode})
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.branchCode && (
                  <small className="text-danger">{errors.branchCode}</small>
                )}
              </div>

              {/* ROLE */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  Select Role <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <select
                  name="role"
                  className="form-select form-select-sm"
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
              </div>

              {/* STATUS */}
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">Status</label>
                <select
                  name="status"
                  className="form-select form-select-sm"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="1">Active</option>
                  <option value="0">InActive</option>
                </select>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  type="submit"
                  className={`btn w-100 btn-sm ${
                    editIndex !== null ? "btn-primary" : "btn-success"
                  }`}
                >
                  {editIndex !== null ? "Update User" : "Create User"}
                </button>
                {editIndex !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-12 col-lg-7 col-xl-8">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <h5 className="mb-3 fw-bold">Sub Users List</h5>

            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>Office Code</th>
                    <th style={{ whiteSpace: "nowrap" }}>Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Email Id</th>
                    <th style={{ whiteSpace: "nowrap" }}>Mobile</th>
                    <th style={{ whiteSpace: "nowrap" }}>Role</th>
                    <th style={{ whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ whiteSpace: "nowrap" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Users Found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.branchCode}</td>
                        <td>{user.name}</td>
                        <td>{user.email_id}</td>
                        <td>{user.mobile_no}</td>
                        <td>{user.role}</td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              user.status === 1 ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {user.status === 1 ? "Active" : "InActive"}
                          </span>
                        </td>

                        <td>
                          <span
                            className="btn btn-warning btn-sm me-1"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </span>
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