import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function SuperAdminProtectedRoute({ children }) {
  const token = Cookies.get('superAdminToken');
  const userStr = Cookies.get('superAdminUser');

  if (!token || !userStr) {
    return <Navigate to="/super-admin/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'SUPER_ADMIN') {
      return <Navigate to="/super-admin/login" replace />;
    }
  } catch (e) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
}
