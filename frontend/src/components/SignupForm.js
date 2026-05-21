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

    if (regex.test(value)) {
      setPasswordMessage("Strong password");
    } else {
      setPasswordMessage(
        "Min 12 chars, 1 uppercase, 1 lowercase, 1 special character"
      );
    }
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
    border: errors[field] ? "1px solid red" : "",
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
        *{
          box-sizing:border-box;
        }

        html, body {
          margin:0;
          padding:0;
          height:auto;
          overflow-y:auto;
        }

        .container{
          display:flex;
          min-height:100vh;
          width:100%;
          flex-wrap:wrap;
          font-family:Segoe UI;

          /* FIX SCROLL */
          overflow-y:auto;
          -webkit-overflow-scrolling: touch;
        }

        .left{
          flex:1 1 300px;
          background:linear-gradient(135deg,#0b2242,#111827);
          color:#fff;
          padding:50px;
          display:flex;
          flex-direction:column;
          justify-content:center;
        }

        .right{
          flex:1 1 500px;
          background:#f5f7fb;
          display:flex;
          justify-content:center;

          /* IMPORTANT FIX */
          align-items:flex-start;

          min-height:100vh;
          padding:20px;
        }

        .card{
          width:100%;
          max-width:520px;
          background:#fff;
          padding:30px;
          border-radius:15px;
          box-shadow:0 10px 30px rgba(0,0,0,0.08);

          /* FIX SCROLL GAP */
          margin-bottom:50px;
        }

        .grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
        }

        input, select, textarea{
          width:100%;
          padding:10px;
          box-sizing:border-box;
        }

        .upload{
          margin-top:10px;
          padding:10px;
          border:2px dashed #ccc;
          border-radius:10px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
        }

        .logo{
          width:80px;
          height:80px;
          border-radius:50%;
          border:1px solid #ddd;
          overflow:hidden;
          display:flex;
          justify-content:center;
          align-items:center;
        }

        .logo img{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        @media(max-width:768px){

          .container{
            flex-direction:column;
          }

          .left{
            padding:30px 20px;
            text-align:center;
          }

          .right{
            padding:15px;
            min-height:auto;
          }

          .card{
            padding:20px;
          }

          .grid{
            grid-template-columns:1fr;
          }

          .upload{
            flex-direction:column;
            align-items:flex-start;
          }

          .logo{
            align-self:center;
          }
        }
      `}</style>

      <div className="container">

        {/* LEFT */}
        <div className="left">
          <h1 style={{ fontSize: 42, fontWeight: "bold" }}>
            InventoryPro
          </h1>
          <p style={{ opacity: 0.85, marginTop: 10 }}>
            Smart billing & inventory system
          </p>
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
              <select name="shopType" onChange={handleChange}
               style={{
                  ...errorStyle("shopType"),
                  height: "42px",
                  padding: "0 10px",
                  lineHeight: "42px",
                }}>
                <option value="">Select Shop Type</option>
                <option value="mobile_shop">Mobile Shop</option>
                <option value="laptop_shop">Laptop Shop</option>
              </select>

              <input name="companyName" placeholder="Company Name" onChange={handleChange} style={errorStyle("companyName")} />

              <input name="gstNumber" placeholder="GST Number" onChange={handleChange} />
              <input name="panNumber" placeholder="PAN Number" onChange={handleChange} />

              <input name="state" placeholder="State" onChange={handleChange} style={errorStyle("state")} />
              <input name="district" placeholder="District" onChange={handleChange} style={errorStyle("district")} />
              <input name="pincode" placeholder="Pincode" onChange={handleChange} style={errorStyle("pincode")} />
            </div>

            <textarea
              name="companyAddress"
              placeholder="Company Address"
              onChange={handleChange}
              style={errorStyle("companyAddress")}
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
                {logoPreview ? (
                  <img src={logoPreview} alt="logo" />
                ) : (
                  "No Logo"
                )}
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