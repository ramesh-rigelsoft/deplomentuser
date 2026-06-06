import React,{useState,useEffect} from "react";
import Header from "./Header";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

export default function ViewProfile() {
  
  const ownerId = parseInt(Cookies.get("secretCode"))
  const dispatch = useDispatch();

 const [user, setUser] = useState({
  name: "",
  email_id: "",
  mobile_no: "",
  shopType: "",
  companyName: "",
  gstNumber: "",
  panNumber: "",
  state: "",
  district: "",
  pincode: "",
  companyAddress: "",
  logo: null
});

useEffect(() => {
  if (ownerId) {
    API.viewAccount(dispatch, { userId: ownerId })
      .then((res) => {
        const data = res.payload.data.user;
console.log(data)
        setUser({
          name: data.name || "NA",
          email_id: data.email_id || "NA",
          mobile_no: data.mobile_no || "NA",
          shopType: data.shopType || "NA",
          companyName: data.companyName || "NA",
          gstNumber: data.gstNumber || "NA",
          panNumber: data.panNumber || "NA",
          state: data.state || "NA",
          district: data.district || "NA",
          pincode: data.pincode || "NA",
          companyAddress: data.addressLine1 || "NA",
          logo: data.logo || null
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}, [ownerId]);
  

  return (
    <div className="min-vh-100 bg-light p-4">
       <Header
        title="User Mangement"
        subTitle="Manage everything in one place"
      />

      <div className="row justify-content-center">

        <div className="col-12 col-md-12 col-lg-12">

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