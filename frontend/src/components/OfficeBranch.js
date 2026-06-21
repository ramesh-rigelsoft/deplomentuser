import React, { useEffect,useState } from "react";

import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";

const OfficeBranch = () => {
  const ownerId= parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    branchName: "",
    address: "",
    ownerId: ownerId,
  });

  const [branchs, setBranchs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    officeList();
  }, [ownerId]);
  const officeList=()=>{
     if (ownerId) {
      API.fetchOfficeBranch(dispatch, { userId: ownerId })
        .then((res) => {
          setBranchs(res.payload.data.branchList||[]);
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

  if (!formData.branchName.trim()) {
    newErrors.branchName = "Branch name is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // CREATE / UPDATE USER
  const handleSubmit = (e) => {
    e.preventDefault();
   if (!validate()) return; // ❌ stop if invalid
// alert(JSON.stringify(formData));
  //  return;
    API.saveOfficeBranch(dispatch, formData)
    .then((res) => {
      if (res.payload.code === '200') {
        success(res.payload.message);
        setFormData({
          id: "",
          branchName: "",
          address: "",
          ownerId: ownerId,
        });
        officeList();
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
    setFormData(branchs[index]);
    setEditIndex(index);
    setErrors({});
  };


  return (
    <div className="container py-3">
      <Header
        title="Office Mangement"
        subTitle="Manage everything in one place"
      />
      <div className="row g-3">

        {/* FORM */}
        <div className="col-12 col-md-4">
          <div className="card shadow p-2 p-md-3">
            <h5 className="text-center mb-3">
              {editIndex !== null ? "Update Office" : "Add Office"}
            </h5>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="branchName"
                className="form-control form-control-sm mb-2"
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={handleChange}
              />
              {errors.branchName && (
                <small className="text-danger">{errors.branchName}</small>
              )}

              <textarea
                name="address"
                className="form-control form-control-sm mb-2"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
              />

              <select
                name="status"
                className="form-select form-select-sm mb-2"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <button
                className={`btn w-100 btn-sm ${
                  editIndex !== null ? "btn-primary" : "btn-success"
                }`}
              >
                {editIndex !== null ? "Update Branch" : "Create Branch"}
              </button>

            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-12 col-md-8">
          <div className="card shadow p-2 p-md-3">
            <h5 className="mb-3">Office List</h5>

            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Branch Code</th>
                    <th>Branch Name</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {branchs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No Branch Found
                      </td>
                    </tr>
                  ) : (
                    branchs.map((branch, index) => (
                      <tr key={index}>
                        <td>{branch.branchCode}</td>
                        <td>{branch.branchName}</td>
                        <td>{branch.address}</td>
                        <td>{branch.status ? "Active" : "Inactive"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
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

export default OfficeBranch;