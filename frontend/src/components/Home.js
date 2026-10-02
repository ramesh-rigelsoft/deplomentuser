import React from "react";
import { Link } from "react-router-dom";

/* =========================================================
   INVENTORYPRO — PROFESSIONAL HOME PAGE
   Single File: Home.jsx
========================================================= */

const inventoryData = {
  companyName: "InventoryPro",
  tagline: "Smart Inventory Management System",
  totalProducts: "2,845",
  totalStock: "18,420",
  lowStock: "126",
  outOfStock: "24",
  totalSuppliers: "184",
  totalWarehouses: "08",
  todaySales: "₹1,84,520",
  todayPurchase: "₹2,42,850",
};

const menuItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Inventory", id: "inventory" },
  { label: "Products", id: "products" },
  { label: "Reports", id: "reports" },
];

const partnerLogos = [
  {
    label: "Mobile Shop",
    subtitle: "Mobile Inventory",
    icon: "📱",
    color: "#3b82f6",
  },
  {
    label: "Laptop & Computer",
    subtitle: "Computer Inventory",
    icon: "💻",
    color: "#10b981",
  },
  {
    label: "Electronic Device",
    subtitle: "Electronic Inventory",
    icon: "⚡",
    color: "#8b5cf6",
  },
  {
    label: "Repair Management",
    subtitle: "Service & Repair",
    icon: "🔧",
    color: "#f59e0b",
  },
  {
    label: "Attendance Management",
    subtitle: "Employee Attendance",
    icon: "👥",
    color: "#ef4444",
  },
];

const features = [
  {
    icon: "📦",
    title: "Smart Inventory",
    text: "Track products, quantities and stock movement in real time.",
  },
  {
    icon: "🏢",
    title: "Warehouse Control",
    text: "Manage multiple warehouses and stock locations effortlessly.",
  },
  {
    icon: "🛒",
    title: "Purchase Management",
    text: "Manage suppliers, purchases and incoming stock efficiently.",
  },
  {
    icon: "📈",
    title: "Sales Management",
    text: "Monitor sales, revenue and product performance from one place.",
  },
];

const StatCard = ({ icon, value, title, text, type }) => (
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="ip-stat-card h-100">
      <div className="ip-stat-top">
        <div className={`ip-stat-icon ${type}`}>{icon}</div>

        <span className="ip-live">
          <i />
          Live
        </span>
      </div>

      <div className="ip-stat-value">{value}</div>

      <div className="ip-stat-title">{title}</div>

      <div className="ip-stat-text">{text}</div>
    </div>
  </div>
);

