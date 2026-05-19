import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../redux/API";
import { useDispatch, useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");

  if (token==null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;