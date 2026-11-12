import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  Search,
  PersonBadge,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        search: search.trim() || undefined,
        status: statusFilter === 'ACTIVE' ? 1 : statusFilter === 'INACTIVE' ? 2 : undefined,
      };
      const res = await superAdminApi.getUsers(params);
      const data = res.data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  return (
    <SuperAdminLayout title="Global User Management">
      {/* FILTER & SEARCH */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3">
          <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search user by name, email, mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="ALL">All User Statuses</option>
                <option value="ACTIVE">Active Users</option>
                <option value="INACTIVE">Inactive Users</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">All Platform Users</h5>
          <span className="badge bg-light text-secondary border">Total Elements: {totalElements}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th scope="col" className="ps-4">User ID</th>
                <th scope="col">User Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Role</th>
                <th scope="col">Parent Admin</th>
                <th scope="col">Admin Status</th>
                <th scope="col">User Status</th>
                <th scope="col">Reason / Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading platform users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const cleanEmail = u.email_id ? u.email_id.split('|')[0] : '-';
                  const cleanMobile = u.mobile_no ? u.mobile_no.split('|')[0] : '-';
                  const cleanAdminEmail = u.adminEmail ? u.adminEmail.split('|')[0] : '-';

                  return (
                    <tr key={u.id}>
                      <td className="ps-4 fw-semibold text-secondary">#{u.id}</td>
                      <td className="fw-bold text-dark">{u.name}</td>
                      <td>
                        <div className="small text-muted">{cleanEmail}</div>
                        <div className="small text-muted">{cleanMobile}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">{u.role}</span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark small">{u.adminName}</div>
                        <div className="text-muted small">{cleanAdminEmail}</div>
                      </td>
                      <td>
                        <span className={`badge ${u.adminStatus === 1 ? 'bg-success' : 'bg-danger'}`}>
                          {u.adminStatus === 1 ? 'ADMIN ACTIVE' : 'ADMIN INACTIVE'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 1 ? 'bg-success' : 'bg-danger'}`}>
                          {u.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="small">
                        {u.disabledReason ? (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-block mb-1">
                            {u.disabledReason}
                          </span>
                        ) : null}
                        <span className="text-muted">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Page {page + 1} of {Math.max(totalPages, 1)} (Total {totalElements} users)
          </small>
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-secondary"
              disabled={page <= 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft /> Previous
            </button>
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
