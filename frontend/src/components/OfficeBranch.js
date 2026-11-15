import React, { useEffect,useState } from "react";

import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";
import GoogleMapLocationSelector from "./MapLocationSelector";
import ConfirmModal from "./ConfirmModal";
import { useTranslation } from "../i18n";

const OfficeBranch = () => {
  const { t } = useTranslation();
  const ownerId= parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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


  // geoLocation: "",
  // latitude: "",
  // longitude: "",
  // gpsAccuracy: "",
  // locationRadius: 100,
  });

  const [branchs, setBranchs] = useState([]);
  const [editBranchId, setEditBranchId] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    officeList();
  }, [ownerId]);
  const officeList=()=>{
     if (ownerId) {
      API.fetchOfficeBranch(dispatch, { userId: ownerId })
        .then((res) => {
          setBranchs(res?.payload?.data?.branchList || res?.data?.branchList || []);
        })
        .catch((err) => {
          console.error("fetchOfficeBranch error:", err);
        });
    }
  };
  const handleGeoLocation = () => {
    setModalOpen(true);
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "pincode") {
    // Sirf numbers allow karega
    newValue = value.replace(/\D/g, "").slice(0, 6);
  }

  if (name === "address") {
    // Maximum 300 characters
    newValue = value.slice(0, 300);
  }

  setFormData({
    ...formData,
    [name]: newValue,
  });

  if (name === "pincode") {
    if (!newValue) {
      setErrors({
        ...errors,
        pincode: "Pincode is required",
      });
    } else if (!/^[1-9][0-9]{5}$/.test(newValue)) {
      setErrors({
        ...errors,
        pincode: "Please enter a valid 6-digit pincode",
      });
    } else {
      const updatedErrors = { ...errors };
      delete updatedErrors.pincode;
      setErrors(updatedErrors);
    }
  }

  if (name === "address") {
    if (!newValue.trim()) {
      setErrors({
        ...errors,
        address: "Address is required",
      });
    } else if (newValue.length > 300) {
      setErrors({
        ...errors,
        address: "Address cannot exceed 300 characters",
      });
    } else {
      const updatedErrors = { ...errors };
      delete updatedErrors.address;
      setErrors(updatedErrors);
    }
  }
};
  // const handleChange = (e) => {
    
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });

  //   // clear error on typing
  //   setErrors({
  //     ...errors,
  //     [e.target.name]: "",
  //   });
  // };

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
const handleSubmit = async (e) => {
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
  try {
  const res = await API.saveOfficeBranch(dispatch, data);
    console.log("API RESPONSE:", res);
    if (res.code === "200") {
      success(res.message);
      officeList();
      formReset();
      setEditBranchId(null);
    } else {
      fail(res.message || "Something went wrong.");
    }

  } catch (err) {
    console.error("SAVE ERROR:", err);

    fail(
      err?.message ||
      "Something went wrong."
    );
  }
  setErrors({});
};

