import React from "react";
import { FaUser, FaEdit, FaFileInvoice, FaCreditCard, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { success, fail } from "../redux/WebTostar";
import { navigateTo } from "../components/navigationService";

export default function Dashboards() {

  const lastPayment = {
    amount: 1200,
    status: "success",
    date: "30 Apr 2026"
  };

  // Logout function (abhi simple alert, baad me API + token remove)
  const handleLogout = () => {
    success("Logged out successfully!");
    
    navigateTo("/login");
    // yaha localStorage.removeItem("token") bhi kar sakte ho
  };

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">

{/* Coming Soon Overlay */}
<div className="coming-soon-overlay">
  Coming Soon
</div>

      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted">Manage everything in one place</p>
        </div>

        {/* 🚪 Logout Button */}
        <div className="col text-end">
          <button
            onClick={handleLogout}
            className="btn btn-outline-dark btn-sm"
          >
            <FaSignOutAlt className="me-1" />
            Logout
          </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="row g-4">

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 hover-card">
            <FaCreditCard size={28} className="text-success mb-2" />
            <h5>Pay Bills</h5>
            <button className="btn btn-success btn-sm">Pay Now</button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 hover-card">
            <FaFileInvoice size={28} className="text-primary mb-2" />
            <h5>Tax Invoice</h5>
            <button className="btn btn-primary btn-sm">View</button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 hover-card">
            <FaUser size={28} className="text-warning mb-2" />
            <h5>My Profile</h5>
            <button className="btn btn-warning btn-sm text-white">View</button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 hover-card">
            <FaEdit size={28} className="text-danger mb-2" />
            <h5>Edit Profile</h5>
            <button className="btn btn-danger btn-sm">Edit</button>
          </div>
        </div>

        {/* 🆕 Our Services (FIXED COLOR) */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-4 hover-card">
            <FaCogs size={28} className="text-info mb-2" />

            <h5>Our Services</h5>
           {/* ✔ FIXED BUTTON COLOR */}
            <button className="btn btn-info btn-sm text-white">
              View
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="row mt-4 g-4">

        {/* Last Payment */}
        <div className="col-md-6">
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
        </div>

        {/* Summary */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h5>Quick Summary</h5>
            <ul className="list-unstyled mt-3">
              <li>✔ Pending Payments: 2</li>
              <li>✔ Total Invoices: 18</li>
              <li>✔ Account Status: Active</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}