const Home = () => {
  return (
    <>
      <div className="inventory-pro page-scroll">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="ip-topbar">
          <div className="container">
            <div className="ip-topbar-inner">

              <div className="ip-top-left">
                <span className="ip-top-logo">✦</span>

                <span className="desktop-only">
                  SMART INVENTORY MANAGEMENT • BUSINESS SOLUTIONS
                </span>

                <span className="mobile-only">
                  INVENTORYPRO
                </span>
              </div>

              <div className="ip-top-right">
                <span>Support</span>
                <span className="ip-top-divider" />
                <span>Help Center</span>

                <button className="ip-language active">
                  EN
                </button>

                <button className="ip-language">
                  हिं
                </button>
              </div>

            </div>
          </div>
        </div>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="ip-header">

          <div className="container">

            <div className="ip-header-main">

              <div className="ip-brand">

                <div className="ip-brand-icon">
                  📦
                </div>

                <div>
                  <div className="ip-brand-name">
                    ElecroBiz<span>App</span>
                  </div>

                  <div className="ip-brand-tagline">
                    Smart Inventory Management System
                  </div>
                </div>

              </div>


              {/* <div className="ip-admin">

                <div className="ip-admin-avatar">
                  AD
                </div>

                <div>
                  <strong>Admin User</strong>
                  <small>Administrator</small>
                </div>

                <span className="ip-online-dot" />

              </div> */}

            </div>


            {/* NAV */}

            <div className="ip-navbar">

              <nav className="ip-nav">

                {menuItems.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={index === 0 ? "active" : ""}
                  >
                    {item.label}
                  </a>
                ))}

              </nav>

              <Link to="/login" className="ip-login">
                Login
                <span>→</span>
              </Link>

            </div>

          </div>

        </header>


        {/* =====================================================
            HERO
        ===================================================== */}

        <section id="home" className="ip-hero">

          <div className="ip-hero-grid" />
          <div className="ip-hero-glow glow-one" />
          <div className="ip-hero-glow glow-two" />

          <div className="container">

            <div className="row align-items-center g-5">

              <div className="col-lg-7">

                <div className="ip-badge">
                  <span className="ip-badge-dot" />
                  Smart Business Management Platform
                </div>

                <h1 className="ip-hero-title">
                  Take Control of
                  <br />

                  <span>Your Inventory.</span>
                </h1>

                <p className="ip-hero-description">
                  A powerful inventory management platform built to
                  simplify products, stock, warehouses, purchases and
                  sales — all from one intelligent system.
                </p>

                <div className="ip-hero-buttons">

                  <Link
                    to="/login"
                    className="ip-primary-btn"
                  >
                    Get Started
                    <span>→</span>
                  </Link>

                  <a
                    href="#about"
                    className="ip-secondary-btn"
                  >
                    Explore Platform
                  </a>

                </div>


                <div className="ip-trust">

                  <div className="ip-trust-avatars">
                    <span>AD</span>
                    <span>RK</span>
                    <span>MS</span>
                    <span>+</span>
                  </div>

                  <div>
                    <strong>Business ready</strong>
                    <small>
                      Designed for growing businesses
                    </small>
                  </div>

                </div>

              </div>


              {/* DASHBOARD PREVIEW */}

              <div className="col-lg-5">

                <div className="ip-dashboard-wrap">

                  <div className="ip-dashboard-card">

                    <div className="ip-dashboard-header">

                      <div>
                        <small>BUSINESS OVERVIEW</small>
                        <strong>Inventory Dashboard</strong>
                      </div>

                      <div className="ip-dashboard-menu">
                        •••
                      </div>

                    </div>


                    <div className="ip-mini-stats">

                      <div>
                        <span>Total Stock</span>
                        <strong>18,420</strong>
                        <small className="green">
                          ↑ 12.8%
                        </small>
                      </div>

                      <div>
                        <span>Products</span>
                        <strong>2,845</strong>
                        <small className="blue">
                          Active
                        </small>
                      </div>

                    </div>


                    <div className="ip-chart">

                      <div className="ip-chart-label">
                        <span>Stock Movement</span>
                        <small>Last 7 days</small>
                      </div>

                      <div className="ip-bars">

                        <i style={{ height: "40%" }} />
                        <i style={{ height: "58%" }} />
                        <i style={{ height: "47%" }} />
                        <i style={{ height: "73%" }} />
                        <i style={{ height: "61%" }} />
                        <i style={{ height: "88%" }} />
                        <i className="active" style={{ height: "96%" }} />

                      </div>

                      <div className="ip-chart-days">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>

                    </div>


                    <div className="ip-dashboard-bottom">

                      <div>
                        <span className="orange-dot" />
                        Low Stock
                        <strong>126</strong>
                      </div>

                      <div>
                        <span className="red-dot" />
                        Out of Stock
                        <strong>24</strong>
                      </div>

                    </div>

                  </div>


                  <div className="ip-floating-card sales">

                    <div className="ip-floating-icon">
                      ₹
                    </div>

                    <div>
                      <small>Today's Sales</small>
                      <strong>₹1,84,520</strong>
                    </div>

                    <span className="up">
                      +18%
                    </span>

                  </div>


                  <div className="ip-floating-card warehouse">

                    <div className="ip-floating-icon warehouse-icon">
                      ◈
                    </div>

                    <div>
                      <small>Warehouses</small>
                      <strong>08 Active</strong>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="ip-stats">

          <div className="container">

            <div className="ip-section-heading center">

              <span>REAL-TIME OVERVIEW</span>

              <h2>
                Your business at a glance
              </h2>

              <p>
                Monitor your most important inventory metrics
                in one simple dashboard.
              </p>

            </div>

            <div className="row g-4">

              <StatCard
                icon="▦"
                value={inventoryData.totalProducts}
                title="Total Products"
                text="Products registered"
                type="blue"
              />

              <StatCard
                icon="▤"
                value={inventoryData.totalStock}
                title="Total Stock"
                text="Across all warehouses"
                type="green"
              />

              <StatCard
                icon="!"
                value={inventoryData.lowStock}
                title="Low Stock Items"
                text="Requires restocking"
                type="orange"
              />

              <StatCard
                icon="×"
                value={inventoryData.outOfStock}
                title="Out of Stock"
                text="Immediate attention"
                type="red"
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            ABOUT
        ===================================================== */}

        <section id="about" className="ip-about">

          <div className="container">

            <div className="row align-items-center g-5">

              <div className="col-lg-6">

                <div className="ip-section-heading">

                  <span>ABOUT INVENTORYPRO</span>

                  <h2>
                    Everything you need
                    <br />
                    to manage inventory.
                  </h2>

                  <p>
                    InventoryPro brings your complete inventory
                    operation together into one easy-to-use
                    business platform.
                  </p>

                </div>


                <div className="ip-about-list">

                  <div>
                    <span>✓</span>
                    <div>
                      <strong>Real-time stock tracking</strong>
                      <p>
                        Always know what is available,
                        where it is and when to reorder.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span>✓</span>
                    <div>
                      <strong>Complete warehouse control</strong>
                      <p>
                        Manage multiple warehouses and
                        inventory locations with confidence.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span>✓</span>
                    <div>
                      <strong>Powerful business reporting</strong>
                      <p>
                        Make better decisions using clear
                        and useful business insights.
                      </p>
                    </div>
                  </div>

                </div>


                <Link
                  to="/login"
                  className="ip-outline-btn"
                >
                  Explore System
                  <span>→</span>
                </Link>

              </div>


              <div className="col-lg-6">

                <div className="ip-about-visual">

                  <div className="ip-visual-main">

                    <img
                      src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=85"
                      alt="Inventory warehouse"
                    />

                    <div className="ip-visual-overlay" />

                    <div className="ip-visual-content">

                      <span>INVENTORYPRO</span>

                      <strong>
                        Smarter inventory.
                        <br />
                        Better business.
                      </strong>

                    </div>

                  </div>


                  <div className="ip-visual-card">

                    <div className="ip-check">
                      ✓
                    </div>

                    <div>
                      <strong>Inventory Health</strong>
                      <small>Excellent</small>
                    </div>

                    <div className="ip-health">
                      92%
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section id="inventory" className="ip-features">

          <div className="container">

            <div className="ip-section-heading center">

              <span>POWERFUL FEATURES</span>

              <h2>
                Built for modern businesses
              </h2>

              <p>
                Simple tools. Powerful control. Better inventory
                management.
              </p>

            </div>


            <div className="row g-4">

              {features.map((feature, index) => (

                <div
                  className="col-md-6 col-lg-3"
                  key={feature.title}
                >

                  <div className="ip-feature-card">

                    <div className={`ip-feature-number`}>
                      0{index + 1}
                    </div>

                    <div className="ip-feature-icon">
                      {feature.icon}
                    </div>

                    <h3>
                      {feature.title}
                    </h3>

                    <p>
                      {feature.text}
                    </p>

                    <a href="#about">
                      Learn more →
                    </a>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            PRODUCTS / REPORTS CTA
        ===================================================== */}

        <section id="products" className="ip-business">

          <div className="container">

            <div className="ip-business-card">

              <div className="ip-business-glow" />

              <div className="row align-items-center g-4">

                <div className="col-lg-7">

                  <span className="ip-business-label">
                    READY FOR YOUR BUSINESS
                  </span>

                  <h2>
                    One platform.
                    <br />
                    Complete control.
                  </h2>

                  <p>
                    From product management to sales reports,
                    InventoryPro helps you run your inventory
                    operation with clarity and confidence.
                  </p>

                  <Link
                    to="/login"
                    className="ip-white-btn"
                  >
                    Access Dashboard
                    <span>→</span>
                  </Link>

                </div>


                <div className="col-lg-5">

                  <div className="ip-business-metrics">

                    <div>
                      <small>Today's Sales</small>
                      <strong>
                        {inventoryData.todaySales}
                      </strong>
                      <span>↑ 18.4%</span>
                    </div>

                    <div>
                      <small>Today's Purchase</small>
                      <strong>
                        {inventoryData.todayPurchase}
                      </strong>
                      <span className="purple">
                        ↑ 11.2%
                      </span>
                    </div>

                    <div>
                      <small>Total Suppliers</small>
                      <strong>
                        {inventoryData.totalSuppliers}
                      </strong>
                      <span className="blue">
                        Active
                      </span>
                    </div>

                    <div>
                      <small>Warehouses</small>
                      <strong>
                        {inventoryData.totalWarehouses}
                      </strong>
                      <span className="green">
                        Online
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            REPORTS
        ===================================================== */}

        <section id="reports" className="ip-report-section">

          <div className="container">

            <div className="ip-section-heading center">

              <span>BUSINESS INSIGHTS</span>

              <h2>
                Make decisions with confidence
              </h2>

              <p>
                Get a clear picture of your business performance
                with meaningful inventory insights.
              </p>

            </div>


            <div className="ip-report-grid">

              <div className="ip-report-card large">

                <div className="ip-report-head">
                  <div>
                    <small>MONTHLY PERFORMANCE</small>
                    <h3>Sales Overview</h3>
                  </div>

                  <span className="ip-report-pill">
                    +24.8%
                  </span>
                </div>

                <div className="ip-line-chart">

                  <div className="chart-grid">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <svg
                    viewBox="0 0 600 190"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity=".35"
                        />

                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="
                        M0 155
                        C60 145 70 105 130 120
                        C180 132 205 80 255 96
                        C310 115 320 65 370 78
                        C425 92 440 35 490 55
                        C535 72 555 25 600 38
                        L600 190
                        L0 190 Z
                      "
                      fill="url(#chartGradient)"
                    />

                    <path
                      d="
                        M0 155
                        C60 145 70 105 130 120
                        C180 132 205 80 255 96
                        C310 115 320 65 370 78
                        C425 92 440 35 490 55
                        C535 72 555 25 600 38
                      "
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                  </svg>

                </div>

                <div className="ip-months">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>

              </div>


              <div className="ip-report-card">

                <div className="ip-report-head">
                  <div>
                    <small>STOCK STATUS</small>
                    <h3>Inventory Health</h3>
                  </div>
                </div>

                <div className="ip-donut-wrap">

                  <div className="ip-donut">
                    <div>
                      <strong>92%</strong>
                      <span>Healthy</span>
                    </div>
                  </div>

                </div>

                <div className="ip-status-list">

                  <div>
                    <span className="green-dot" />
                    Healthy
                    <strong>1,982</strong>
                  </div>

                  <div>
                    <span className="orange-dot" />
                    Low Stock
                    <strong>126</strong>
                  </div>

                  <div>
                    <span className="red-dot" />
                    Out of Stock
                    <strong>24</strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PARTNERS
        ===================================================== */}

        <section className="ip-partners">

          <div className="container">

            <div className="ip-section-heading center">

              <span>BUSINESS SOLUTIONS</span>

              <h2>
                One system for every business
              </h2>

              <p>
                Flexible management solutions designed for
                different types of businesses.
              </p>

            </div>

          </div>


          <div className="ip-marquee">

            <div className="ip-marquee-track">

              {[...partnerLogos, ...partnerLogos].map(
                (item, index) => (

                  <div
                    className="ip-partner-card"
                    key={index}
                  >

                    <div
                      className="ip-partner-icon"
                      style={{
                        background: `${item.color}12`,
                        color: item.color,
                        borderColor: `${item.color}25`,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <strong>
                        {item.label}
                      </strong>

                      <small>
                        {item.subtitle}
                      </small>
                    </div>

                    <i
                      style={{
                        background: item.color,
                        boxShadow: `0 0 12px ${item.color}`,
                      }}
                    />

                  </div>

                )
              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="ip-footer">

          <div className="ip-footer-glow one" />
          <div className="ip-footer-glow two" />

          <div className="container">

            <div className="ip-footer-main">

              <div className="row g-5">

                <div className="col-lg-4">

                  <div className="ip-footer-brand">

                    <div className="ip-footer-logo">
                      📦
                    </div>

                    <div>
                      <strong>
                        INVENTORY<span>PRO</span>
                      </strong>

                      <small>
                        Smart Inventory Management
                      </small>
                    </div>

                  </div>

                  <p>
                    Powerful inventory management software
                    designed to help businesses control stock,
                    products, warehouses and operations.
                  </p>

                  <div className="ip-footer-social">

                    <a href="#" aria-label="Facebook">
                      f
                    </a>

                    <a href="#" aria-label="Twitter">
                      𝕏
                    </a>

                    <a href="#" aria-label="Instagram">
                      ◎
                    </a>

                    <a href="#" aria-label="YouTube">
                      ▶
                    </a>

                  </div>

                </div>


                <div className="col-6 col-lg-2">

                  <h4>Platform</h4>

                  <a href="#home">Home</a>
                  <a href="#about">About</a>
                  <a href="#inventory">Inventory</a>
                  <a href="#products">Products</a>
                  <a href="#reports">Reports</a>

                </div>


                <div className="col-6 col-lg-3">

                  <h4>Business</h4>

                  <a href="#inventory">
                    Stock Management
                  </a>

                  <a href="#inventory">
                    Warehouse Management
                  </a>

                  <a href="#products">
                    Purchase Management
                  </a>

                  <a href="#products">
                    Sales Management
                  </a>

                  <a href="#reports">
                    Business Reports
                  </a>

                </div>


                <div className="col-lg-3">

                  <h4>Contact</h4>

                  <div className="ip-contact">

                    <div>
                      <span>📍</span>
                      <p>
                        Business Park, Sector 19,
                        Central Business District, India
                      </p>
                    </div>

                    <div>
                      <span>☎</span>
                      <p>
                        +91 98765 43210
                      </p>
                    </div>

                    <div>
                      <span>✉</span>
                      <p>
                        support@inventorypro.com
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            <div className="ip-footer-bottom">

              <span>
                © {new Date().getFullYear()} InventoryPro.
                All rights reserved.
              </span>

              <span>
                Built for smarter businesses.
              </span>

            </div>

          </div>

        </footer>

      </div>


      {/* =====================================================
          ALL CSS — SAME FILE
      ===================================================== */}

      <style>{`

        /* =====================================================
           GLOBAL
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
          background: #f5f9ff;
          color: #0f172a;
        }

        a {
          text-decoration: none;
        }

        button {
          font-family: inherit;
        }

        .inventory-pro {
          overflow-x: hidden;
          background: #f5f9ff;
        }

        .container {
          position: relative;
          z-index: 2;
        }

        .mobile-only {
          display: none;
        }


        /* =====================================================
           TOP BAR
        ===================================================== */

        .ip-topbar {
          background: #06162d;
          color: #b9d5f7;
          font-size: 10px;
          letter-spacing: .5px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .ip-topbar-inner {
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ip-top-left,
        .ip-top-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ip-top-logo {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: white;
          background: #2563eb;
          font-size: 11px;
          box-shadow: 0 4px 12px rgba(37,99,235,.3);
        }

        .ip-top-divider {
          width: 1px;
          height: 13px;
          background: rgba(255,255,255,.14);
        }

        .ip-language {
          border: 1px solid rgba(255,255,255,.12);
          background: transparent;
          color: #94a3b8;
          border-radius: 5px;
          padding: 3px 7px;
          font-size: 9px;
          cursor: pointer;
        }

        .ip-language.active {
          color: white;
          background: #2563eb;
          border-color: #2563eb;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .ip-header {
          background: rgba(255,255,255,.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #e6eef8;
          position: relative;
          z-index: 20;
        }

        .ip-header-main {
          height: 86px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ip-brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .ip-brand-icon {
          width: 49px;
          height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #3b82f6,
              #1d4ed8,
              #0b2545
            );

          box-shadow:
            0 10px 24px rgba(37,99,235,.22);

          font-size: 23px;
        }

        .ip-brand-name {
          color: #071a33;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .ip-brand-name span {
          color: #2563eb;
        }

        .ip-brand-tagline {
          color: #94a3b8;
          font-size: 9px;
          margin-top: 2px;
        }

        .ip-admin {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ip-admin-avatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #bfdbfe
            );

          color: #1d4ed8;
          font-size: 11px;
          font-weight: 900;

          border: 3px solid #eff6ff;
        }

        .ip-admin strong {
          display: block;
          color: #0f172a;
          font-size: 11px;
        }

        .ip-admin small {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          margin-top: 2px;
        }

        .ip-online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }


        /* =====================================================
           NAVIGATION
        ===================================================== */

        .ip-navbar {
          height: 50px;
          border-top: 1px solid #edf2f7;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ip-nav {
          display: flex;
          align-items: center;
          gap: 29px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .ip-nav::-webkit-scrollbar {
          display: none;
        }

        .ip-nav a {
          position: relative;
          padding: 16px 0 15px;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          transition: .25s ease;
        }

        .ip-nav a:hover,
        .ip-nav a.active {
          color: #2563eb;
        }

        .ip-nav a.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          border-radius: 5px;
          background: #2563eb;
        }

        .ip-login {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;

          color: white;
          background:
            linear-gradient(
              135deg,
              #3b82f6,
              #2563eb
            );

          padding: 8px 16px;
          border-radius: 8px;

          font-size: 11px;
          font-weight: 800;

          box-shadow:
            0 7px 18px rgba(37,99,235,.2);

          transition: .25s ease;
        }

        .ip-login:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow:
            0 10px 24px rgba(37,99,235,.3);
        }


        /* =====================================================
           HERO
        ===================================================== */

        .ip-hero {
          position: relative;
          overflow: hidden;
          min-height: 650px;

          display: flex;
          align-items: center;

          color: white;

          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(37,99,235,.35),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #06162d 0%,
              #0b2545 50%,
              #102f56 100%
            );
        }

        .ip-hero-grid {
          position: absolute;
          inset: 0;
          opacity: .12;

          background-image:
            linear-gradient(
              rgba(147,197,253,.25) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(147,197,253,.25) 1px,
              transparent 1px
            );

          background-size: 60px 60px;

          mask-image:
            linear-gradient(
              to right,
              black,
              transparent
            );
        }

        .ip-hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: .3;
          pointer-events: none;
        }

        .glow-one {
          width: 330px;
          height: 330px;
          background: #2563eb;
          right: 4%;
          top: 5%;
        }

        .glow-two {
          width: 240px;
          height: 240px;
          background: #38bdf8;
          left: -100px;
          bottom: -80px;
          opacity: .15;
        }

        .ip-hero .container {
          padding-top: 75px;
          padding-bottom: 75px;
        }

        .ip-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 8px 13px;

          border-radius: 30px;

          color: #bfdbfe;

          background:
            rgba(96,165,250,.08);

          border:
            1px solid rgba(147,197,253,.2);

          font-size: 10px;
          font-weight: 700;
          letter-spacing: .4px;

          backdrop-filter: blur(10px);
        }

        .ip-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 10px #60a5fa;
        }

        .ip-hero-title {
          margin: 22px 0 20px;

          color: white;

          font-size: clamp(
            43px,
            5.5vw,
            70px
          );

          line-height: 1.02;
          font-weight: 900;

          letter-spacing: -3px;
        }

        .ip-hero-title span {
          background:
            linear-gradient(
              90deg,
              #60a5fa,
              #93c5fd,
              #ffffff
            );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ip-hero-description {
          max-width: 590px;

          color: #b9cbe0;

          font-size: 14px;
          line-height: 1.85;

          margin: 0;
        }

        .ip-hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 29px;
        }

        .ip-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;

          padding: 13px 21px;

          border-radius: 9px;

          background: white;
          color: #0b2545;

          font-size: 12px;
          font-weight: 900;

          box-shadow:
            0 12px 30px rgba(0,0,0,.2);

          transition: .3s ease;
        }

        .ip-primary-btn:hover {
          color: #2563eb;
          transform: translateY(-3px);
        }

        .ip-secondary-btn {
          display: inline-flex;
          align-items: center;

          padding: 13px 21px;

          border-radius: 9px;

          color: white;

          border:
            1px solid rgba(255,255,255,.22);

          background:
            rgba(255,255,255,.06);

          font-size: 12px;
          font-weight: 800;

          backdrop-filter: blur(10px);

          transition: .3s ease;
        }

        .ip-secondary-btn:hover {
          color: white;
          background:
            rgba(255,255,255,.12);
          transform: translateY(-3px);
        }

        .ip-trust {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 35px;
        }

        .ip-trust-avatars {
          display: flex;
          align-items: center;
        }

        .ip-trust-avatars span {
          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-left: -6px;

          border-radius: 50%;

          border: 2px solid #0b2545;

          background: #dbeafe;

          color: #1d4ed8;

          font-size: 7px;
          font-weight: 900;
        }

        .ip-trust-avatars span:first-child {
          margin-left: 0;
        }

        .ip-trust-avatars span:nth-child(2) {
          background: #dcfce7;
          color: #15803d;
        }

        .ip-trust-avatars span:nth-child(3) {
          background: #fef3c7;
          color: #b45309;
        }

        .ip-trust-avatars span:last-child {
          background: #2563eb;
          color: white;
        }

        .ip-trust strong {
          display: block;
          font-size: 10px;
        }

        .ip-trust small {
          display: block;
          color: #7891ac;
          font-size: 8px;
          margin-top: 3px;
        }


        /* =====================================================
           DASHBOARD PREVIEW
        ===================================================== */

        .ip-dashboard-wrap {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin-left: auto;
          padding: 30px 25px 30px 10px;
        }

        .ip-dashboard-card {
          position: relative;
          z-index: 2;

          padding: 21px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.98),
              rgba(241,247,255,.97)
            );

          border: 1px solid rgba(255,255,255,.35);

          box-shadow:
            0 30px 70px rgba(0,0,0,.35);
        }

        .ip-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding-bottom: 15px;

          border-bottom: 1px solid #e5edf7;
        }

        .ip-dashboard-header small {
          display: block;

          color: #94a3b8;

          font-size: 7px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .ip-dashboard-header strong {
          display: block;

          margin-top: 4px;

          color: #0b2545;

          font-size: 13px;
        }

        .ip-dashboard-menu {
          color: #94a3b8;
          letter-spacing: 2px;
        }

        .ip-mini-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 15px;
        }

        .ip-mini-stats > div {
          padding: 13px;

          border-radius: 11px;

          background: #f8fbff;

          border: 1px solid #e7eef8;
        }

        .ip-mini-stats span {
          display: block;

          color: #94a3b8;
          font-size: 8px;
        }

        .ip-mini-stats strong {
          display: inline-block;

          margin-top: 5px;

          color: #0b2545;

          font-size: 20px;
          font-weight: 900;
        }

        .ip-mini-stats small {
          margin-left: 5px;
          font-size: 7px;
          font-weight: 800;
        }

        .ip-mini-stats .green {
          color: #10b981;
        }

        .ip-mini-stats .blue {
          color: #2563eb;
        }

        .ip-chart {
          margin-top: 15px;

          padding: 14px;

          border-radius: 13px;

          background: white;

          border: 1px solid #e7eef8;
        }

        .ip-chart-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .ip-chart-label span {
          color: #334155;
          font-size: 9px;
          font-weight: 800;
        }

        .ip-chart-label small {
          color: #94a3b8;
          font-size: 7px;
        }

        .ip-bars {
          height: 95px;

          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 8px;

          padding: 0 5px;
        }

        .ip-bars i {
          display: block;

          width: 22px;

          border-radius: 5px 5px 2px 2px;

          background:
            linear-gradient(
              180deg,
              #bfdbfe,
              #dbeafe
            );

          transition: .3s ease;
        }

        .ip-bars i.active {
          background:
            linear-gradient(
              180deg,
              #60a5fa,
              #2563eb
            );

          box-shadow:
            0 6px 15px rgba(37,99,235,.25);
        }

        .ip-chart-days {
          display: flex;
          justify-content: space-between;
          margin-top: 7px;
          padding: 0 2px;
        }

        .ip-chart-days span {
          color: #94a3b8;
          font-size: 7px;
        }

        .ip-dashboard-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .ip-dashboard-bottom div {
          display: flex;
          align-items: center;
          gap: 5px;

          padding: 10px;

          border-radius: 9px;

          background: #f8fafc;

          color: #64748b;

          font-size: 8px;
        }

        .ip-dashboard-bottom strong {
          margin-left: auto;
          color: #0f172a;
        }

        .orange-dot,
        .red-dot,
        .green-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .orange-dot {
          background: #f59e0b;
        }

        .red-dot {
          background: #ef4444;
        }

        .green-dot {
          background: #10b981;
        }

        .ip-floating-card {
          position: absolute;

          z-index: 5;

          display: flex;
          align-items: center;
          gap: 9px;

          padding: 11px 13px;

          border-radius: 12px;

          background:
            rgba(255,255,255,.97);

          box-shadow:
            0 18px 40px rgba(0,0,0,.22);

          color: #0f172a;
        }

        .ip-floating-card.sales {
          top: 5px;
          left: -5px;
        }

        .ip-floating-card.warehouse {
          right: -5px;
          bottom: 5px;
        }

        .ip-floating-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #eff6ff;
          color: #2563eb;

          font-size: 12px;
          font-weight: 900;
        }

        .warehouse-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .ip-floating-card small {
          display: block;

          color: #94a3b8;

          font-size: 7px;
        }

        .ip-floating-card strong {
          display: block;

          margin-top: 2px;

          font-size: 10px;
        }

        .ip-floating-card .up {
          color: #10b981;

          font-size: 7px;
          font-weight: 900;
        }


        /* =====================================================
           SECTION COMMON
        ===================================================== */

        .ip-section-heading span {
          display: inline-block;

          color: #2563eb;

          font-size: 9px;
          font-weight: 900;

          letter-spacing: 2px;

          padding: 7px 11px;

          border-radius: 30px;

          background: #eff6ff;

          border: 1px solid #dbeafe;
        }

        .ip-section-heading h2 {
          margin: 12px 0 12px;

          color: #071a33;

          font-size: clamp(
            29px,
            4vw,
            42px
          );

          line-height: 1.1;

          font-weight: 900;

          letter-spacing: -1.5px;
        }

        .ip-section-heading p {
          max-width: 650px;

          margin: 0;

          color: #64748b;

          font-size: 13px;

          line-height: 1.8;
        }

        .ip-section-heading.center {
          text-align: center;
          margin-bottom: 43px;
        }

        .ip-section-heading.center p {
          margin-left: auto;
          margin-right: auto;
        }


        /* =====================================================
           STATS
        ===================================================== */

        .ip-stats {
          position: relative;

          padding: 90px 0;

          background:
            linear-gradient(
              180deg,
              #edf5ff,
              #f8fbff
            );
        }

        .ip-stat-card {
          position: relative;

          overflow: hidden;

          padding: 23px;

          border-radius: 17px;

          background: white;

          border: 1px solid #e2ecf8;

          box-shadow:
            0 12px 35px rgba(30,64,175,.055);

          transition: .3s ease;
        }

        .ip-stat-card::before {
          content: "";

          position: absolute;

          left: 0;
          top: 0;

          width: 100%;
          height: 3px;

          background:
            linear-gradient(
              90deg,
              #60a5fa,
              #2563eb
            );
        }

        .ip-stat-card:hover {
          transform: translateY(-6px);

          box-shadow:
            0 22px 45px rgba(30,64,175,.11);
        }

        .ip-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ip-stat-icon {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          font-size: 18px;
          font-weight: 900;
        }

        .ip-stat-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .ip-stat-icon.green {
          background: #ecfdf5;
          color: #059669;
        }

        .ip-stat-icon.orange {
          background: #fff7ed;
          color: #ea580c;
        }

        .ip-stat-icon.red {
          background: #fef2f2;
          color: #dc2626;
        }

        .ip-live {
          display: flex;
          align-items: center;
          gap: 5px;

          padding: 5px 8px;

          border-radius: 30px;

          color: #059669;
          background: #ecfdf5;

          font-size: 8px;
          font-weight: 900;
        }

        .ip-live i {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #10b981;

          box-shadow: 0 0 7px #10b981;
        }

        .ip-stat-value {
          margin-top: 21px;

          color: #071a33;

          font-size: 29px;

          font-weight: 900;

          letter-spacing: -1px;
        }

        .ip-stat-title {
          color: #334155;

          margin-top: 3px;

          font-size: 12px;

          font-weight: 800;
        }

        .ip-stat-text {
          color: #94a3b8;

          margin-top: 5px;

          font-size: 9px;
        }


        /* =====================================================
           ABOUT
        ===================================================== */

        .ip-about {
          padding: 110px 0;

          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(96,165,250,.08),
              transparent 30%
            ),
            white;
        }

        .ip-about-list {
          margin-top: 30px;
        }

        .ip-about-list > div {
          display: flex;
          gap: 13px;

          margin-bottom: 21px;
        }

        .ip-about-list > div > span {
          width: 28px;
          height: 28px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #eff6ff;
          color: #2563eb;

          font-size: 11px;
          font-weight: 900;
        }

        .ip-about-list strong {
          color: #0f172a;

          font-size: 12px;
        }

        .ip-about-list p {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 11px;

          line-height: 1.6;
        }

        .ip-outline-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-top: 12px;

          color: #2563eb;

          padding: 11px 17px;

          border: 1px solid #bfdbfe;

          border-radius: 8px;

          font-size: 11px;
          font-weight: 800;

          transition: .25s ease;
        }

        .ip-outline-btn:hover {
          color: white;
          background: #2563eb;
          border-color: #2563eb;
          transform: translateY(-2px);
        }

        .ip-about-visual {
          position: relative;
          padding: 15px 15px 40px 25px;
        }

        .ip-visual-main {
          position: relative;

          overflow: hidden;

          height: 440px;

          border-radius: 25px;

          box-shadow:
            0 30px 60px rgba(15,23,42,.16);
        }

        .ip-visual-main img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          transition: transform .6s ease;
        }

        .ip-about-visual:hover .ip-visual-main img {
          transform: scale(1.04);
        }

        .ip-visual-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              transparent 25%,
              rgba(7,26,51,.85)
            );
        }

        .ip-visual-content {
          position: absolute;

          left: 28px;
          right: 28px;
          bottom: 27px;

          color: white;
        }

        .ip-visual-content span {
          color: #93c5fd;

          font-size: 8px;
          letter-spacing: 2px;
          font-weight: 900;
        }

        .ip-visual-content strong {
          display: block;

          margin-top: 7px;

          font-size: 25px;
          line-height: 1.15;
          font-weight: 900;
        }

        .ip-visual-card {
          position: absolute;

          right: 0;
          bottom: 0;

          display: flex;
          align-items: center;
          gap: 10px;

          min-width: 235px;

          padding: 14px;

          border-radius: 14px;

          background: white;

          border: 1px solid #e5eef9;

          box-shadow:
            0 15px 40px rgba(15,23,42,.15);
        }

        .ip-check {
          width: 35px;
          height: 35px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #ecfdf5;

          color: #10b981;

          font-size: 13px;
          font-weight: 900;
        }

        .ip-visual-card strong {
          display: block;

          color: #0f172a;

          font-size: 10px;
        }

        .ip-visual-card small {
          display: block;

          color: #10b981;

          font-size: 8px;

          margin-top: 2px;
        }

        .ip-health {
          margin-left: auto;

          color: #2563eb;

          font-size: 17px;
          font-weight: 900;
        }


        /* =====================================================
           FEATURES
        ===================================================== */

        .ip-features {
          padding: 100px 0;

          background:
            #f6faff;
        }

        .ip-feature-card {
          position: relative;

          height: 100%;

          padding: 26px;

          border-radius: 17px;

          background: white;

          border: 1px solid #e1ebf7;

          box-shadow:
            0 10px 30px rgba(30,64,175,.045);

          transition: .3s ease;

          overflow: hidden;
        }

        .ip-feature-card:hover {
          transform: translateY(-6px);

          border-color: #bfdbfe;

          box-shadow:
            0 20px 45px rgba(30,64,175,.1);
        }

        .ip-feature-number {
          position: absolute;

          top: 15px;
          right: 18px;

          color: #e5edf7;

          font-size: 26px;

          font-weight: 900;
        }

        .ip-feature-icon {
          width: 50px;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #dbeafe
            );

          font-size: 22px;
        }

        .ip-feature-card h3 {
          margin: 20px 0 9px;

          color: #0b2545;

          font-size: 15px;
          font-weight: 900;
        }

        .ip-feature-card p {
          margin: 0;

          color: #94a3b8;

          font-size: 11px;

          line-height: 1.75;
        }

        .ip-feature-card a {
          display: inline-block;

          margin-top: 20px;

          color: #2563eb;

          font-size: 10px;
          font-weight: 800;
        }


        /* =====================================================
           BUSINESS CTA
        ===================================================== */

        .ip-business {
          padding: 100px 0;

          background: white;
        }

        .ip-business-card {
          position: relative;

          overflow: hidden;

          padding: 55px;

          border-radius: 25px;

          background:
            radial-gradient(
              circle at 90% 20%,
              rgba(96,165,250,.3),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #071a33,
              #0b2545 60%,
              #16427a
            );

          color: white;

          box-shadow:
            0 25px 65px rgba(7,26,51,.18);
        }

        .ip-business-glow {
          position: absolute;

          width: 300px;
          height: 300px;

          right: -100px;
          bottom: -150px;

          border-radius: 50%;

          background: #2563eb;

          filter: blur(80px);

          opacity: .25;
        }

        .ip-business-label {
          color: #60a5fa;

          font-size: 9px;
          letter-spacing: 2px;

          font-weight: 900;
        }

        .ip-business-card h2 {
          margin: 13px 0;

          font-size: 40px;
          line-height: 1.08;

          font-weight: 900;

          letter-spacing: -1.5px;
        }

        .ip-business-card p {
          max-width: 530px;

          color: #a9c0d9;

          font-size: 12px;

          line-height: 1.8;
        }

        .ip-white-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-top: 15px;

          padding: 12px 19px;

          border-radius: 8px;

          color: #0b2545;
          background: white;

          font-size: 11px;
          font-weight: 900;

          transition: .3s ease;
        }

        .ip-white-btn:hover {
          color: #2563eb;
          transform: translateY(-2px);
        }

        .ip-business-metrics {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 10px;
        }

        .ip-business-metrics > div {
          padding: 17px;

          border-radius: 13px;

          background:
            rgba(255,255,255,.07);

          border:
            1px solid rgba(255,255,255,.09);

          backdrop-filter: blur(10px);
        }

        .ip-business-metrics small {
          display: block;

          color: #8ca9c6;

          font-size: 8px;
        }

        .ip-business-metrics strong {
          display: block;

          margin-top: 5px;

          color: white;

          font-size: 17px;
        }

        .ip-business-metrics span {
          display: block;

          margin-top: 5px;

          color: #34d399;

          font-size: 8px;

          font-weight: 800;
        }

        .ip-business-metrics span.purple {
          color: #c4b5fd;
        }

        .ip-business-metrics span.blue {
          color: #60a5fa;
        }

        .ip-business-metrics span.green {
          color: #34d399;
        }


        /* =====================================================
           REPORT
        ===================================================== */

        .ip-report-section {
          padding: 100px 0;

          background:
            linear-gradient(
              180deg,
              #f7fbff,
              #eef6ff
            );
        }

        .ip-report-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.5fr)
            minmax(300px, .8fr);

          gap: 20px;
        }

        .ip-report-card {
          padding: 25px;

          border-radius: 18px;

          background: white;

          border: 1px solid #dfebf8;

          box-shadow:
            0 12px 35px rgba(30,64,175,.06);
        }

        .ip-report-head {
          display: flex;

          justify-content: space-between;
          align-items: flex-start;
        }

        .ip-report-head small {
          color: #94a3b8;

          font-size: 7px;

          letter-spacing: 1.5px;

          font-weight: 900;
        }

        .ip-report-head h3 {
          margin: 5px 0 0;

          color: #0b2545;

          font-size: 15px;
          font-weight: 900;
        }

        .ip-report-pill {
          padding: 5px 8px;

          border-radius: 20px;

          color: #059669;

          background: #ecfdf5;

          font-size: 8px;
          font-weight: 900;
        }

        .ip-line-chart {
          position: relative;

          height: 220px;

          margin-top: 25px;
        }

        .chart-grid {
          position: absolute;

          inset: 0;

          display: flex;

          flex-direction: column;

          justify-content: space-between;
        }

        .chart-grid span {
          height: 1px;

          background: #edf2f7;
        }

        .ip-line-chart svg {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;
        }

        .ip-months {
          display: flex;

          justify-content: space-between;

          color: #94a3b8;

          font-size: 8px;

          margin-top: 5px;
        }

        .ip-donut-wrap {
          display: flex;

          align-items: center;
          justify-content: center;

          padding: 25px 0 20px;
        }

        .ip-donut {
          width: 155px;
          height: 155px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            conic-gradient(
              #2563eb 0 92%,
              #e5edf7 92% 100%
            );

          position: relative;
        }

        .ip-donut::before {
          content: "";

          position: absolute;

          width: 112px;
          height: 112px;

          border-radius: 50%;

          background: white;
        }

        .ip-donut > div {
          position: relative;
          z-index: 2;

          text-align: center;
        }

        .ip-donut strong {
          display: block;

          color: #0b2545;

          font-size: 27px;
          font-weight: 900;
        }

        .ip-donut span {
          color: #94a3b8;

          font-size: 8px;
        }

        .ip-status-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ip-status-list div {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #64748b;

          font-size: 9px;
        }

        .ip-status-list strong {
          margin-left: auto;

          color: #0f172a;
        }


        /* =====================================================
           PARTNERS
        ===================================================== */

        .ip-partners {
          padding: 100px 0 80px;

          background: white;
        }

        .ip-marquee {
          width: 100%;

          overflow: hidden;

          margin-top: 20px;

          mask-image:
            linear-gradient(
              90deg,
              transparent,
              black 8%,
              black 92%,
              transparent
            );
        }

        .ip-marquee-track {
          width: max-content;

          display: flex;

          gap: 15px;

          animation:
            ipMarquee 32s linear infinite;
        }

        .ip-marquee:hover
        .ip-marquee-track {
          animation-play-state: paused;
        }

        .ip-partner-card {
          width: 245px;
          min-width: 245px;

          height: 78px;

          display: flex;
          align-items: center;

          gap: 12px;

          padding: 12px 15px;

          border-radius: 15px;

          background: #f8fbff;

          border: 1px solid #e3edf8;

          transition: .3s ease;
        }

        .ip-partner-card:hover {
          background: white;

          border-color: #bfdbfe;

          box-shadow:
            0 12px 30px rgba(30,64,175,.08);
        }

        .ip-partner-icon {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid;

          border-radius: 12px;

          font-size: 20px;
        }

        .ip-partner-card strong {
          display: block;

          color: #0f172a;

          font-size: 11px;
          font-weight: 900;
        }

        .ip-partner-card small {
          display: block;

          margin-top: 4px;

          color: #94a3b8;

          font-size: 7px;

          text-transform: uppercase;

          letter-spacing: .7px;
        }

        .ip-partner-card > i {
          width: 6px;
          height: 6px;

          margin-left: auto;

          border-radius: 50%;
        }

        @keyframes ipMarquee {

          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }

        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .ip-footer {
          position: relative;

          overflow: hidden;

          color: white;

          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(37,99,235,.2),
              transparent 25%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(56,189,248,.12),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #06162d,
              #071a33,
              #0b2545
            );
        }

        .ip-footer-glow {
          position: absolute;

          border-radius: 50%;

          filter: blur(90px);

          pointer-events: none;
        }

        .ip-footer-glow.one {
          width: 250px;
          height: 250px;

          left: -120px;
          top: 100px;

          background: #2563eb;

          opacity: .15;
        }

        .ip-footer-glow.two {
          width: 250px;
          height: 250px;

          right: -100px;
          bottom: 0;

          background: #38bdf8;

          opacity: .1;
        }

        .ip-footer-main {
          padding: 80px 0 55px;
        }

        .ip-footer-brand {
          display: flex;

          align-items: center;

          gap: 11px;
        }

        .ip-footer-logo {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #3b82f6,
              #2563eb
            );

          box-shadow:
            0 8px 20px rgba(37,99,235,.25);
        }

        .ip-footer-brand strong {
          display: block;

          font-size: 16px;

          letter-spacing: 1px;
        }

        .ip-footer-brand strong span {
          color: #60a5fa;
        }

        .ip-footer-brand small {
          display: block;

          margin-top: 3px;

          color: #7891ac;

          font-size: 8px;
        }

        .ip-footer-main > .container p,
        .ip-footer-main p {
          color: #8199b2;

          font-size: 11px;

          line-height: 1.8;
        }

        .ip-footer-brand + p {
          max-width: 350px;

          margin-top: 18px;
        }

        .ip-footer-main h4 {
          margin: 0 0 18px;

          color: white;

          font-size: 12px;

          font-weight: 900;
        }

        .ip-footer-main a {
          display: block;

          width: max-content;

          margin-bottom: 11px;

          color: #8199b2;

          font-size: 10px;

          transition: .2s ease;
        }

        .ip-footer-main a:hover {
          color: #60a5fa;

          transform: translateX(3px);
        }

        .ip-footer-social {
          display: flex;

          gap: 7px;

          margin-top: 20px;
        }

        .ip-footer-social a {
          width: 31px;
          height: 31px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0;

          border-radius: 8px;

          color: white;

          background:
            rgba(255,255,255,.06);

          border:
            1px solid rgba(255,255,255,.08);

          font-size: 10px;
        }

        .ip-footer-social a:hover {
          color: white;

          background: #2563eb;

          transform: translateY(-3px);
        }

        .ip-contact > div {
          display: flex;

          gap: 9px;

          margin-bottom: 13px;
        }

        .ip-contact span {
          width: 20px;
        }

        .ip-contact p {
          margin: 0;

          font-size: 10px;
        }

        .ip-footer-bottom {
          display: flex;

          justify-content: space-between;

          gap: 20px;

          padding: 17px 0;

          border-top:
            1px solid rgba(255,255,255,.07);

          color: #536d88;

          font-size: 9px;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 991px) {

          .ip-admin {
            display: none;
          }

          .ip-hero {
            min-height: auto;
          }

          .ip-hero .container {
            padding-top: 65px;
            padding-bottom: 80px;
          }

          .ip-dashboard-wrap {
            margin: 15px auto 0;
          }

          .ip-about {
            padding: 80px 0;
          }

          .ip-about-visual {
            max-width: 600px;
            margin: 0 auto;
          }

          .ip-business-card {
            padding: 40px;
          }

          .ip-report-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 767px) {

          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: inline;
          }

          .ip-top-right > span:not(.ip-top-divider) {
            display: none;
          }

          .ip-topbar-inner {
            height: 34px;
          }

          .ip-header-main {
            height: 72px;
          }

          .ip-brand-icon {
            width: 43px;
            height: 43px;
            font-size: 20px;
          }

          .ip-brand-name {
            font-size: 16px;
          }

          .ip-brand-tagline {
            font-size: 7px;
          }

          .ip-navbar {
            height: 48px;
          }

          .ip-nav {
            gap: 21px;
          }

          .ip-nav a {
            font-size: 10px;
          }

          .ip-login {
            padding: 7px 12px;
            font-size: 9px;
          }

          .ip-hero-title {
            font-size: 43px;
            letter-spacing: -2px;
          }

          .ip-hero-description {
            font-size: 12px;
          }

          .ip-dashboard-wrap {
            padding-left: 0;
            padding-right: 0;
          }

          .ip-floating-card.sales {
            left: -5px;
          }

          .ip-floating-card.warehouse {
            right: -5px;
          }

          .ip-stats,
          .ip-features,
          .ip-report-section,
          .ip-partners {
            padding: 70px 0;
          }

          .ip-about {
            padding: 70px 0;
          }

          .ip-business {
            padding: 70px 0;
          }

          .ip-business-card {
            padding: 30px 22px;
          }

          .ip-business-card h2 {
            font-size: 31px;
          }

          .ip-business-metrics {
            margin-top: 15px;
          }

          .ip-visual-main {
            height: 360px;
          }

          .ip-footer-main {
            padding: 65px 0 45px;
          }

          .ip-footer-bottom {
            flex-direction: column;
          }

        }


        @media (max-width: 480px) {

          .ip-topbar {
            font-size: 8px;
          }

          .ip-top-right {
            gap: 6px;
          }

          .ip-brand-tagline {
            display: none;
          }

          .ip-hero .container {
            padding-top: 50px;
          }

          .ip-hero-title {
            font-size: 38px;
          }

          .ip-hero-buttons {
            flex-direction: column;
          }

          .ip-primary-btn,
          .ip-secondary-btn {
            justify-content: center;
            width: 100%;
          }

          .ip-dashboard-card {
            padding: 15px;
          }

          .ip-dashboard-bottom {
            grid-template-columns: 1fr;
          }

          .ip-floating-card {
            transform: scale(.86);
          }

          .ip-floating-card.sales {
            left: -20px;
          }

          .ip-floating-card.warehouse {
            right: -20px;
          }

          .ip-feature-card {
            padding: 22px;
          }

          .ip-business-metrics {
            grid-template-columns: 1fr;
          }

          .ip-visual-card {
            min-width: 205px;
          }

          .ip-visual-main {
            height: 320px;
          }

        }

      `}</style>
    </>
  );
};

export default Home;
