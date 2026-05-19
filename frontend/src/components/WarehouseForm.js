import React, { useState } from "react";

const WarehouseForm = () => {
  const [formData, setFormData] = useState({
    warehouseLocationCode: "",
    companyName: "",
    deliveryAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    locationStatus: "1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 text-primary fw-bold">
                Warehouse Information
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Warehouse Location Code */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Warehouse Location Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="warehouseLocationCode"
                    value={formData.warehouseLocationCode}
                    onChange={handleChange}
                    placeholder="Enter warehouse location code"
                    required
                  />
                </div>

                {/* Company Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />
                </div>

                {/* Delivery Address */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Enter delivery address"
                    required
                  />
                </div>

                {/* City & State */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                {/* Country & Postal Code */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter country"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Enter postal code"
                      required
                    />
                  </div>
                </div>

                {/* Location Status */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Location Status</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="locationStatus"
                        value="1"
                        checked={formData.locationStatus === "1"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="locationStatus"
                        value="0"
                        checked={formData.locationStatus === "0"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Inactive</label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseForm;
