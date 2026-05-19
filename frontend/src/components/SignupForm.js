import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import NetworkStatus from "./NetworkStatus";

export default function Signup() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    mobile_no: "",
    password: "",
    shopType: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    state: "",
    district: "",
    pincode: "",
    companyAddress: "",
    logo: null,
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);


  const handlePassword = (e) => {
    const value = e.target.value;

    setFormData({ ...formData, password: value });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/;

    if (passwordRegex.test(value)) {
      setPasswordMessage("Strong password");
    } else {
      setPasswordMessage("Min 12 chars, 1 uppercase, 1 lowercase, 1 special character");
    }
  };

  const errorStyle = (field) => ({
    border: errors[field] ? "1px solid red" : "",
  });

  const validate = () => {
    let temp = {};

    if (!formData.name) temp.name = true;
    if (!formData.email_id) temp.email_id = true;
    if (!formData.mobile_no) temp.mobile_no = true;
    if (!formData.password) temp.password = true;
    if (!formData.shopType) temp.shopType = true;
    if (!formData.companyName) temp.companyName = true;
    if (!formData.state) temp.state = true;
    if (!formData.district) temp.district = true;
    if (!formData.pincode) temp.pincode = true;
    if (!formData.companyAddress) temp.companyAddress = true;

    Object.keys(formData).forEach((key) => {
    if (!formData[key]) {
      temp[key] = true;
    }
  });

  setErrors(temp);
  return Object.keys(temp).length === 0;
  };


  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({ ...formData, [name]: value });

  // ✅ REMOVE ERROR WHEN USER TYPES
  setErrors((prev) => ({
    ...prev,
    [name]: value ? false : true,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

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
      <div style={styles.container}>

        {/* LEFT */}
        <div style={styles.left}>
          <h1 style={{ fontSize: 42, fontWeight: "bold" }}>InventoryPro</h1>
          <p style={{ opacity: 0.85, marginTop: 10 }}>
            Smart billing & inventory system
          </p>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <form onSubmit={handleSubmit} style={styles.card}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
              Create Account
            </h2>

            {/* BASIC */}
            <div style={styles.grid}>
              <input className="form-control" name="name" placeholder="Name" onChange={handleChange} style={errorStyle("name")} />
              <input className="form-control" name="mobile_no" placeholder="Mobile" onChange={handleChange} style={errorStyle("mobile_no")} />
              <input className="form-control" name="email_id" placeholder="Email" onChange={handleChange} style={errorStyle("email_id")} />
              <input className="form-control" name="password" type="password" placeholder="Password" onChange={handlePassword} style={errorStyle("password")} />
            </div>

            <p style={{ color: "green", fontSize: 12 }}>{passwordMessage}</p>

            {/* COMPANY */}
            <h5 style={{ marginTop: 15 }}>Company Info</h5>

            <div style={styles.grid}>
              <select
                name="shopType"
                className="form-control"
                onChange={handleChange}
                style={errorStyle("shopType")}
              >
                <option value="">Select Shop Type</option>
                <option value="mobile_shop">Mobile Shop</option>
                <option value="laptop_shop">Laptop Shop</option>
                <option value="electronic_shop">Electronic Shop</option>
              </select>

              <input className="form-control" name="companyName" placeholder="Company Name" onChange={handleChange} style={errorStyle("companyName")} />

              {/* ✅ GST + PAN */}
              <input className="form-control" name="gstNumber" placeholder="GST Number" onChange={handleChange} />
              <input className="form-control" name="panNumber" placeholder="PAN Number" onChange={handleChange} />

              <input className="form-control" name="state" placeholder="State" onChange={handleChange} style={errorStyle("state")} />
              <input className="form-control" name="district" placeholder="District" onChange={handleChange} style={errorStyle("district")} />
              <input className="form-control" name="pincode" placeholder="Pincode" onChange={handleChange} style={errorStyle("pincode")} />
            </div>

            <textarea
              className="form-control mt-2"
              name="companyAddress"
              placeholder="Company Address"
              onChange={handleChange}
              style={errorStyle("companyAddress")}
            />

            {/* LOGO */}
            <div style={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, logo: file });

                  if (file) {
                    setLogoPreview(URL.createObjectURL(file));
                  }
                }}
              />

              <div style={styles.logoPreview}>
                {logoPreview ? (
                  <img src={logoPreview} alt="logo" style={styles.img} />
                ) : (
                  <span style={{ fontSize: 12 }}>No Logo</span>
                )}
              </div>
            </div>

            <button className="btn btn-primary w-100 mt-3" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p style={{ textAlign: "center", marginTop: 10 }}>
              Already have account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>

      <NetworkStatus />
    </>
  );
}

/* ===== STYLES ===== */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    flexWrap: "wrap",
    fontFamily: "Segoe UI",
  },
  left: {
    flex: "1",
    background: "linear-gradient(135deg,#0b2242,#111827)",
    color: "#fff",
    padding: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  right: {
    flex: "1",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    padding: 30,
    borderRadius: 15,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  uploadBox: {
    marginTop: 5,
    padding: 5,
    border: "2px dashed #ccc",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoPreview: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "1px solid #ddd",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};