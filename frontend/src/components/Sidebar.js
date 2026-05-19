import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getLocal, activeTabs } from "../security/Auth.js";
import { Button } from "react-bootstrap";
import {success,fail} from "../redux/WebTostar"
import "../css/Sidebar.css";
import { navigateTo } from '../components/navigationService';
import Cookies from "js-cookie";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBox,
  faUserPlus,
  faArrowUp,
  faClipboard,
  faWallet,
  faSignOutAlt,
  faFileCirclePlus,
  faCashRegister,
  faShoppingCart,
  faArrowUpRightFromSquare,
  faGauge,
  faCog,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";


const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const getActiveTabs = getLocal("tab");
  const [activeTab, setActiveTab] = useState(getActiveTabs===null?"dashboard":getActiveTabs);
  const savedCompanyName = Cookies.get("companyName");

  const handleClick = (tab) => {
    setActiveTab(tab);
    activeTabs(tab);
   
  };

 const logout = () => {
    Cookies.remove("secret");
    Cookies.remove("fileName");
    Cookies.remove("secretCode");  
    Cookies.remove("user");
    Cookies.remove("tab");
    Cookies.remove("username");
    Cookies.remove("companyName");
    Cookies.remove("token");
};
  const tabs = [
    { tab: "dashboard", label: "Dashboard", path: "/dashboard", icon: faTachometerAlt},
    { tab: "inventory", label: "Inventory", path: "/inventory", icon: faBox },
    { tab: "addMobile", label: "Entry", path: "/addMobile", icon: faFileCirclePlus},
    { tab: "outbound", label: "Sales", path: "/outbound", icon: faArrowUpRightFromSquare},
    { tab: "addVender", label: "Vendor", path: "/addVender", icon: faUserPlus },
    { tab: "ShopExpenseD", label: "Expense", path: "/ShopExpense", icon: faWallet },
    // { tab: "empManagementD", label: "Employee", path: "/empManagement", icon: faWallet },
    { tab: "summaryReport", label: "Summary Report", path: "/summaryReport", icon: faClipboard },
    // { tab: "accountSetting", label: "Setting", path: "/accountSetting", icon: faCog },
 
  ];

  return (
    <div className="bg-info">
      {/* 🔹 Mobile Toggle */}
      <div className="d-md-none text-white p-2">
        <Button
          variant="light"
          size="sm"
          onClick={() => setOpen(!open)}
          className="fw-semibold"
        >
          ☰ Menu
        </Button>
      </div>

      {/* 🔹 Sidebar */}
      <div
        className={`sidebar-container ${
          open ? "d-flex" : "d-none"
        } d-md-flex flex-column justify-content-between shadow-lg`}
      >
        {/* 🔹 Logo Section */}
        <div className="text-center py-4 border-bottom border-light">
          <h4 className="fw-bold text-white mb-0">
            <FontAwesomeIcon icon={faBox} className="me-2 text-warning" />
            <span className="text-light">{savedCompanyName||"Your Shop Name"}</span>
          </h4>
        </div>

        {/* 🔹 Navigation Tabs */}
        <nav className="flex-grow-1 mt-3">
          <ul className="nav flex-column px-3">
            {tabs.map(({ tab, label, path, icon }) => (
              <li key={tab} className="nav-item my-1">
                <Link
                  to={path}
                  onClick={() => handleClick(tab)}
                  className={`nav-link d-flex align-items-center px-3 py-2 rounded-3 ${
                    activeTab === tab
                      ? "active-link bg-light text-primary shadow-sm"
                      : "text-white-50"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className={`me-3 fs-5 ${activeTab === tab ? "text-primary" : "text-white"}`}
                  />
                  <span className={`fw-semibold ${activeTab === tab ? "text-primary" : "text-white"}`}>
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 🔹 Footer / Logout */}
        <div className="sidebar-footer text-center py-4 border-top border-light">
          <Button
            variant="light"
            className="fw-semibold text-primary px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center justify-content-center"
            onClick={() => {
               logout();
              success("Logout Successfully.");
              navigateTo('/login');
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2 fs-5" /> Logout
          </Button>
          <p className="small text-white-50 mt-3 mb-0">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
