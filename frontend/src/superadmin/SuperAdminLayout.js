import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SuperAdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const storedUserStr = localStorage.getItem("superadmin_user");
  const adminUser = storedUserStr ? JSON.parse(storedUserStr) : { name: "Super Admin", role: "SUPERADMIN" };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await superadminApi.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      Cookies.remove("superadmin_token");
      localStorage.removeItem("superadmin_token");
      localStorage.removeItem("superadmin_user");
      toast.info("Logged out successfully");
      navigate("/superadmin/login");
    }
  };

  const navLinks = [
    {
      path: "/superadmin/dashboard",
      label: "Dashboard",
      icon: "fa-tachometer-alt",
    },
    {
      path: "/superadmin/subscription-plans",
      label: "Subscription Plans",
      icon: "fa-tags",
    },
    {
      path: "/superadmin/reports",
      label: "Sales & Analytics",
      icon: "fa-chart-line",
    },
    {
      path: "/superadmin/owners",
      label: "Owners & Child Users",
      icon: "fa-users",
    },
    {
      path: "/superadmin/subscriptions",
      label: "All Subscriptions",
      icon: "fa-list-alt",
    },
    {
      path: "/superadmin/payments",
      label: "Payment Transactions",
      icon: "fa-credit-card",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.25rem",
              cursor: "pointer",
            }}
            title="Toggle Sidebar"
          >
            <i className="fa fa-bars" />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "#ffffff",
                padding: "0.25rem 0.6rem",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "0.85rem",
                letterSpacing: "0.5px",
              }}
            >
              SUPER ADMIN
            </span>
            <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#f8fafc" }}>
              RigelSoft Portal
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.85rem" }}>
            <i className="fa fa-clock-o" />
            <span>{currentTime}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              backgroundColor: "rgba(255,255,255,0.08)",
              padding: "0.35rem 0.8rem",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              {(adminUser.username || "SA").substring(0, 2).toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{adminUser.name || "Super Admin"}</div>
              <div style={{ fontSize: "0.7rem", color: "#38bdf8" }}>{adminUser.role}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              border: "none",
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
          >
            <i className="fa fa-sign-out" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Container with Sidebar + Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: sidebarOpen ? "250px" : "70px",
            backgroundColor: "#1e293b",
            color: "#cbd5e1",
            transition: "width 0.25s ease",
            overflowX: "hidden",
            boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "1rem 0", flex: 1 }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.75rem 1.25rem",
                    color: isActive ? "#ffffff" : "#94a3b8",
                    backgroundColor: isActive ? "#2563eb" : "transparent",
                    textDecoration: "none",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.9rem",
                    borderLeft: isActive ? "4px solid #60a5fa" : "4px solid transparent",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "#f8fafc";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#94a3b8";
                    }
                  }}
                >
                  <i className={`fa ${item.icon}`} style={{ fontSize: "1.1rem", width: "20px", textAlign: "center" }} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {sidebarOpen && (
            <div
              style={{
                padding: "1rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.75rem",
                color: "#64748b",
                textAlign: "center",
              }}
            >
              RigelSoft Cloud Super Admin v2.0
            </div>
          )}
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: "1.5rem", overflowX: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
