import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Speedometer2,
  CardChecklist,
  People,
  PersonBadge,
  Receipt,
  GraphUp,
  JournalText,
  BoxArrowRight,
  ShieldLock
} from 'react-bootstrap-icons';

export default function SuperAdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('superAdminToken');
    Cookies.remove('superAdminUser');
    navigate('/super-admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/super-admin/dashboard', icon: <Speedometer2 className="me-2" /> },
    { label: 'Subscription Plans', path: '/super-admin/subscription-plans', icon: <CardChecklist className="me-2" /> },
    { label: 'Admin Management', path: '/super-admin/admins', icon: <People className="me-2" /> },
    { label: 'User Management', path: '/super-admin/users', icon: <PersonBadge className="me-2" /> },
    { label: 'Subscriptions', path: '/super-admin/subscriptions', icon: <Receipt className="me-2" /> },
    { label: 'Revenue & Reports', path: '/super-admin/reports', icon: <GraphUp className="me-2" /> },
    { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: <JournalText className="me-2" /> },
  ];

  return (
    <aside className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '260px', minHeight: '100vh', boxShadow: '2px 0 6px rgba(0,0,0,0.15)' }}>
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-2 py-1">
        <ShieldLock size={28} className="text-warning me-2" />
        <span className="fs-5 fw-bold tracking-wide">SUPER ADMIN</span>
      </div>
      <hr className="my-2 border-secondary" />

      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item mb-1" key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center text-white ${isActive ? 'active bg-primary fw-semibold' : 'hover-bg-secondary'}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#0d6efd' : 'transparent',
                borderRadius: '6px',
                padding: '10px 14px',
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <hr className="my-3 border-secondary" />

      <div className="px-2">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2"
        >
          <BoxArrowRight className="me-2" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
