import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await superadminApi.post("/auth/login", {
        username: username.trim(),
        password: password,
      });

      const data = res?.data?.data;
      if (data && data.token) {
        Cookies.set("superadmin_token", data.token, { expires: 1 });
        localStorage.setItem("superadmin_token", data.token);
        localStorage.setItem("superadmin_user", JSON.stringify(data));
        toast.success("Welcome, Super Admin!");
        navigate("/superadmin/dashboard");
      } else {
        setErrorMsg("Login failed: Invalid server response.");
      }
    } catch (err) {
      console.error("Super Admin login error:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Login failed. Please check your credentials.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("superadmin");
    setPassword("SuperAdmin@123");
    setErrorMsg("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        backgroundImage: "radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
            color: "#ffffff",
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              marginBottom: "0.75rem",
              fontSize: "1.5rem",
            }}
          >
            <i className="fa fa-shield" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Super Admin Portal</h2>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.875rem", opacity: 0.9 }}>
            Sign in to manage subscriptions, sales & owners
          </p>
        </div>

        {/* Login Form */}
        <div style={{ padding: "2rem 1.75rem" }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                color: "#b91c1c",
                borderRadius: "8px",
                padding: "0.75rem",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <i className="fa fa-exclamation-circle" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "0.4rem",
                }}
              >
                Username or Email <span style={{ color: "#dc2626", fontWeight: "bold" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <i
                  className="fa fa-user"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter super admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem 0.65rem 2.25rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "0.4rem",
                }}
              >
                Password <span style={{ color: "#dc2626", fontWeight: "bold" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <i
                  className="fa fa-lock"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 2.5rem 0.65rem 2.25rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.3)",
              }}
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Default Test Credentials:</span>
            <div style={{ marginTop: "0.4rem" }}>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  backgroundColor: "#f1f5f9",
                  border: "1px dashed #94a3b8",
                  borderRadius: "6px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.75rem",
                  color: "#334155",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <i className="fa fa-magic text-primary" />
                <span>Auto-fill (superadmin / SuperAdmin@123)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
