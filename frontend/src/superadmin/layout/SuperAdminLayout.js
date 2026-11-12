import React from 'react';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';

export default function SuperAdminLayout({ title, children }) {
  return (
    <div
      className="d-flex"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#f4f6f9',
      }}
    >
      <SuperAdminSidebar />
      <div
        className="d-flex flex-column flex-grow-1"
        style={{
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <SuperAdminHeader title={title} />
        <main className="p-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
}


