import React from "react";
import { FaUser, FaEdit, FaFileInvoice, FaCreditCard, FaCogs, FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import { success, fail } from "../redux/WebTostar";
import { navigateTo } from "../components/navigationService";
import { Link } from "react-router-dom";
import Header from "./Header";

export default function Dashboards() {

  const clickedCards =(name)=> {
    localStorage.setItem("tab",name);
  };


  // Logout function (abhi simple alert, baad me API + token remove)
  // const handleLogout = () => {
  //   success("Logged out successfully!");
    
  //   navigateTo("/login");
  //   // yaha localStorage.removeItem("token") bhi kar sakte ho
  // };

  return (
    <div className="bg-light page-scroll container-fluid px-2 px-sm-3 px-md-4 py-3">

      {/* Header */}
      <Header
        title="Dashboard"
        subTitle="Manage everything in one place"
        dashboard="3"
      />

      {/* Responsive Feature Cards */}
      <div className="row g-3 g-md-4">
        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3" onClick={() => clickedCards("viewProfile")}>
          <div className="card shadow-sm border-0 text-center p-3 p-md-4 h-100 hover-card">
            <FaUser size={30} className="text-warning mb-2 mx-auto" />
            <h5 className="fw-bold mb-2">My Profile</h5>
            <div className="mt-auto">
              <Link to="/editProfile" className="btn btn-info btn-sm text-white px-3 py-1">
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3" onClick={() => clickedCards("officeLocation")}>
          <div className="card shadow-sm border-0 text-center p-3 p-md-4 h-100 hover-card">
            <FaCogs size={30} className="text-info mb-2 mx-auto" />
            <h5 className="fw-bold mb-2">Office Location</h5>
            <div className="mt-auto">
              <Link to="/officeLocation" className="btn btn-info btn-sm text-white px-3 py-1">
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3" onClick={() => clickedCards("branchManagement")}>
          <div className="card shadow-sm border-0 text-center p-3 p-md-4 h-100 hover-card">
            <FaCogs size={30} className="text-info mb-2 mx-auto" />
            <h5 className="fw-bold mb-2">Branch Management</h5>
            <div className="mt-auto">
              <Link to="/branchs" className="btn btn-info btn-sm text-white px-3 py-1">
                View
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3" onClick={() => clickedCards("rolePermission")}>
          <div className="card shadow-sm border-0 text-center p-3 p-md-4 h-100 hover-card">
            <FaCogs size={30} className="text-info mb-2 mx-auto" />
            <h5 className="fw-bold mb-2">Role Permission</h5>
            <div className="mt-auto">
              <Link to="/rolesPermission" className="btn btn-info btn-sm text-white px-3 py-1">
                Roles
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3" onClick={() => clickedCards("userManagement")}>
          <div className="card shadow-sm border-0 text-center p-3 p-md-4 h-100 hover-card">
            <FaUserFriends size={30} className="text-info mb-2 mx-auto" />
            <h5 className="fw-bold mb-2">User Management</h5>
            <div className="mt-auto">
              <Link to="/addSubUser" className="btn btn-info btn-sm text-white px-3 py-1">
                Users
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3" onClick={() => clickedCards("officeLocation")}>
          <div className="card shadow-sm border-0 text-center p-3 p-md-4 h-100 hover-card">
            <FaCreditCard size={30} className="text-info mb-2 mx-auto" />
            <h5 className="fw-bold mb-2">Subscription Plan</h5>
            <div className="mt-auto">
              <Link to="/subscriptionPlanList" className="btn btn-info btn-sm text-white px-3 py-1">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="row mt-4 g-4">

        {/* Last Payment */}
        {/* <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">

            <h5>Last Payment Status</h5>

            <p>Amount: <b>₹{lastPayment.amount}</b></p>
            <p>Date: {lastPayment.date}</p>

            {lastPayment.status === "success" ? (
              <span className="badge bg-success px-3 py-2">
                Payment Success
              </span>
            ) : (
              <span className="badge bg-danger px-3 py-2">
                Payment Failed
              </span>
            )}

          </div>
        </div> */}

        {/* Summary */}
        {/* <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h5>Quick Summary</h5>
            <ul className="list-unstyled mt-3">
              <li>✔ Pending Payments: 2</li>
              <li>✔ Total Invoices: 18</li>
              <li>✔ Account Status: Active</li>
            </ul>
          </div>
        </div> */}

      </div>

    </div>
  );
}