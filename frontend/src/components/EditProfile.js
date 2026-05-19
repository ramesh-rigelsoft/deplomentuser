// EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";

export default function EditProfile() {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    mobile_no: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    district: "",
    state: "",
    pincode: "",
    companyAddress: "",
    files: null
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 GET USER DATA (API se load)
  useEffect(() => {
    API.getProfile(dispatch)
      .then(res => {
        const data = res.payload.data;

        setFormData({
          name: data.name || "",
          email_id: data.email_id || "",
          mobile_no: data.mobile_no || "",
          companyName: data.companyName || "",
          gstNumber: data.gstNumber || "",
          panNumber: data.panNumber || "",
          district: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          companyAddress: data.addressLine1 || "",
          files: null
        });

        // Existing logo
        if (data.companyLogo) {
          setLogoPreview(data.companyLogo);
        }
      })
      .catch(() => fail("Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, files: file });
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.updateProfile(dispatch, formData);
      success(res.payload.message);
    } catch (err) {
      fail("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* LEFT */}
      <div style={styles.left}>
        <h1>Edit Profile</h1>
        <p>Update your company & personal details</p>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <form onSubmit={handleSubmit} style={styles.form}>

          <h2>Basic Info</h2>

          <input name="name" value={formData.name} onChange={handleChange} />
          <input name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
          <input name="email_id" value={formData.email_id} disabled />

          <h3>Company Info</h3>

          <input name="companyName" value={formData.companyName} onChange={handleChange} />
          <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
          <input name="panNumber" value={formData.panNumber} onChange={handleChange} />
          <input name="district" value={formData.district} onChange={handleChange} />
          <input name="state" value={formData.state} onChange={handleChange} />
          <input name="pincode" value={formData.pincode} onChange={handleChange} />

          <textarea
            name="companyAddress"
            rows={2}
            value={formData.companyAddress}
            onChange={handleChange}
          />

          {/* LOGO */}
          <div style={styles.uploadBox}>
            <input type="file" onChange={handleFile} />
            {logoPreview && (
              <img src={logoPreview} alt="logo" style={styles.preview} />
            )}
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}

// 🔥 STYLES (same as signup)
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh"
  },
  left: {
    flex: 1,
    background: "#0f172a",
    color: "#fff",
    padding: "40px"
  },
  right: {
    flex: 1,
    padding: "30px",
    background: "#f1f5f9"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  uploadBox: {
    border: "2px dashed #ccc",
    padding: "20px",
    textAlign: "center"
  },
  preview: {
    width: "80px",
    marginTop: "10px"
  },
  button: {
    padding: "12px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  }
};