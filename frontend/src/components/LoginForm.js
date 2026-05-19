import React, { useState } from "react";
import bg from "../asset/keyvisual-risk-based-management.jpg";
import { Link } from "react-router-dom";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { navigateTo } from "../components/navigationService";
import { useDispatch, useSelector } from "react-redux";


const HomePage = () => {

  const dispatch = useDispatch();
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
        Cookies.set("tab", "dashboard", { expires: 1 });
        Cookies.set("companyName", data.user.companyName, { expires: 1 });
        Cookies.set("username", data.user.email_id, { expires: 1 });
        Cookies.set("secretCode", data.user.id, { expires: 1 });
        Cookies.set("secret", JSON.stringify(data.secret), { expires: 1 });
        Cookies.set("fileName", `${data.user.logo}`, { expires: 1 });
        Cookies.set("token", data.token, { expires: 1 });

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
      <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
        <span className="navbar-brand fw-bold">BillingPro</span>

        <div>
          <Link to="/login" className="btn btn-outline-light me-2">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary">
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
          height: "90vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />

        <div className="container position-relative">
          <div className="row align-items-center">

            {/* LEFT */}
            <div className="col-md-7 text-white">
              <h1 className="display-4 fw-bold">
                Smart Billing & Invoice System
              </h1>

              <p className="lead mt-3">
                Manage invoices, GST reports, payments and analytics in one dashboard.
              </p>

              <button className="btn btn-primary btn-lg mt-3">
                Start Free Trial
              </button>
            </div>

            {/* RIGHT LOGIN */}
            <div className="col-md-5 d-flex justify-content-center">
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  backdropFilter: "blur(15px)",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "25px",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <h4 className="text-center mb-4 fw-bold">Login</h4>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center mt-3 mb-0">
                  New here?{" "}
                  <Link to="/signup" style={{ color: "#fff" }}>
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