const handleEdit = (branchId) => {
  const branchDetails = branchs.find(
    (branch) => branch.id === branchId
  );

  if (!branchDetails) {
    console.error("Branch not found:", branchId);
    return;
  }

  setFormData({
    id: branchDetails.id || "",
    branchName: branchDetails.branchName || "",
    ownerId: ownerId,
    status: branchDetails.status ?? true,
    shopType: branchDetails.shopType || "",
    gstNumber: branchDetails.gstNumber || "",
    panNumber: branchDetails.panNumber || "",
    state: branchDetails.state || "",
    city: branchDetails.city || "",
    pincode: branchDetails.pincode || "",
    address: branchDetails.address || "",
    logo: null
  });

  setEditBranchId(branchDetails.id);
  setErrors({});

  // Agar existing logo API se mil raha hai
  // setLogoPreview(branchDetails.logo || null);
};

  // const handleEdit = (index) => {
  //   const branchDetails=branchs[index];
  //   setFormData({
  //     id: branchDetails?.id || "",
  //     branchName: branchDetails?.branchName || "",
  //     ownerId: ownerId,
  //     status: branchDetails?.status ?? true,
  //     shopType: branchDetails?.shopType || "",
  //     gstNumber: branchDetails?.gstNumber || "",
  //     panNumber: branchDetails?.panNumber || "",
  //     state: branchDetails?.state || "",
  //     city: branchDetails?.city || "",
  //     pincode: branchDetails?.pincode || "",
  //     address: branchDetails?.address || "",
  //     logo: null
  //   });
  //   setEditBranchId(index);
  //   setErrors({});
  // };

  const updateLocation = async (selectedLocation) => {
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
  
      data.append("ofcLat", selectedLocation.latitude || "");
      data.append("ofcLng", selectedLocation.longitude || "");
      data.append("centerRedious", selectedLocation.selectedRadius || "");
  
      // Logo only when selected
      if (formData.logo instanceof File) {
        data.append("logo", formData.logo);
      }
  
      // Check FormData
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
      try {
      const res = await API.saveOfficeBranch(dispatch, data);
        console.log("API RESPONSE:", res);
        if (res.code === "200") {
          success(res.message);
        } else {
          fail(res.message || "Something went wrong.");
        }
  
      } catch (err) {
        console.error("SAVE ERROR:", err);
      }
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
    <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 page-scroll">
    <Header
        title="Office Management"
        subTitle="Manage everything in one place"
        dashboard="1"
      />
      <div className="row g-3">

        {/* FORM */}
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <h5 className="text-center fw-bold mb-3">
              {editBranchId !== null ? t("Update Office", "Update Office") : t("Add Office", "Add Office")}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  {t("branch_name", "Branch Name")} <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <input
                  type="text"
                  name="branchName"
                  maxLength={200}
                  className="form-control form-control-sm"
                  placeholder={t("branch_name", "Branch Name")}
                  value={formData.branchName}
                  onChange={handleChange}
                />
                {errors.branchName && (
                  <small className="text-danger">{errors.branchName}</small>
                )}
              </div>
              <hr />
              <h6 className="mt-3 mb-2">{t("Company Information", "Company Information")}</h6>

              <div className="row g-2">
                <div className="col-12 col-sm-6 mb-2">
                  <label className="form-label small fw-bold mb-1">
                    {t("Shop Type", "Shop Type")} <span className="text-danger fw-bold ms-1">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    name="shopType"
                    value={formData.shopType}
                    onChange={handleChange}
                  >
                    <option value="">{t("Select Shop Type", "Select Shop Type")}</option>
                    <option value="1">Mobile Shop</option>
                    <option value="2">Laptop Shop</option>
                    <option value="3">Electronics & Home Appliances Shop</option>
                  </select>
                  {errors.shopType && (
                    <small className="text-danger">{errors.shopType}</small>
                  )}
                </div>
                <div className="col-12 col-sm-6 mb-2">
                  <label className="form-label small fw-bold mb-1">{t("status", "Status")}</label>
                  <select
                    name="status"
                    className="form-select form-select-sm"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">{t("active", "Active")}</option>
                    <option value="false">{t("inactive", "Inactive")}</option>
                  </select>
                </div>

              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">GST Number</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="gstNumber"
                  placeholder="GST Number (Optional)"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />
              </div>

            {!editBranchId ? (
              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">PAN Number</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="panNumber"
                  placeholder="PAN Number (Optional)"
                  value={formData.panNumber}
                  onChange={handleChange}
                />
              </div>
            ):(
              <div className="row g-2 mb-2">
                {/* PAN Number */}
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">PAN Number</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="panNumber"
                    placeholder="PAN Number (Optional)"
                    value={formData.panNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Geo Location */}
                <div className="col-6">
                  <label className="form-label small fw-bold mb-1">Location</label>
                  <span
                    className="btn btn-outline-primary btn-sm w-100"
                    onClick={handleGeoLocation}
                  >
                    📍 Geo Location
                  </span>
                </div>
              </div>
            )}

              <div className="row g-2">
                <div className="col-12 col-sm-4 mb-2">
                  <label className="form-label small fw-bold mb-1">
                    {t("state", "State")} <span className="text-danger fw-bold ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="state"
                    placeholder={t("state", "State")}
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {errors.state && (
                    <small className="text-danger">{errors.state}</small>
                  )}
                </div>

                <div className="col-12 col-sm-4 mb-2">
                  <label className="form-label small fw-bold mb-1">
                    {t("city", "City")} <span className="text-danger fw-bold ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="city"
                    placeholder={t("city", "City")}
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && (
                    <small className="text-danger">{errors.city}</small>
                  )}
                </div>

                <div className="col-12 col-sm-4 mb-2">
                  <label className="form-label small fw-bold mb-1">
                    {t("pincode", "Pincode")} <span className="text-danger fw-bold ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="pincode"
                    placeholder={t("pincode", "Pincode")}
                    maxLength={6}
                    inputMode="numeric"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                  {errors.pincode && (
                    <small className="text-danger">{errors.pincode}</small>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold mb-1">
                  {t("address", "Company Address")} <span className="text-danger fw-bold ms-1">*</span>
                </label>
                <textarea
                  className="form-control form-control-sm"
                  rows="3"
                  name="address"
                  placeholder={t("address", "Company Address")}
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && (
                  <small className="text-danger">{errors.address}</small>
                )}
              </div>

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
                  <div className="row align-items-center g-2">

                    {/* Upload Section */}
                    <div className="col-12 col-sm-8">

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
                    <div className="col-12 col-sm-4 text-center">

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
                  editBranchId !== null ? "btn-primary" : "btn-success"
                }`}
              >
                {editBranchId !== null ? "Update Branch" : "Create Branch"}
              </button>

            </form>
          </div>
        </div>

        {/* TABLE */}
        <div className="col-12 col-lg-7 col-xl-8">
          <div className="card shadow-sm border-0 p-3 p-md-4">
            <h5 className="mb-3 fw-bold">Office List</h5>

            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ whiteSpace: "nowrap" }}>Branch Code</th>
                    <th style={{ whiteSpace: "nowrap" }}>Branch Name</th>
                    <th>Address</th>
                    <th style={{ whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ whiteSpace: "nowrap" }}>Action</th>
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
                      <tr key={branch.id}>
                        <td>{branch.branchCode}</td>
                        <td>{branch.branchName}</td>
                        <td>{branch.address}</td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              branch.status ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {branch.status ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(branch.id)}
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

      <ConfirmModal
        open={modalOpen}
        title="Office Geo Location"
        message="Map par apni office location select karein."
        confirmText="Save Location"
        cancelText="Cancel"
        type="info"

        onCancel={() => {
          setModalOpen(false);
          setSelectedLocation(null);
        }}

        onConfirm={() => {
          if (!selectedLocation) {
            fail("Please select office location.");
            return;
          }

          updateLocation(selectedLocation);
          setModalOpen(false);
        }}
      >
        <GoogleMapLocationSelector
          formData={formData}
          onLocationChange={setSelectedLocation}
        />
      </ConfirmModal>


    </div>
  );
};

export default OfficeBranch;