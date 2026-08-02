import React, { useEffect,useState } from "react";

import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";

const OfficeBranch = () => {
  const ownerId= parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    branchName: "",
    ownerId: ownerId,

     // Company Information
    shopType: "",
    gstNumber: "",
    panNumber: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    logo: null,
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
  if (!formData.shopType) {
    newErrors.shopType = "Select Shop Type";
  }

  if (!formData.state.trim()) {
    newErrors.state = "State is required";
  }

  if (!formData.city.trim()) {
    newErrors.city = "City is required";
  }

  if (!formData.pincode.trim()) {
    newErrors.pincode = "Pincode is required";
  }

  if (!formData.address.trim()) {
    newErrors.address = "Address is required";
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
        // setFormData({
        //   id: "",
        //   branchName: "",
        //   address: "",
        //   ownerId: ownerId,
        // });
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

  const formReset=()=>{
    setFormData({
      id: "",
      branchName: "",
      ownerId: ownerId,
      status: true,

      shopType: "",
      gstNumber: "",
      panNumber: "",
      state: "",
      city: "",
      pincode: "",
      address: "",
      logo: null,
    });

    setLogoPreview(null);
  };

  return (
    <div  className="container py-3"
      style={{
        minHeight: "100vh",
        overflowY: "auto"
      }}>
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
              <hr />
              <h6 className="mt-3 mb-2">Company Information</h6>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <select
                    className="form-select form-select-sm"
                    name="shopType"
                    value={formData.shopType}
                    onChange={handleChange}
                  >
                    <option value="">Select Shop Type</option>
                    <option value="mobile_shop">Mobile Shop</option>
                    <option value="laptop_shop">Laptop Shop</option>
                  </select>
                  {errors.shopType && (
                    <small className="text-danger">{errors.shopType}</small>
                  )}
                </div>
                <div className="col-md-6 mb-2">
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
                </div>

              </div>

              <input
                type="text"
                className="form-control form-control-sm mb-2"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
              />

              <input
                type="text"
                className="form-control form-control-sm mb-2"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
              />

              <div className="row">
                <div className="col-md-4 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {errors.state && (
                    <small className="text-danger">{errors.state}</small>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && (
                    <small className="text-danger">{errors.city}</small>
                  )}
                </div>

                <div className="col-md-4 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                  {errors.pincode && (
                    <small className="text-danger">{errors.pincode}</small>
                  )}
                </div>
              </div>

              <textarea
                className="form-control form-control-sm mb-2"
                rows="3"
                name="address"
                placeholder="Company Address"
                value={formData.address}
                onChange={handleChange}
              />

              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}

             <div className="d-flex align-items-center justify-content-between border rounded p-2 bg-light mb-2">

            <div className="flex-grow-1 me-3">
              <label className="form-label small mb-1 text-muted">
                Upload Company Logo
              </label>

              <input
                type="file"
                className="form-control form-control-sm"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  setFormData({
                    ...formData,
                    logo: file,
                  });

                  if (file) {
                    setLogoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>


          <div className="text-center">
            <div
              className="border rounded-circle shadow-sm bg-white d-flex align-items-center justify-content-center"
              style={{
                width: "65px",
                height: "65px",
                overflow: "hidden",
              }}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span className="text-muted small">
                  Logo
                </span>
              )}
            </div>

            <small className="text-muted">
              Preview
            </small>
          </div>

        </div>

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