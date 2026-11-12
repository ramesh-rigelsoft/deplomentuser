import React from 'react';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';

export default function SuperAdminLayout({ title, children }) {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <SuperAdminSidebar />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0, overflowX: 'hidden' }}>
        <SuperAdminHeader title={title} />
        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
}

