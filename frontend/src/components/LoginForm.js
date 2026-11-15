import React, { useState } from "react";
import bg from "../asset/keyvisual-risk-based-management.jpg";
import { Link } from "react-router-dom";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { navigateTo } from "../components/navigationService";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "../i18n";
import axios from "axios";
import { BASE_URL } from "../redux/config";


const HomePage = () => {

  const dispatch = useDispatch();
  const { syncLoginLanguage, t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginAccount = async () => {
    try {
      setLoading(true);

      const res = await API.loginAccount(dispatch, { username, password });
      const data = res.payload.data;

      if (!data.access_token) {
        fail("Wrong password");
        return;
      }
      if (res.payload.code === "200") {
        // alert(JSON.stringify(data));
        
        Cookies.set("tab", "dashboard", { expires: 1 });
        Cookies.set("name", data.user.name, { expires: 1 });
        Cookies.set("role", data.user.role, { expires: 1 });
        Cookies.set("username", data.user.email_id, { expires: 1 });
        Cookies.set("secretCode", data.user.ownerId, { expires: 1 });
        Cookies.set("secret", JSON.stringify(data.secret), { expires: 1 });
        Cookies.set("token", data.access_token, { expires: 1 });

        let userLang = (data.branch && data.branch.language) || "en";
        if (data.access_token) {
          try {
            const lRes = await axios.get(`${BASE_URL}/user/language/current`, {
              headers: { Authorization: `Bearer ${data.access_token}` },
            });
            const fetched = lRes?.data?.data?.defaultLanguage || lRes?.data?.data?.language;
            if (fetched) userLang = fetched;
          } catch (e) {}
        }
        Cookies.set("language", userLang, { expires: 30 });
        localStorage.setItem("app_language", userLang);
        syncLoginLanguage(userLang);
        
        success(res.payload.message);
        navigateTo("/dashboard");
      }else{
        fail(res.payload.message);
      }
    } catch (err) {
      console.log(err);
      fail("Server Down, UP Time 2AM to 12 AM Daily");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAccount();
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-3 px-sm-4 shadow-sm">
        <span className="navbar-brand fw-bold mb-0">BillingPro</span>

        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light btn-sm px-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm px-3">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "calc(100vh - 110px)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "clamp(1.5rem, 4vw, 3.5rem) 0",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />

        <div className="container position-relative px-3 px-sm-4">
          <div className="row align-items-center g-4">

            {/* LEFT */}
            <div className="col-12 col-md-7 text-white text-center text-md-start">
              <h1 className="fw-bold" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
                Smart Billing & Invoice System
              </h1>

              <p className="lead mt-3" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.25rem)" }}>
                Manage invoices, GST reports, payments and analytics in one dashboard.
              </p>

              <button className="btn btn-primary px-4 py-2 mt-2">
                Start Free Trial
              </button>
            </div>

            {/* RIGHT LOGIN */}
            <div className="col-12 col-md-5 d-flex justify-content-center">
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                  maxWidth: "380px",
                  backdropFilter: "blur(15px)",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "clamp(20px, 4vw, 30px)",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <h4 className="text-center mb-4 fw-bold">Login</h4>

                <label className="form-label small fw-semibold text-white mb-1">
                  Email <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-control mb-3"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ minHeight: "42px" }}
                />

                <label className="form-label small fw-semibold text-white mb-1">
                  Password <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>*</span>
                </label>
                <input
                  type="password"
                  required
                  className="form-control mb-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ minHeight: "42px" }}
                />

                <button
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                  style={{ minHeight: "42px" }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center mt-3 mb-0">
                  New here?{" "}
                  <Link to="/signup" style={{ color: "#fff", textDecoration: "underline" }}>
                    Create Account
                  </Link>
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2026 BillingPro. All rights reserved.</small>
      </footer>
    </>
  );
};

export default HomePage;