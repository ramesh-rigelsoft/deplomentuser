import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  People,
  Funnel,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';

export default function SuperAdminAdmins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [subStatusFilter, setSubStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Status toggle confirmation
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    admin: null,
    targetStatus: 1, // 1=active, 2=inactive
    reason: '',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        search: search.trim() || undefined,
        status: statusFilter,
        subStatus: subStatusFilter,
      };
      const res = await superAdminApi.getAdmins(params);
      const data = res.data;
      setAdmins(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load admins', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page, statusFilter, subStatusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchAdmins();
  };

  const promptToggleStatus = (admin) => {
    const targetStatus = admin.status === 1 ? 2 : 1;
    setConfirmModal({
      show: true,
      admin,
      targetStatus,
      reason: '',
    });
  };

  const executeToggleStatus = async () => {
    if (!confirmModal.admin) return;
    try {
      await superAdminApi.toggleAdminStatus(confirmModal.admin.id, {
        status: confirmModal.targetStatus,
        reason: confirmModal.reason,
      });
      setConfirmModal({ show: false, admin: null, targetStatus: 1, reason: '' });
      fetchAdmins();
    } catch (err) {
      alert('Failed to update admin status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <SuperAdminLayout title="Admin User Management">
      {/* FILTER & SEARCH BAR */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3">
          <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="ALL">All Account Status</option>
                <option value="ACTIVE">Active Admins</option>
                <option value="INACTIVE">Inactive Admins</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={subStatusFilter}
                onChange={(e) => {
                  setSubStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="ALL">All Subscriptions</option>
                <option value="ACTIVE">Subscription Active</option>
                <option value="EXPIRED">Subscription Expired / None</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ADMINS TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">Tenant Administrators</h5>
          <span className="badge bg-light text-secondary border">Total: {totalElements}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th scope="col" className="ps-4">Admin ID</th>
                <th scope="col">Name & Contact</th>
                <th scope="col">Subscription Plan</th>
                <th scope="col">Sub Status</th>
                <th scope="col">Duration / Expiry</th>
                <th scope="col">Total Users</th>
                <th scope="col">Admin Status</th>
                <th scope="col" className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading tenant admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No admins matched your search criteria.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const cleanEmail = admin.email_id ? admin.email_id.replace('|admin', '') : '-';
                  const cleanMobile = admin.mobile_no ? admin.mobile_no.replace('|admin', '') : '-';
                  const isActive = admin.status === 1;

                  return (
                    <tr key={admin.id}>
                      <td className="ps-4 fw-semibold text-secondary">#{admin.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{admin.name || 'Unnamed Admin'}</div>
                        <div className="small text-muted">{cleanEmail}</div>
                        <div className="small text-muted">{cleanMobile}</div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {admin.subscriptionPlan || 'No Plan'}
                        </span>
                        <div className="small text-muted mt-1">{admin.subscriptionType || '-'}</div>
                      </td>
                      <td>
                        <span className={`badge ${admin.subscriptionStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {admin.subscriptionStatus}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {admin.subscriptionEndAt ? (
                          <div>
                            <div>Exp: {new Date(admin.subscriptionEndAt).toLocaleDateString()}</div>
                            <span className="text-success fw-semibold">₹{admin.subscriptionAmount?.toLocaleString('en-IN')}</span>
                          </div>
                        ) : (
                          'No expiry'
                        )}
                      </td>
                      <td>
                        <div className="small">
                          <span className="fw-semibold text-dark">{admin.totalUsers}</span> users
                        </div>
                        <div className="small text-muted">
                          <span className="text-success">{admin.activeUsers} act</span> / <span className="text-danger">{admin.inactiveUsers} inact</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => navigate(`/super-admin/admins/${admin.id}`)}
                            className="btn btn-outline-primary"
                            title="View Full Details"
                          >
                            <Eye className="me-1" /> View
                          </button>
                          <button
                            onClick={() => promptToggleStatus(admin)}
                            className={`btn ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            title={isActive ? 'Deactivate Admin' : 'Activate Admin'}
                          >
                            {isActive ? <XCircle /> : <CheckCircle />}
                          </button>
                        </div>
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
            Page {page + 1} of {Math.max(totalPages, 1)} (Total {totalElements} admins)
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

      {/* CONFIRM STATUS MODAL */}
      {confirmModal.show && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {confirmModal.targetStatus === 1 ? 'Activate Admin Account' : 'Deactivate Admin Account'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmModal({ show: false, admin: null, targetStatus: 1, reason: '' })}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to change status of{' '}
                  <strong>{confirmModal.admin?.name}</strong> to{' '}
                  <span className={`fw-bold ${confirmModal.targetStatus === 1 ? 'text-success' : 'text-danger'}`}>
                    {confirmModal.targetStatus === 1 ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  ?
                </p>

                {confirmModal.targetStatus === 2 ? (
                  <div className="alert alert-danger small">
                    <p className="fw-bold mb-1">Impact of Deactivating this Admin:</p>
                    <ul className="mb-0 ps-3">
                      <li>The Admin will be blocked from logging into the portal.</li>
                      <li><strong>All users ({confirmModal.admin?.totalUsers || 0})</strong> under this Admin will automatically be set to <strong>INACTIVE</strong>.</li>
                      <li>Existing user data, branch data, and subscription history remain completely safe.</li>
                    </ul>
                  </div>
                ) : (
                  <div className="alert alert-success small">
                    <p className="fw-bold mb-1">Impact of Reactivating this Admin:</p>
                    <ul className="mb-0 ps-3">
                      <li>The Admin can login immediately.</li>
                      <li>Only users previously disabled due to Admin deactivation will be restored to <strong>ACTIVE</strong>.</li>
                      <li>Users that were manually disabled will stay inactive.</li>
                    </ul>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Reason for Action (Optional audit remark)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Non-payment, Customer request, Reactivation approved"
                    value={confirmModal.reason}
                    onChange={(e) => setConfirmModal({ ...confirmModal, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmModal({ show: false, admin: null, targetStatus: 1, reason: '' })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeToggleStatus}
                  className={`btn ${confirmModal.targetStatus === 1 ? 'btn-success' : 'btn-danger'}`}
                >
                  Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}

