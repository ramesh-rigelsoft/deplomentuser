import React from "react";

export default function ViewProfile() {

  const user = {
    name: "John Doe",
    email_id: "john@example.com",
    mobile_no: "9876543210",
    shopType: "Mobile Shop",
    companyName: "Tech Store Pvt Ltd",
    gstNumber: "22ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    state: "MP",
    district: "Bhopal",
    pincode: "462001",
    companyAddress: "MP Nagar, Bhopal",
    logo: null
  };

  return (
    <div className="container py-4">

      <div className="row justify-content-center">

        <div className="col-12 col-md-8 col-lg-6">

          <div className="card shadow border-0">

            {/* HEADER */}
            <div className="card-header text-center bg-primary text-white">
              <h5 className="mb-0">My Profile</h5>
            </div>

            <div className="card-body">

              {/* AVATAR */}
              <div className="text-center mb-3">
                {user.logo ? (
                  <img
                    src={user.logo}
                    alt="logo"
                    className="rounded-circle border"
                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: "90px", height: "90px", fontSize: "22px" }}
                  >
                    {user.name.charAt(0)}
                  </div>
                )}

                <h5 className="mt-2 mb-0">{user.name}</h5>
                <small className="text-muted">{user.email_id}</small>
              </div>

              <hr />

              {/* USER INFO */}
              <h6 className="text-primary mb-2">User Details</h6>

              <div className="mb-2">
                <span className="text-muted">Mobile:</span>
                <div className="fw-bold">{user.mobile_no}</div>
              </div>

              <hr />

              {/* COMPANY INFO */}
              <h6 className="text-primary mb-2">Company Details</h6>

              <div className="row g-2">

                <div className="col-6">
                  <small className="text-muted">Shop Type</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.shopType}
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-muted">Company</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.companyName}
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-muted">GST</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.gstNumber}
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-muted">PAN</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.panNumber}
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-muted">State</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.state}
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-muted">District</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.district}
                  </div>
                </div>

                <div className="col-12">
                  <small className="text-muted">Address</small>
                  <div className="badge bg-light text-dark w-100 text-start">
                    {user.companyAddress}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}