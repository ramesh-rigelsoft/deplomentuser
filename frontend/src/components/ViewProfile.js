// ViewProfile.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { fail } from "../redux/WebTostar";

export default function ViewProfile() {

  const dispatch = useDispatch();

  const [data, setData] = useState(null);

  useEffect(() => {
    API.getProfile(dispatch)
      .then(res => {
        setData(res.payload.data);
      })
      .catch(() => fail("Failed to load profile"));
  }, []);

  if (!data) {
    return <div style={{ padding: "50px" }}>Loading...</div>;
  }

  return (
    <div style={styles.container}>

      {/* LEFT PANEL */}
      <div style={styles.left}>
        <h1>My Profile</h1>
        <p>View your account details</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>

        <div style={styles.card}>

          {/* LOGO */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            {data.companyLogo ? (
              <img src={data.companyLogo} alt="logo" style={styles.logo} />
            ) : (
              <div style={styles.noLogo}>No Logo</div>
            )}
          </div>

          {/* USER INFO */}
          <h2>Basic Info</h2>

          <div style={styles.row}>
            <span>Name:</span>
            <strong>{data.name}</strong>
          </div>

          <div style={styles.row}>
            <span>Email:</span>
            <strong>{data.email_id}</strong>
          </div>

          <div style={styles.row}>
            <span>Mobile:</span>
            <strong>{data.mobile_no}</strong>
          </div>

          {/* COMPANY INFO */}
          <h2 style={{ marginTop: "20px" }}>Company Info</h2>

          <div style={styles.row}>
            <span>Company:</span>
            <strong>{data.companyName || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>GST:</span>
            <strong>{data.gstNumber || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>PAN:</span>
            <strong>{data.panNumber || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>District:</span>
            <strong>{data.city || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>State:</span>
            <strong>{data.state || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>Pincode:</span>
            <strong>{data.pincode || "-"}</strong>
          </div>

          <div style={styles.row}>
            <span>Address:</span>
            <strong>{data.addressLine1 || "-"}</strong>
          </div>

        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
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
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
  },
  logo: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%"
  },
  noLogo: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee"
  }
};