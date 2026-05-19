import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail,info} from "../redux/WebTostar"
import { useNavigate,Link } from "react-router-dom";

// Step 1 validation
const mobileSchema = yup.object().shape({
  mobileNo: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit mobile number")
    .required("Mobile number is required"),
});

// Step 2 validation
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password"),
});

const MobileResetPassword = () => {

  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));
  const [captcha, setCaptcha] = useState("");
  const refreshCaptcha = () => {
  setNum1(Math.floor(Math.random() * 10));
  setNum2(Math.floor(Math.random() * 10));
  setCaptcha("");
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 


  // Step 1
  const {
    register: registerMobile,
    handleSubmit: handleMobileSubmit,
    formState: { errors: mobileErrors },
  } = useForm({ resolver: yupResolver(mobileSchema) });

  // Step 2
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({ resolver: yupResolver(otpSchema) });

   // Send OTP
    const sendOtp = () => {

        if (parseInt(captcha) !== num1 + num2) {
          fail("Invalid captcha");
          refreshCaptcha();
          return;
        }

        const payload = {
           mobile_no: mobile
        };
        console.log(payload);
        setLoading(true);
        try {
            const res = API.sendOTP(dispatch, payload); // use data, not formData
            // let signup = res.payload;
            // setMobile(data.mobileNo);
            success("OTP has sent on your register mobile number");
            setStep(2);
            
        } catch (err) {
            console.log(err);
            fail("Please contact To Service Provider");
        } finally {
            setLoading(false); // no argument in finally
        }
    };

    // resetpassword
   const resetPassword = async (data) => {
   setLoading(true);
    try {
        // Create payload according to backend DTO
        const payload = {
        mobile_no: mobile,    // stored from step 1
        otp: data.otp,       // from OTP form
        password: data.password, // from OTP form
        };

        const res = await API.resetPassword(dispatch, payload);
        let payload1=res.payload.data;
        console.log(res);
        if(res.payload?.code==='200'){
           success(res.payload.message);
           navigate("/login"); 
        }else{
           info(payload1.message);
        }
    } catch (err) {
        fail("Please contact To Service Provider");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      
      <div className="card shadow-lg border-0" style={{ width: "400px", borderRadius: "15px" }}>
        
        <div className="card-body p-4">

          <h4 className="text-center text-primary mb-4">
            {step === 1 ? "Reset Password" : "Verify OTP"}
          </h4>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleMobileSubmit(sendOtp)}>
              
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter mobile number"
                  autoComplete="off"
                  {...registerMobile("mobileNo")}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <small className="text-danger">
                  {mobileErrors.mobileNo?.message}
                </small>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600" }}>
                  Human Verification
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                  <div style={{
                    padding: "10px 14px",
                    background: "#f3f4f6",
                    borderRadius: "6px",
                    fontWeight: "bold"
                  }}>
                    {num1} + {num2} = ?
                  </div>

                  <input
                    type="number"
                    placeholder="Answer"
                    autoComplete="off"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px"
                    }}
                  />

                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    style={{
                      padding: "10px",
                      border: "none",
                      background: "#e5e7eb",
                      cursor: "pointer",
                      borderRadius: "6px"
                    }}
                  >
                    ↻
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary w-100 btn-lg"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
               {/* 👇 Yaha add karo */}
              <div>
              <Link
                to="/login"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "0.3s"
                }}
                onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                ← Back to Login
              </Link>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit(resetPassword)}>

              {/* OTP */}
              <div className="mb-3 text-center">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="OTP"
                  autoComplete="off"
                  className="form-control form-control-lg text-center"
                  style={{ letterSpacing: "8px", fontSize: "12px" }}
                  {...registerOtp("otp")}
                />
                <small className="text-danger">
                  {otpErrors.otp?.message}
                </small>
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  autoComplete="off"
                  className="form-control form-control-lg"
                  {...registerOtp("password")}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "45px",
                    cursor: "pointer",
                    color: "#0d6efd",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
                <small className="text-danger">
                  {otpErrors.password?.message}
                </small>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  autoComplete="off"
                  className="form-control form-control-lg"
                  {...registerOtp("confirmPassword")}
                />
                <small className="text-danger">
                  {otpErrors.confirmPassword?.message}
                </small>
              </div>

              <button
                className="btn btn-success w-100 btn-lg"
                disabled={loading}
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>

              <button
                type="button"
                className="btn btn-link w-100 mt-2"
                onClick={() => setStep(1)}
              >
                ← Change Mobile Number
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default MobileResetPassword;