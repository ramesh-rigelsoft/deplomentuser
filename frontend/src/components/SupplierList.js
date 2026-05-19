import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header1 from "./Header1";

const SupplierList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [suppliers] = useState([
    {
      recordId: "RLG0001",
      supplierName: "ABC Traders",
      gstNumber: "GST1234567",
      panNumber: "ABCDE1234F",
      email: "abc@gmail.com",
      phone: "9876543210",
      address: "Delhi, India",
    },
    {
      recordId: "RLG0002",
      supplierName: "Global Suppliers",
      gstNumber: "GST7654321",
      panNumber: "BCDEF2345G",
      email: "global@suppliers.com",
      phone: "9123456780",
      address: "Mumbai, India",
    },
    {
      recordId: "RLG0003",
      supplierName: "Techno Parts",
      gstNumber: "GST9988776",
      panNumber: "CDEFG3456H",
      email: "techno@parts.com",
      phone: "9812345678",
      address: "Pune, India",
    },
    {
      recordId: "RLG0004",
      supplierName: "Elite Distributors",
      gstNumber: "GST5566778",
      panNumber: "DEFGH4567I",
      email: "elite@distributors.com",
      phone: "9786543210",
      address: "Ahmedabad, India",
    },
    {
      recordId: "RLG0005",
      supplierName: "Metro Components",
      gstNumber: "GST3344556",
      panNumber: "EFGHI5678J",
      email: "metro@comp.com",
      phone: "9090909090",
      address: "Chennai, India",
    },
    {
      recordId: "RLG0006",
      supplierName: "NextGen Supplies",
      gstNumber: "GST2233445",
      panNumber: "FGHIJ6789K",
      email: "nextgen@supply.com",
      phone: "9876501234",
      address: "Bangalore, India",
    },
    {
      recordId: "RLG0007",
      supplierName: "Om Enterprises",
      gstNumber: "GST7788990",
      panNumber: "GHIJK7890L",
      email: "om@enterprises.com",
      phone: "9001122334",
      address: "Kolkata, India",
    },
    {
      recordId: "RLG0008",
      supplierName: "Bright Mart",
      gstNumber: "GST1122334",
      panNumber: "HIJKL8901M",
      email: "bright@mart.com",
      phone: "9822334455",
      address: "Jaipur, India",
    },
    {
      recordId: "RLG0009",
      supplierName: "Supreme Traders",
      gstNumber: "GST6677889",
      panNumber: "IJKLM9012N",
      email: "supreme@traders.com",
      phone: "9555566677",
      address: "Lucknow, India",
    },
    {
      recordId: "RLG0010",
      supplierName: "Blue Ocean Imports",
      gstNumber: "GST8899001",
      panNumber: "JKLMN0123O",
      email: "blue@ocean.com",
      phone: "9788889999",
      address: "Hyderabad, India",
    },
  ]);

  // ✅ Filter suppliers by search term
  const filteredSuppliers = suppliers.filter((s) =>
    Object.values(s).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
             <div className="container-fluid py-4">
            <div
              className="card shadow border-0 rounded-2 w-100"
              style={{
                background: "linear-gradient(145deg, #ffffff, #f3f6fa)",
              }}
            >
              <div className="card-body">
                {/* Header + Search */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                  <h3 className="fw-bold text-primary m-0">Supplier List</h3>

                  {/* 🔍 Search Bar */}
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <span className="input-group-text bg-primary text-white">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search supplier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* 🧾 Supplier Table */}
                <div className="table-responsive">
                  <table className="table table-hover table-striped align-middle text-center shadow-sm">
                    <thead className="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Company Name</th>
                        <th>GST Number</th>
                        <th>PAN Number</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((s, index) => (
                          <tr key={index}>
                            <td>{s.recordId}</td>
                            <td className="fw-semibold text-dark">{s.supplierName}</td>
                            <td>{s.gstNumber}</td>
                            <td>{s.panNumber}</td>
                            <td>{s.email}</td>
                            <td>{s.phone}</td>
                            <td>{s.address}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-muted py-4">
                            No suppliers found matching "<b>{searchTerm}</b>"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Count */}
                <div className="d-flex justify-content-between mt-3">
                  <span className="text-muted small">
                    Showing {filteredSuppliers.length} of {suppliers.length} suppliers
                  </span>
                </div>
              </div>
            </div>
          </div>
  );
};

export default SupplierList;
