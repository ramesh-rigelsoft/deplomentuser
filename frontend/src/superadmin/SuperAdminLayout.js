import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";
import { useTranslation } from "../i18n";

const SuperAdminLayout = ({ children }) => {
  const { t, currentLanguage, availableLanguages, changeLanguage } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 992 : false);
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== "undefined" ? window.innerWidth >= 992 : true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const storedUserStr = localStorage.getItem("superadmin_user");
  const adminUser = storedUserStr ? JSON.parse(storedUserStr) : { name: "Super Admin", role: "SUPERADMIN" };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      path: "/superadmin/languages",
      label: "Language Management",
      icon: "fa-language",
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", display: "flex", flexDirection: "column", width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: isMobile ? "0.6rem 0.85rem" : "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1020,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.25rem",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
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
                padding: "0.2rem 0.5rem",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
              }}
            >
              SUPER ADMIN
            </span>
            {!isMobile && (
              <span style={{ fontWeight: 600, fontSize: "1.05rem", color: "#f8fafc", whiteSpace: "nowrap" }}>
                RigelSoft Portal
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "0.6rem" : "1.25rem" }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#94a3b8", fontSize: "0.85rem" }}>
              <i className="fa fa-clock-o" />
              <span>{currentTime}</span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "rgba(255,255,255,0.08)",
              padding: "0.3rem 0.65rem",
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
                fontSize: "0.8rem",
                flexShrink: 0,
              }}
            >
              {(adminUser.username || "SA").substring(0, 2).toUpperCase()}
            </div>
            {!isMobile && (
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{adminUser.name || "Super Admin"}</div>
                <div style={{ fontSize: "0.7rem", color: "#38bdf8" }}>{adminUser.role}</div>
              </div>
            )}
          </div>

          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            style={{
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "6px",
              padding: isMobile ? "0.3rem 0.4rem" : "0.35rem 0.65rem",
              fontSize: "0.82rem",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {availableLanguages.map((l) => (
              <option key={l.code} value={l.code} style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                🌐 {l.nativeName || l.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              border: "none",
              padding: isMobile ? "0.35rem 0.65rem" : "0.4rem 0.85rem",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
          >
            <i className="fa fa-sign-out" />
            {!isMobile && <span>{t("logout", "Logout")}</span>}
          </button>
        </div>
      </nav>

      {/* Main Container with Sidebar + Content */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Mobile Backdrop */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(2px)",
              zIndex: 1040,
            }}
          />
        )}

        {/* Sidebar */}
        <aside
          style={{
            position: isMobile ? "fixed" : "static",
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: isMobile ? 1050 : 1,
            width: isMobile ? "260px" : (sidebarOpen ? "250px" : "70px"),
            backgroundColor: "#1e293b",
            color: "#cbd5e1",
            transition: "all 0.25s ease",
            overflowX: "hidden",
            boxShadow: isMobile ? "4px 0 25px rgba(0,0,0,0.3)" : "2px 0 8px rgba(0,0,0,0.06)",
            display: isMobile && !sidebarOpen ? "none" : "flex",
            flexDirection: "column",
            minHeight: isMobile ? "100vh" : "auto",
          }}
        >
          {isMobile && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontWeight: "bold", color: "#f8fafc", fontSize: "0.95rem" }}>Navigation Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>
          )}

          <div style={{ padding: "0.75rem 0", flex: 1 }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (isMobile) setSidebarOpen(false);
                  }}
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
                  {(sidebarOpen || isMobile) && <span>{t(item.label)}</span>}
                </Link>
              );
            })}
          </div>

          {(sidebarOpen || isMobile) && (
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
        <main style={{ flex: 1, padding: isMobile ? "1rem 0.75rem" : "1.5rem", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
