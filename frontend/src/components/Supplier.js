import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";

const SupplierPage = () => {
  const dispatch = useDispatch();
  const secret = Cookies.get("secretCode"); 

  const [activeTab, setActiveTab] = useState("add"); // 'add' or 'list'
  const [formData, setFormData] = useState({
    id: null,
    supplierName: "",
    gstNumber: "",
    panNumber: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    pinCode: "",
    ownerId: secret,
  });

  const validate = (data) => {
    const newErrors = {};

    if (!data.supplierName.trim()) newErrors.supplierName = "Supplier name is required";
    if (!data.gstNumber.trim()) newErrors.gstNumber = "GST Number is required";
    if (!data.address.trim()) newErrors.address = "Address is required";
    if (!data.district.trim()) newErrors.district = "District is required";
    if (!data.pinCode.trim() || !/^\d{6}$/.test(data.pinCode))
      newErrors.pinCode = "Pin Code must be 6 digits";

    return newErrors;
  };

  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [previousIndex, setPreviousIndex] = useState(0);

  const [criteria, setCriteria] = useState({
    startIndex: 0,
    maxRecords: 10, 
    supplierName: null,
    gstNumber: null,
    status:"active",
    userId: secret
  });

   useEffect(() => {
      fetchSuppliers();
    }, [criteria]);

  // 🔹 Fetch supplier list
  const fetchSuppliers = async () => {
    try {
      const res = await API.searchSupplier(dispatch, criteria);
      const payload = res?.payload;

      if (payload?.data?.supplier) {
        setSuppliers(payload.data.supplier);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.error(err);
      fail("Failed to fetch suppliers");
    }
  };


  // 🔹 Handle form input change
  const changeHandle = (name,value) => {
    // const { name, value } = e.target;
     const updatedForm = {
        ...formData,
        [name]: value
      };
   
      setFormData(updatedForm);
      setErrors(validate(updatedForm));
  };


  // 🔹 Add / Update Supplier
  const handleSubmit = async (e) => {
         e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        API.addSupplier(dispatch, formData).then(res => {
          success(res.payload.message);
          fetchSuppliers();
          resetForm();
          setActiveTab("list"); // Switch to Supplier List after adding
        })
        .catch(err => {
            fail("Please contact To Service Provider");
        });
      } catch {
        fail("Please contact To Service Provider");
      }
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      supplierName: "",
      gstNumber: "",
      panNumber: "",
      email: "",
      phone: "",
      address: "",
      district: "",
      pinCode: "",
      status: "Active",
      ownerId: secret,
    });
    setEditing(false);
    setErrors({});
  };

  // 🔹 Edit supplier
  const handleEdit = (supplier) => {
    setFormData({
      id: supplier.id,
      supplierName: supplier.supplierName || "",
      gstNumber: supplier.gstNumber || "",
      panNumber: supplier.panNumber || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      district: supplier.district || "",
      pinCode: supplier.pinCode || "",
      status: supplier.status || "Active",
    });
    setEditing(true);
    setActiveTab("add"); // Switch to Add Supplier tab for editing
  };

  // // 🔹 Search
  const handleSearch = () => {
      fetchSuppliers(criteria);
  };

  return (
    <div className="py-4 page container">
      <h2 className="fw-bold text-primary mb-3">Vendor Management</h2>

      {/* 🔹 Tabs 50/50 */}
       <div className="tabs">
        {["add", "list"].map((tab) => (
          <button
            key={tab}
            className={`rigel-tabs col-6 ${activeTab === tab ? "rigel-tabs-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* 🔹 Add Supplier Tab */}
      {activeTab === "add" && (
        <div className="card mb-4 shadow">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Supplier Name</label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    maxLength={20}
                    onChange={(e) => (changeHandle("supplierName", e.target.value))}
                    className={`form-control ${errors.supplierName ? "is-invalid" : ""}`}
                    placeholder="Enter Supplier Name"
                  />
                  {errors.supplierName && <div className="invalid-feedback">{errors.supplierName}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    length={15}
                    value={formData.gstNumber}
                    onChange={(e) => (changeHandle("gstNumber", e.target.value))}
                    className={`form-control ${errors.gstNumber ? "is-invalid" : ""}`}
                    placeholder="Enter GST Number"
                  />
                  {errors.gstNumber && <div className="invalid-feedback">{errors.gstNumber}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                     onChange={(e) => (changeHandle("status", e.target.value))}
                    className="form-control"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    length={10}
                    value={formData.panNumber}
                    onChange={(e) => (changeHandle("panNumber", e.target.value))}
                    className="form-control"
                    placeholder="Enter PAN Number"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    maxLength={30}
                    value={formData.email}
                    onChange={(e) => (changeHandle("email", e.target.value))}
                    className={`form-control`}
                    placeholder="Enter Email Address"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => (changeHandle("phone", e.target.value))}
                    className={`form-control`}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={(e) => (changeHandle("district", e.target.value))}
                    className={`form-control ${errors.district ? "is-invalid" : ""}`}
                    placeholder="Enter District"
                  />
                  {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    length={6}
                    value={formData.pinCode}
                    onChange={(e) => (changeHandle("pinCode", e.target.value))}
                    className={`form-control ${errors.pinCode ? "is-invalid" : ""}`}
                    placeholder="Enter 6-digit Pin Code"
                  />
                  {errors.pinCode && <div className="invalid-feedback">{errors.pinCode}</div>}
                </div>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Address</label>
                  <textarea
                    name="address"
                    maxLength={300}
                    value={formData.address}
                    onChange={(e) => (changeHandle("address", e.target.value))}
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    placeholder="Enter Full Address"
                    rows="2"
                  ></textarea>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-2">
                  <center><button type="submit" className="btn btn-success w-100 fw-semibold">
                    Submit
                  </button></center>
                </div>
                {editing && (
                  <div className="col-md-2">
                    <button type="button" className="btn btn-secondary w-100 fw-semibold" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Supplier List Tab */}
      {activeTab === "list" && (
        <div>
          {/* Search Filters */}
          <div className="card mb-3 shadow p-3">
            <h5 className="mb-3">Search Suppliers</h5>
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Supplier"
                  name="supplierName"
                  value={criteria.supplierName}
                  onChange={(e) =>  {setCriteria(prev => ({
                                    ...prev,
                                    supplierName: e.target.value
                      }));}}
                  
                />
              </div>
              <div className="col-md-5">
                <select
                  className="form-select fw-semibold"
                  name="statue"
                  value={criteria.status}
                   onChange={(e) =>  {setCriteria(prev => ({
                                    ...prev,
                                    status: e.target.value
                      }));}}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="rigel-btn w-100 fw-semibold"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Supplier Table */}
          <div className="card shadow">
            <div className="card-body">
              <h5 className="mb-3">Supplier List</h5>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Supplier Name</th>
                    <th>GST</th>
                    <th>PAN</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>District</th>
                    <th>Pin Code</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No suppliers found
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((s, i) => (
                      <tr key={s.id}>
                        <td>{criteria.startIndex + i + 1}</td>
                        <td>{s.supplierName}</td>
                        <td>{s.gstNumber}</td>
                        <td>{s.panNumber}</td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>{s.district}</td>
                        <td>{s.pinCode}</td>
                        <td>{s.address}</td>
                        <td>{s.status || "Active"}</td>
                        <td>
                          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(s)}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <nav aria-label="Page navigation" className="mt-3 pagination-position">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${previousIndex === 0 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePagination(previousIndex - 1)}>
                      Previous
                    </button>
                  </li>
                  {
                    (() => {
                      let start = previousIndex - 2;

                      // ensure minimum 0 se start ho
                      if (start < 0) start = 0;

                      // hamesha 3 items generate karo
                      const pages = [start, start + 1, start + 2];

                      return pages.map((pageIndex) => (
                        <li
                          key={pageIndex}
                          className={`page-item ${previousIndex === pageIndex ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePagination(pageIndex)}
                          >
                            {pageIndex + 1}
                          </button>
                        </li>
                      ));
                    })()
                  }
                  <li className={`page-item ${suppliers.length === 0 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePagination(previousIndex + 1)}>
                      Next
                    </button>
                  </li>

                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPage;
