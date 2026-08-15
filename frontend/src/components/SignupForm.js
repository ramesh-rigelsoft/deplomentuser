import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";


export default function Signup() {
   const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    mobile_no: "",
    email_id: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isHuman, setIsHuman] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

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
      newErrors.mobile_no = "Enter a valid 10 digit mobile number";
    }

    // Email
    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)
    ) {
      newErrors.email_id = "Enter a valid email address";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be 12+ characters with uppercase, lowercase and special character";
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    // Human verification
    if (!isHuman) {
      newErrors.human = "Please confirm that you are human";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      try {
        const res = await API.signupAccount(dispatch, data);

        console.log("Signup Response:", res);

        // Success
        if (res?.code === 200 || res?.code === "200") {
          success(res?.message || "Your account has been created successfully.");
        } 
        // Backend error response
        else {
          fail(res?.message || "Signup failed.");
        }

      } catch (err) {
        console.log("Signup Error:", err);

        // Backend se exact message
        const message =
          err?.message ||
          err?.response?.data?.message ||
          err?.data?.message ||
          "Server Down";

        fail(message);

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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">

          <form
            className="card shadow p-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="text-center mb-4">
              Create Account
            </h2>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
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
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label className="form-label">
                Mobile Number
              </label>

              <input
                type="text"
                className="form-control"
                name="mobile_no"
                placeholder="Enter 10 digit mobile number"
                value={formData.mobile_no}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value) && value.length <= 10) {
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
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                name="email_id"
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
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle("password")}
              />

              {errors.password ? (
                <small className="text-danger">
                  {errors.password}
                </small>
              ) : formData.password ? (
                <small className="text-success">
                  Strong password
                </small>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={inputStyle("confirmPassword")}
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

            {/* Human Verification */}
            <div className="mb-3">
              <div
                className={`border rounded p-3 d-flex align-items-center ${
                  errors.human ? "border-danger" : ""
                }`}
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input me-3"
                  id="humanCheck"
                  checked={isHuman}
                  onChange={(e) => {
                    setIsHuman(e.target.checked);

                    setErrors((prev) => ({
                      ...prev,
                      human: "",
                    }));
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />

                <label
                  htmlFor="humanCheck"
                  className="mb-0"
                  style={{ cursor: "pointer" }}
                >
                  I'm not a robot
                </label>

                <span
                  className="ms-auto text-muted"
                  style={{ fontSize: "12px" }}
                >
                  ✓ Human Verification
                </span>
              </div>

              {errors.human && (
                <small className="text-danger">
                  {errors.human}
                </small>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
            >
              Create Account
            </button>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
}