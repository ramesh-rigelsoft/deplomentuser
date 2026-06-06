import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import NetworkStatus from "./NetworkStatus";

export default function Signup() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id:0,
    name: "",
    email_id: "",
    mobile_no: "",
    password: "",
    shopType: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    state: "",
    city: "",
    pincode: "",
    addressLine1: "",
    logo: null,
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

  const handlePassword = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/;

    setPasswordMessage(
      regex.test(value)
        ? "Strong password"
        : "Min 12 chars, 1 uppercase, 1 lowercase, 1 special character"
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: value ? false : true,
    }));
  };

  const errorStyle = (field) => ({
    border: errors[field] ? "1px solid red" : "1px solid #ddd",
  });

  const validate = () => {
    let temp = {};

    Object.keys(formData).forEach((key) => {
      if (key === "gstNumber" || key === "panNumber" || key === "logo"||key=="id") return;
      if (!formData[key]) temp[key] = true;
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //  alert("----------------"+JSON.stringify(formData));
   
    if (!validate()) return;

    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    //  alert(JSON.stringify(data));
    try {
      const res = await API.signupAccount(dispatch, data);

      if (res.payload.code === "200") {
        success(res.payload.message);
      } else {
        fail(res.payload.message);
      }
    } catch (err) {
      fail("Server Down");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <form className="card shadow p-4" autoComplete="off" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">
              Create Account
            </h2>

            {/* User Info */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  style={errorStyle("name")}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="mobile_no"
                  placeholder="Mobile Number"
                  onChange={handleChange}
                  style={errorStyle("mobile_no")}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  name="email_id"
                  placeholder="Email"
                  onChange={handleChange}
                  style={errorStyle("email_id")}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={handlePassword}
                  style={errorStyle("password")}
                />
              </div>
            </div>

            <small
              className={`mb-3 d-block ${
                passwordMessage === "Strong password"
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {passwordMessage}
            </small>

            <h4 className="mb-3">Company Information</h4>

            <div className="row g-3">

              <div className="col-md-6">
                <select
                  className="form-select"
                  name="shopType"
                  onChange={handleChange}
                >
                  <option value="">Select Shop Type</option>
                  <option value="mobile_shop">Mobile Shop</option>
                  <option value="laptop_shop">Laptop Shop</option>
                </select>
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="companyName"
                  placeholder="Company Name"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="gstNumber"
                  placeholder="GST Number"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="panNumber"
                  placeholder="PAN Number"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  placeholder="city"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  placeholder="Pincode"
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <textarea
                  className="form-control"
                  rows="3"
                  name="addressLine1"
                  placeholder="Company Address"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, logo: file });

                    if (file) {
                      setLogoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>

              <div className="col-md-6 text-center">
                <div className="border rounded p-2">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="img-fluid"
                      style={{ maxHeight: "120px" }}
                    />
                  ) : (
                    <span className="text-muted">
                      No Logo Selected
                    </span>
                  )}
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-4"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </form>

        </div>
      </div>
    </div>

    <NetworkStatus />
  </>
);
}