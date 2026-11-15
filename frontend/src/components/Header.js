import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import Cookies from "js-cookie";
import { FaSignOutAlt } from "react-icons/fa";
import { navigateTo } from "../components/navigationService";


const Header = ({
  title = "Dashboard",
  subTitle = "Welcome back! Here's what's happening today.",
  dashboard = "4"
}) => {
  const dispatch = useDispatch();
  
  const ownerId= parseInt(Cookies.get("secretCode"));

  const [logo, setLogo] = useState("");
  const companyName = Cookies.get("name") || "My Business";
  const [showDropdown, setShowDropdown] = useState(false);
  const branchDetails=JSON.parse(localStorage.getItem("branchDetails"));
  const [branchName, setBranchName] = useState(
    branchDetails?.id === 0
      ? "All Location"
      : branchDetails?.branchName||"All Location"
  );
  const [branches,setBranches]=useState([]);

  useEffect(() => {
    if (ownerId) {
      API.fetchOfficeBranch(dispatch, { userId: ownerId })
        .then((res) => {
          const list = res?.payload?.data?.branchList || [];

          const updatedList = [
            { id: 0, branchName: "All Location" },
            ...list
          ];

          setBranches(updatedList);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ownerId, dispatch]);
const dropdownRef = useRef(null);
useEffect(() => {
  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

//  useEffect(() => {
//     if (ownerId) {
//       API.fetchOfficeBranch(dispatch, { userId: ownerId })
//         .then((res) => {
//           setBranches(res.payload.data.branchList||[]);
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     }
//   }, [ownerId, dispatch]);

  // const branches = [
  //   "all",
  //   "Bhopal Main Branch",
  //   "Indore Branch",
  //   "Delhi Branch"
  // ];

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
    if(status==="1"){
      navigateTo("/dashboard");
    } else if(status==="2"){
       navigateTo("/branchs");
    } else if(status==="4"){
      navigateTo("/dashboard");
    }else{
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
      className="bg-white rounded-4 shadow-sm px-3 px-sm-4 py-2 py-sm-3 mb-3 mb-md-4 border header-responsive-wrapper"
      style={{
        borderColor: "#eef2f7",
      }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 gap-sm-3">
        
        {/* Left Section: Logo, Company Name & Location */}
        <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0" style={{ minWidth: 0, maxWidth: "100%" }}>
          <div className="me-2 me-sm-3 flex-shrink-0">
            {logo ? (
              <img
                src={logo}
                alt="logo"
                className="rounded-circle border"
                style={{
                  width: "clamp(42px, 5vw, 56px)",
                  height: "clamp(42px, 5vw, 56px)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: "clamp(42px, 5vw, 56px)",
                  height: "clamp(42px, 5vw, 56px)",
                  fontSize: "clamp(16px, 2vw, 22px)",
                }}
              >
                {companyName ? companyName.charAt(0).toUpperCase() : "M"}
              </div>
            )}
          </div>

          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <h5 className="mb-0 fw-bold text-dark text-truncate" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}>
              {companyName}
            </h5>
            <small className="text-muted d-block text-truncate" style={{ fontSize: "clamp(0.75rem, 1vw, 0.85rem)" }}>
              Business Management System
            </small>
            {(dashboard === "4" || dashboard === "2") && (
              <div className="branch-switcher" ref={dropdownRef}>
                <span className="text-truncate" style={{ maxWidth: "160px" }}>📍 {branchName}</span>

                <button
                  type="button"
                  className="branch-change-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Change
                </button>

                {showDropdown && (
                  <div
                    className="branch-dropdown"
                    style={{
                      maxWidth: "min(280px, calc(100vw - 32px))",
                      maxHeight: "260px",
                      overflowY: "auto",
                    }}
                  >
                    {branches.map((b, i) => (
                      <div
                        key={i}
                        className="branch-item"
                        onClick={() => {
                          setShowDropdown(false);
                          if (b.id === 0) {
                            setBranchName("All Location");
                            Cookies.set("multipleBranch", false);
                            localStorage.setItem("branchDetails", JSON.stringify({ id: 0, branchName: "All Location" }));
                            Cookies.remove("branchCode");
                          } else {
                            localStorage.setItem("branchDetails", JSON.stringify(b));
                            Cookies.set("multipleBranch", true);
                            Cookies.set("branchCode", JSON.stringify(b.branchCode));
                          }
                          window.location.reload();
                        }}
                      >
                        {b.branchName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Page Title & Subtitle */}
        <div className="text-center flex-grow-1 order-3 order-lg-2 px-2" style={{ minWidth: "180px" }}>
          <h3 className="fw-bold mb-1 text-dark text-truncate" style={{ fontSize: "clamp(1.1rem, 2vw, 1.55rem)" }}>
            {title}
          </h3>
          <p className="text-muted mb-0 small text-truncate" style={{ fontSize: "clamp(0.75rem, 1vw, 0.9rem)" }}>
            {subTitle}
          </p>
        </div>

        {/* Right Section: Action Button */}
        <div className="order-2 order-lg-3 flex-shrink-0 ms-auto ms-md-0">
          <button
            type="button"
            onClick={() => handleLogout(dashboard)}
            className={`btn ${dashboard === "3" ? "btn-danger" : "btn-secondary"} px-3 px-sm-4 rounded-pill d-inline-flex align-items-center`}
            style={{ minHeight: "38px" }}
          >
            <FaSignOutAlt className="me-2" />
            <span>{dashboard === "3" ? "Logout" : "Back"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;