import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import NetworkStatus from "./NetworkStatus";
import Cookies from "js-cookie";
import Header from "./Header";

export default function Signup() {
  const ownerId = parseInt(Cookies.get("secretCode"));
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email_id: "",
    mobile_no: "",
    shopType: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    state: "",
    city: "",
    ownerId:ownerId,
    pincode: "",
    addressLine1: "",
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (ownerId) {
      API.viewAccount(dispatch, { userId: ownerId })
        .then((res) => {
          const data = res?.payload?.data?.user;
          if (!data) return;

          setFormData({
            id: data.id || 0,
            name: data.name || "",
            email_id: data.email_id || "",
            mobile_no: data.mobile_no || "",
            shopType: data.shopType || "",
            companyName: data.companyName || "",
            gstNumber: data.gstNumber || "",
            panNumber: data.panNumber || "",
            state: data.state || "",
            ownerId: ownerId,
            city: data.city || "",
            pincode: data.pincode || "",
            addressLine1: data.addressLine1 || "",
            logo: null,
          });

          if (data.logo) {
            setLogoPreview(data.logo);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [ownerId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

   const errorStyle = (field) => ({
    border: errors[field] ? "1px solid red" : "1px solid #ddd",
  });

  const validate = () => {
    let temp = {};

    Object.keys(formData).forEach((key) => {
      if (
        key === "gstNumber" ||
        key === "panNumber" ||
        key === "logo" ||
        key === "id"||
         key === "ownerId"
      ) {
        return;
      }

      if (!formData[key]) {
        temp[key] = true;
      }
    });

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // const data = new FormData();

      // Object.keys(formData).forEach((key) => {
      //   if (key === "logo" && !formData.logo) return;

      //   data.append(key, formData[key]);
      // });
      // alert(JSON.stringify(formData));
      const res = await API.signupAccount(dispatch, formData);

      if (res?.payload?.code === "200") {
        success(res.payload.message);
      } else {
        fail(res?.payload?.message || "Failed");
      }
    } catch (err) {
      console.error(err);
      fail("Server Down");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-vh-100 bg-light p-4">
        <Header
          title="User Management"
          subTitle="Manage everything in one place"
        />

        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12">
            <form
              className="card shadow p-4"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <h2 className="text-center mb-4">Update Account</h2>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    placeholder="Name"
                    onChange={handleChange}
                    style={errorStyle("name")}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="mobile_no"
                    value={formData.mobile_no}
                    placeholder="Mobile Number"
                    onChange={handleChange}
                    style={errorStyle("mobile_no")}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    name="email_id"
                    value={formData.email_id}
                    placeholder="Email"
                    onChange={handleChange}
                    style={errorStyle("email_id")}
                  />
                </div>

              </div>

              <h4 className="mb-3">Company Information</h4>

              <div className="row g-3">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    name="shopType"
                    value={formData.shopType}
                    onChange={handleChange}
                  >
                    <option value="">Select Shop Type</option>
                    <option value="mobile_shop">Mobile Shop</option>
                    <option value="laptop_shop">Laptop Shop</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="companyName"
                    value={formData.companyName}
                    placeholder="Company Name"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="gstNumber"
                    value={formData.gstNumber}
                    placeholder="GST Number"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="panNumber"
                    value={formData.panNumber}
                    placeholder="PAN Number"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    placeholder="State"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    placeholder="District"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    value={formData.pincode}
                    placeholder="Pincode"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows="3"
                    name="addressLine1"
                    value={formData.addressLine1}
                    placeholder="Company Address"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          logo: file,
                        }));

                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>

                <div className="col-md-6 text-center">
                  <div className="border rounded p-2">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="img-fluid"
                        style={{ maxHeight: "120px" }}
                      />
                    ) : (
                      <span className="text-muted">
                        No Logo Selected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-4"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Account"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <NetworkStatus />
    </>
  );
}