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
      if (key === "gstNumber" || key === "panNumber" || key === "logo") return;
      if (!formData[key]) temp[key] = true;
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
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
      <style>{`
        * { box-sizing: border-box; }

        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          font-family: Segoe UI;
        }

        /* LEFT PANEL */
        .left {
          flex: 1;
          background: linear-gradient(135deg,#0b2242,#111827);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 50px;
        }

        /* RIGHT PANEL */
        .right {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #f5f7fb;
          padding: 20px;
        }

        /* CARD */
        .card {
          width: 100%;
          max-width: 520px;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
        }

        textarea {
          resize: none;
        }

        /* UPLOAD */
        .upload {
          margin-top: 10px;
          padding: 10px;
          border: 2px dashed #ccc;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #ddd;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ================= MOBILE ================= */
        @media (max-width: 768px) {

          .container {
            flex-direction: column;
          }

          .left {
            padding: 25px;
            text-align: center;
          }

          .right {
            padding: 15px;
          }

          .card {
            padding: 18px;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .upload {
            flex-direction: column;
            align-items: flex-start;
          }

          .logo {
            align-self: center;
          }
        }

        /* ================= TABLET ================= */
        @media (min-width: 769px) and (max-width: 1024px) {

          .left {
            padding: 35px;
          }

          .card {
            max-width: 450px;
          }

          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="container">

        {/* LEFT */}
        <div className="left">
          <h1 style={{ fontSize: 42, fontWeight: "bold" }}>
            InventoryPro
          </h1>
          <p>Smart billing & inventory system</p>
        </div>

        {/* RIGHT */}
        <div className="right">

          <form className="card" onSubmit={handleSubmit}>

            <h2 style={{ textAlign: "center" }}>
              Create Account
            </h2>

            <div className="grid">
              <input name="name" placeholder="Name" onChange={handleChange} style={errorStyle("name")} />
              <input name="mobile_no" placeholder="Mobile" onChange={handleChange} style={errorStyle("mobile_no")} />
              <input name="email_id" placeholder="Email" onChange={handleChange} style={errorStyle("email_id")} />
              <input type="password" placeholder="Password" onChange={handlePassword} style={errorStyle("password")} />
            </div>

            <p style={{ color: "green", fontSize: 12 }}>
              {passwordMessage}
            </p>

            <h4>Company Info</h4>

            <div className="grid">

              <select name="shopType" onChange={handleChange}>
                <option value="">Select Shop Type</option>
                <option value="mobile_shop">Mobile Shop</option>
                <option value="laptop_shop">Laptop Shop</option>
              </select>

              <input name="companyName" placeholder="Company Name" onChange={handleChange} />

              <input name="gstNumber" placeholder="GST Number" onChange={handleChange} />
              <input name="panNumber" placeholder="PAN Number" onChange={handleChange} />

              <input name="state" placeholder="State" onChange={handleChange} />
              <input name="district" placeholder="District" onChange={handleChange} />
              <input name="pincode" placeholder="Pincode" onChange={handleChange} />

            </div>

            <textarea
              name="companyAddress"
              placeholder="Company Address"
              onChange={handleChange}
            />

            <div className="upload">

              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, logo: file });
                  if (file) setLogoPreview(URL.createObjectURL(file));
                }}
              />

              <div className="logo">
                {logoPreview ? <img src={logoPreview} /> : "No Logo"}
              </div>

            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              disabled={loading}
            >
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