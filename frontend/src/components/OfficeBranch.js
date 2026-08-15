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

  if (!formData.branchName) {
    newErrors.branchName = "Branch name is required";
  }
  if (!formData.shopType) {
    newErrors.shopType = "Select Shop Type";
  }

  if (!formData.state) {
    newErrors.state = "State is required";
  }

  if (!formData.city) {
    newErrors.city = "City is required";
  }

  if (!formData.pincode) {
    newErrors.pincode = "Pincode is required";
  }

  if (!formData.address) {
    newErrors.address = "Address is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  const data = new FormData();

  data.append("id", formData.id || "");
  data.append("branchName", formData.branchName || "");
  data.append("ownerId", formData.ownerId || "");
  data.append("status", formData.status ?? true);

  data.append("shopType", formData.shopType || "");
  data.append("gstNumber", formData.gstNumber || "");
  data.append("panNumber", formData.panNumber || "");
  data.append("state", formData.state || "");
  data.append("city", formData.city || "");
  data.append("pincode", formData.pincode || "");
  data.append("address", formData.address || "");

  // Logo only when selected
  if (formData.logo instanceof File) {
    data.append("logo", formData.logo);
  }

  // Check FormData
  for (let pair of data.entries()) {
    console.log(pair[0], pair[1]);
  }

  API.saveOfficeBranch(dispatch, formData)
    .then((res) => {
      if (res.payload.code === "200") {
        success(res.payload.message);

        officeList();
        formReset();
        setEditIndex(null);
      } else {
        fail(res.payload.message);
      }
    })
    .catch((err) => {
      console.error(err);
      fail("Please contact to service provider.");
    });

  setErrors({});
};

  // CREATE / UPDATE USER
//   const handleSubmit = (e) => {
//     e.preventDefault();
//    if (!validate()) return; // ❌ stop if invalid
// // alert(JSON.stringify(formData));
//   //  return;
//   console.log(JSON.stringify(formData));
//     API.saveOfficeBranch(dispatch, formData)
//     .then((res) => {
//       if (res.payload.code === '200') {
//         success(res.payload.message);
//         // setFormData({
//         //   id: "",
//         //   branchName: "",
//         //   address: "",
//         //   ownerId: ownerId,
//         // });
//         officeList();
//       } else {
//         fail(res.payload.message);
//       }
//     }).catch((err) => {
//       console.error(err);
//       fail('Please contact to service provider.');
//     });

//     if (editIndex !== null) {
//       // const updatedUsers = [...users];
//       // updatedUsers[editIndex] = formData;
//       // setUsers(updatedUsers);
//       // setEditIndex(null);

//     } else {
//       // setUsers([...users, formData]);
//     }

    

//     setErrors({});
//   };

  const handleEdit = (index) => {
    const branchDetails=branchs[index];
    setFormData({
      id: branchDetails?.id || "",
      branchName: branchDetails?.branchName || "dfghj",
      ownerId: ownerId,
      status: branchDetails?.status ?? true,
      shopType: branchDetails?.shopType || "",
      gstNumber: branchDetails?.gstNumber || "",
      panNumber: branchDetails?.panNumber || "",
      state: branchDetails?.state || "",
      city: branchDetails?.city || "",
      pincode: branchDetails?.pincode || "",
      address: branchDetails?.address || "",
      logo: null
    });
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

            <section>
              <div className="mb-2">
                <label className="form-label fw-semibold mb-1">
                  Company Logo
                </label>

                <div
                  className="border rounded-3 p-2 bg-light"
                  style={{
                    borderStyle: "dashed",
                    borderColor: "#adb5bd",
                  }}
                >
                  <div className="row align-items-center">

                    {/* Upload Section */}
                    <div className="col-md-8">

                      <label
                        htmlFor="logoUpload"
                        className="w-100 text-center p-2 border rounded-3 bg-white mb-0"
                        style={{
                          cursor: "pointer",
                          borderStyle: "dashed",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">

                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
                            style={{
                              width: "30px",
                              height: "30px",
                              fontSize: "16px",
                            }}
                          >
                            ↑
                          </span>

                          <div className="text-start">
                            <div
                              className="fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              Click to upload logo
                            </div>

                            <small
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              JPG, JPEG, PNG, WEBP • Max 2 MB
                            </small>
                          </div>

                        </div>
                      </label>

                      <input
                        id="logoUpload"
                        type="file"
                        className="d-none"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (!file) return;

                          setFormData({
                            ...formData,
                            logo: file,
                          });

                          setLogoPreview(URL.createObjectURL(file));
                        }}
                      />

                    </div>

                    {/* Preview Section */}
                    <div className="col-md-4 text-center">

                      <div
                        className="mx-auto border rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          width: "55px",
                          height: "55px",
                          overflow: "hidden",
                        }}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Company Logo"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span
                            className="text-muted"
                            style={{ fontSize: "10px" }}
                          >
                            No Logo
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
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