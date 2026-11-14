import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const SuperAdminProtectedRoute = ({ children }) => {
  const token = Cookies.get("superadmin_token") || localStorage.getItem("superadmin_token");

  if (!token) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
