import React from 'react';
import Cookies from 'js-cookie';
import { PersonCircle } from 'react-bootstrap-icons';

export default function SuperAdminHeader({ title }) {
  let user = { name: 'Super Admin', email: 'superadmin@rigelsoft.com' };
  try {
    const raw = Cookies.get('superAdminUser');
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    // ignore
  }

  return (
    <header className="d-flex justify-content-between align-items-center py-3 px-4 bg-white border-bottom shadow-sm">
      <div>
        <h4 className="mb-0 fw-bold text-dark">{title || 'Super Admin Console'}</h4>
        <small className="text-muted">Rigel Electronic Cloud SaaS Management</small>
      </div>

      <div className="d-flex align-items-center">
        <span className="badge bg-warning text-dark me-3 px-2 py-1 fw-bold">
          SUPER_ADMIN
        </span>
        <div className="d-flex align-items-center text-end me-2">
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{user.name || 'System Admin'}</div>
            <div className="text-muted" style={{ fontSize: '12px' }}>{user.email || 'superadmin@rigelsoft.com'}</div>
          </div>
          <PersonCircle size={32} className="text-secondary ms-2" />
        </div>
      </div>
    </header>
  );
}
