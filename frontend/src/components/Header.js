import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import Cookies from "js-cookie";
import { FaSignOutAlt } from "react-icons/fa";
import { navigateTo } from "../components/navigationService";

const Header = ({
  title = "Dashboard",
  subTitle = "Welcome back! Here's what's happening today.",
  dashboard = false
}) => {
  const dispatch = useDispatch();

  const [logo, setLogo] = useState("");
  const companyName = Cookies.get("companyName") || "Your Company";
  const fileName = Cookies.get("fileName");

  // useEffect(() => {
  //   if (!fileName) return;

  //   const payload = {
  //     path: "logo",
  //     fileName,
  //     type: 1,
  //   };

  //   API.viewFiles(dispatch, payload)
  //     .then((res) => {
  //       setLogo(URL.createObjectURL(res.payload));
  //     })
  //     .catch((err) => console.log(err));
  // }, [dispatch, fileName]);

  const handleLogout = (status) => {
    if(!status){
      navigateTo("/dashboard");
    } else{
      Cookies.remove("tab");
      Cookies.remove("companyName");
      Cookies.remove("username");
      Cookies.remove("secretCode");
      Cookies.remove("secret");
      Cookies.remove("fileName");
      Cookies.remove("token");
      localStorage.clear();
      sessionStorage.clear();
      navigateTo("/login");
    }
  };

  return (
    <div
      className="bg-white rounded-4 shadow-sm px-4 py-3 mb-4 border"
      style={{
        borderColor: "#eef2f7",
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        
        {/* Left Section */}
        <div className="d-flex align-items-center">
          <div className="me-3">
            {logo ? (
              <img
                src={logo}
                alt="logo"
                className="rounded-circle border"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: "60px",
                  height: "60px",
                  fontSize: "22px",
                }}
              >
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h5 className="mb-0 fw-bold text-dark">
              {companyName}
            </h5>
            <small className="text-muted">
              Business Management System
            </small>
          </div>
        </div>

        {/* Center Section */}
        <div className="text-center flex-grow-1">
          <h3 className="fw-bold mb-1 text-dark">
            {title}
          </h3>
          <p className="text-muted mb-0">
            {subTitle}
          </p>
        </div>

        {/* Right Section */}
        <div>
          <span
            onClick={() => handleLogout(dashboard)}
            className="btn btn-danger px-4 rounded-pill"
          >
            <FaSignOutAlt className="me-2" />
            {dashboard?("Logout"):"Back"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;