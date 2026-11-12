import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  JournalText,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';

export default function SuperAdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getAuditLogs({ page, size: pageSize });
      const data = res.data;
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize]);

  return (
    <SuperAdminLayout title="Security & Audit Logs">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">Super Admin Audit Trail</h5>
          <span className="badge bg-light text-secondary border">Total Events: {totalElements}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th scope="col" className="ps-4">Log ID</th>
                <th scope="col">Action</th>
                <th scope="col">Target</th>
                <th scope="col">Entity ID</th>
                <th scope="col">Old Value</th>
                <th scope="col">New Value</th>
                <th scope="col">Remarks / Reason</th>
                <th scope="col">IP Address</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    No audit records registered yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="ps-4 fw-semibold text-secondary">#{log.id}</td>
                    <td>
                      <span className="badge bg-dark">{log.action}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">{log.targetType}</span>
                    </td>
                    <td className="font-monospace small">{log.targetId || '-'}</td>
                    <td className="small text-muted" style={{ maxWidth: '160px', wordBreak: 'break-all' }}>
                      {log.oldValue || '-'}
                    </td>
                    <td className="small text-muted" style={{ maxWidth: '160px', wordBreak: 'break-all' }}>
                      {log.newValue || '-'}
                    </td>
                    <td className="small">{log.remarks || '-'}</td>
                    <td className="small font-monospace text-muted">{log.ipAddress || '-'}</td>
                    <td className="small text-muted">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="card-footer bg-white py-3 border-0 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">
              Showing page <strong>{page + 1}</strong> of <strong>{Math.max(totalPages, 1)}</strong> (Total <strong>{totalElements}</strong> logs)
            </small>
            <span className="text-muted small">| Rows per page:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: '80px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPage(0);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary"
              disabled={page <= 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft /> Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              const pageIdx = totalPages > 5 && page > 2 ? Math.min(page - 2 + idx, totalPages - 1) : idx;
              return (
                <button
                  key={pageIdx}
                  className={`btn ${page === pageIdx ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setPage(pageIdx)}
                >
                  {pageIdx + 1}
                </button>
              );
            })}
            <button
              className="btn btn-outline-secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}

