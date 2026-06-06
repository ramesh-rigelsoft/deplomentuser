import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  return (
    <div>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          background: #ffffff;
        }

        .login-container {
          width: 320px;
          margin: 60px auto;
          border: 1px solid #ccc;
          padding: 15px;
          text-align: center;
        }

        .logo {
          width: 60px;
          margin-bottom: 10px;
        }

        .login-title {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .top-links {
          text-align: right;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-label {
          font-size: 13px;
          text-align: left;
          display: block;
          margin-bottom: 2px;
        }

        .form-control {
          font-size: 13px;
          padding: 4px;
          margin-bottom: 10px;
        }

        .btn-login {
          width: 100%;
          font-size: 13px;
          padding: 5px;
        }

        .bottom-link {
          margin-top: 8px;
          font-size: 12px;
        }
      `}</style>

      <div className="login-container">

        {/* DUMMY LOGO */}
        <img
          src="https://via.placeholder.com/60"
          alt="logo"
          className="logo"
        />

        <div className="login-title">Login Here</div>

        <div className="top-links">
          <a href="#">Forgot Password?</a> |{" "}
          <a href="#">Reset Password</a>
        </div>

        <form>
          <label className="form-label">* UserId</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your User ID"
          />

          <label className="form-label">* Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your Password"
          />

          <label className="form-label">Enter Captcha Text</label>
          <input type="text" className="form-control" />

          <button type="button" className="btn btn-primary btn-login">
            LOGIN
          </button>
        </form>

        <div className="bottom-link">
          <a href="#">Go to Home</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;