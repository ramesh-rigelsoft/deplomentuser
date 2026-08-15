import React, { useEffect, useState } from "react";
import Header from "./Header";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

export default function ViewProfile() {
  const ownerId = parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    mobile_no: "",
    email_id: "",
    password: "",
    confirmPassword: "",
    ownerId: ownerId
  });

  // =========================
  // GET PROFILE
  // =========================
  const getProfile = () => {
    if (!ownerId) return;

    API.viewAccount(dispatch, { userId: ownerId })
      .then((res) => {
        const data = res?.payload?.data?.user;

        if (!data) return;

        setFormData({
          id: data.id ,
          name: data.name,
          mobile_no: data.mobile_no,
          email_id: data.email_id,
          password: "",
          confirmPassword: "",
          ownerId:ownerId
        });
      })
      .catch((err) => {
        console.error(err);
        fail("Unable to load profile");
      });
  };

  useEffect(() => {
    getProfile();
  }, [ownerId]);

  // =========================
  // CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Mobile
    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile_no)) {
      newErrors.mobile_no =
        "Enter a valid 10 digit mobile number";
    }

    // Email
    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)
    ) {
      newErrors.email_id = "Enter a valid email address";
    }

    // Password optional
    if (formData.password) {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Password must be 12+ characters with uppercase, lowercase and special character";
      }
    }

    // Confirm Password
    if (formData.password || formData.confirmPassword) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword =
          "Please confirm your password";
      } else if (
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword =
          "Passwords do not match";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = () => {
    setErrors({});
    setEditMode(true);
  };

  // =========================
  // CANCEL
  // =========================
  const handleCancel = () => {
    setErrors({});
    setEditMode(false);

    // Original data reload
    getProfile();
  };

  // =========================
  // UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const updateData = {
        id: formData.id,
        name: formData.name,
        mobile_no: formData.mobile_no,
        email_id: formData.email_id,
        password: formData.password,
        ownerId: formData.ownerId
      };

      const res = await API.signupAccount(
        dispatch,
        updateData
      );

      if (res?.payload?.code === "200") {
        success(
          res?.payload?.message ||
            "Account updated successfully"
        );

        setEditMode(false);

        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));

        getProfile();
      } else {
        fail(
          res?.payload?.message ||
            "Failed to update account"
        );
      }
    } catch (error) {
      console.error(error);
      fail("Server Down");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    border: errors[field]
      ? "1px solid #dc3545"
      : "1px solid #ced4da",
  });

  return (
    <div className="min-vh-100 bg-light p-4">

      <Header
        title="User Management"
        subTitle="Manage everything in one place"
      />

      <div className="row justify-content-center">
        <div className="col-12 col-md-12 col-lg-12">

          <div className="card shadow border-0">

            {/* HEADER */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                My Profile
              </h5>

              {!editMode && (
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={handleEdit}
                >
                  ✏ Edit Profile
                </button>
              )}

            </div>

            {/* BODY */}
            <div className="card-body">

              {/* NAME HEADER */}
              {!editMode && (
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "28px",
                    }}
                  >
                    {formData.name
                      ? formData.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </div>

                  <h5 className="mt-2 mb-0">
                    {formData.name || "NA"}
                  </h5>

                  <small className="text-muted">
                    {formData.email_id || "NA"}
                  </small>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* NAME */}
                <div className="mb-3">

                  <label className="form-label">
                    Name
                  </label>

                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle("name")}
                      />

                      {errors.name && (
                        <small className="text-danger">
                          {errors.name}
                        </small>
                      )}
                    </>
                  ) : (
                    <div className="form-control bg-light">
                      {formData.name || "NA"}
                    </div>
                  )}

                </div>

                {/* MOBILE */}
                <div className="mb-3">

                  <label className="form-label">
                    Mobile Number
                  </label>

                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="mobile_no"
                        className="form-control"
                        placeholder="Enter 10 digit mobile number"
                        value={formData.mobile_no}
                        maxLength={10}
                        onChange={(e) => {
                          const value =
                            e.target.value;

                          if (/^\d*$/.test(value)) {
                            handleChange(e);
                          }
                        }}
                        style={inputStyle("mobile_no")}
                      />

                      {errors.mobile_no && (
                        <small className="text-danger">
                          {errors.mobile_no}
                        </small>
                      )}
                    </>
                  ) : (
                    <div className="form-control bg-light">
                      {formData.mobile_no || "NA"}
                    </div>
                  )}

                </div>

                {/* EMAIL */}
                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  {editMode ? (
                    <>
                      <input
                        type="email"
                        name="email_id"
                        className="form-control"
                        placeholder="Enter email"
                        value={formData.email_id}
                        onChange={handleChange}
                        style={inputStyle("email_id")}
                      />

                      {errors.email_id && (
                        <small className="text-danger">
                          {errors.email_id}
                        </small>
                      )}
                    </>
                  ) : (
                    <div className="form-control bg-light">
                      {formData.email_id || "NA"}
                    </div>
                  )}

                </div>

                {/* PASSWORD ONLY IN EDIT */}
                {editMode && (
                  <>
                    <hr />

                    <h6 className="mb-3">
                      Change Password
                      <small className="text-muted ms-2">
                        (Optional)
                      </small>
                    </h6>

                    {/* PASSWORD */}
                    <div className="mb-3">

                      <label className="form-label">
                        New Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={handleChange}
                        style={inputStyle("password")}
                      />

                      {errors.password ? (
                        <small className="text-danger">
                          {errors.password}
                        </small>
                      ) : (
                        <small className="text-muted">
                          Leave blank if you don't want
                          to change password
                        </small>
                      )}

                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-3">

                      <label className="form-label">
                        Confirm New Password
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm new password"
                        value={
                          formData.confirmPassword
                        }
                        onChange={handleChange}
                        style={inputStyle(
                          "confirmPassword"
                        )}
                      />

                      {errors.confirmPassword && (
                        <small className="text-danger">
                          {errors.confirmPassword}
                        </small>
                      )}

                      {!errors.confirmPassword &&
                        formData.confirmPassword &&
                        formData.password ===
                          formData.confirmPassword && (
                          <small className="text-success">
                            Passwords match ✓
                          </small>
                        )}

                    </div>

                    {/* BUTTONS */}
                    <div className="d-flex gap-2 mt-4">

                      <button
                        type="button"
                        className="btn btn-secondary w-50"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary w-50"
                        disabled={loading}
                      >
                        {loading
                          ? "Updating..."
                          : "Save Changes"}
                      </button>

                    </div>
                  </>
                )}

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}