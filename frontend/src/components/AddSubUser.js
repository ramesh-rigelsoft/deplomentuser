import React, { useEffect,useState } from "react";

import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";

const AddSubUser = () => {
  const ownerId= parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id:0,
    name: "",
    email_id: "",
    password: "",
    ownerId: ownerId,
    mobile_no: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ownerId) {
      API.fetchSubUser(dispatch, { userId: ownerId })
        .then((res) => {
          console.log(res);
          // setState yahan karo
          setUsers(res.payload.data.userList);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ownerId, dispatch]);
  
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

    if (!formData.email_id.trim()) {
      newErrors.email_id = "email_id is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = "Invalid email_id format";
    }
    
    if (!formData.mobile_no?.trim()) {
      newErrors.mobile_no = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Mobile number must be 10 digits";
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
alert(JSON.stringify(formData));
// return;
    if (!validate()) return; // ❌ stop if invalid

    API.addUser(dispatch, formData)
    .then((res) => {
      if (res.payload.code === '200') {
        success(res.payload.message);
        setFormData({
          name: "",
          email_id: "",
          mobile_no:"",
          password: "",
          status:1,
          role: "",
        });
      } else {
        fail(res.payload.message);
      }
    }).catch((err) => {
      console.error(err);
      fail('Please contact to service provider.');
    });

    if (editIndex !== null) {
      // const updatedUsers = [...users];
      // updatedUsers[editIndex] = formData;
      // setUsers(updatedUsers);
      // setEditIndex(null);

    } else {
      // setUsers([...users, formData]);
    }

    

    setErrors({});
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
    setErrors({});
  };


  return (
    <div className="container py-3">
      <Header
        title="User Mangement"
        subTitle="Manage everything in one place"
      />
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

              {/* email_id */}
              <input
                type="text"
                name="email_id"
                className="form-control form-control-sm mb-1 mt-2"
                placeholder="email_id"
                value={formData.email_id}
                onChange={handleChange}
              />
              {errors.email_id && (
                <small className="text-danger">{errors.email_id}</small>
              )}

               {/* email_id */}
              <input
                type="text"
                name="mobile_no"
                className="form-control form-control-sm mb-1 mt-2"
                placeholder="Mobile Number"
                value={formData.mobile_no}
                onChange={handleChange}
              />
               {errors.mobile_no && (
                <small className="text-danger">{errors.mobile_no}</small>
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

               {/* ROLE */}
              <select
                name="role"
                className="form-select form-select-sm mb-1 mt-2"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="1">Active</option>
                <option value="0">InActive</option>
              </select>

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
                    <th>Email Id</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Status</th>
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
                        <td>{user.email_id}</td>
                        <td>{user.mobile_no}</td>
                        <td>{user.role}</td>
                        <td>{user.status===1?'Active':'InActive'}</td>
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