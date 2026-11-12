import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  ArrowLeft,
  PersonBadge,
  Receipt,
  People,
  CheckCircle,
  XCircle,
  ClockHistory
} from 'react-bootstrap-icons';

export default function SuperAdminAdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('USERS'); // USERS or SUBSCRIPTIONS

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getAdminById(id);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <SuperAdminLayout title="Admin Details">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading administrator profile...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  const admin = data?.admin;
  const users = data?.users || [];
  const subscriptions = data?.subscriptionHistory || [];

  const cleanEmail = admin?.email_id ? admin.email_id.replace('|admin', '') : '-';
  const cleanMobile = admin?.mobile_no ? admin.mobile_no.replace('|admin', '') : '-';

  return (
    <SuperAdminLayout title={`Admin: ${admin?.name || 'Details'}`}>
      <div className="mb-3">
        <button onClick={() => navigate('/super-admin/admins')} className="btn btn-outline-secondary btn-sm">
          <ArrowLeft className="me-1" /> Back to Admins List
        </button>
      </div>

      {/* ADMIN INFO CARD */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <h4 className="fw-bold mb-0 text-dark">{admin?.name}</h4>
                <span className={`badge ${admin?.status === 1 ? 'bg-success' : 'bg-danger'}`}>
                  {admin?.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <span className="badge bg-light text-secondary border">ID #{admin?.id}</span>
              </div>

              <div className="row g-2 text-muted small mt-2">
                <div className="col-12 col-sm-6">
                  <span className="fw-semibold">Email: </span>
                  <span>{cleanEmail}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="fw-semibold">Mobile: </span>
                  <span>{cleanMobile}</span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="fw-semibold">Subscription Code: </span>
                  <span className="badge bg-light text-primary border font-monospace">
                    {admin?.subscriptionCode || '-'}
                  </span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="fw-semibold">Total Users: </span>
                  <span>{admin?.totalUsers || 0} ({admin?.activeUsers || 0} active, {admin?.inactiveUsers || 0} inactive)</span>
                </div>
                <div className="col-12 col-sm-6">
                  <span className="fw-semibold">Created At: </span>
                  <span>{admin?.created_at ? new Date(admin.created_at).toLocaleString() : '-'}</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4 border-start-md">
              <div className="p-3 bg-light rounded shadow-sm">
                <span className="text-muted small fw-semibold text-uppercase d-block mb-2">Current Subscription</span>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark fs-5">{admin?.subscriptionPlan || 'No Plan'}</span>
                  <span className={`badge ${admin?.subscriptionStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                    {admin?.subscriptionStatus}
                  </span>
                </div>
                <div className="small mb-1">
                  <span className="fw-semibold text-dark">Plan Code: </span>
                  <span className="badge bg-primary text-white font-monospace fw-bold px-2 py-1 ms-1">
                    {admin?.subscriptionCode || '-'}
                  </span>
                </div>
                <div className="small text-muted mb-1">
                  <span className="fw-semibold text-dark">Billing: </span>
                  <span>{admin?.subscriptionType || '-'}</span>
                </div>
                {admin?.subscriptionEndAt && (
                  <div className="small text-muted">
                    <span className="fw-semibold text-dark">Expires: </span>
                    <span>{new Date(admin.subscriptionEndAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'USERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('USERS')}
          >
            <People className="me-2" />
            Users Under Admin ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'SUBSCRIPTIONS' ? 'active' : ''}`}
            onClick={() => setActiveTab('SUBSCRIPTIONS')}
          >
            <ClockHistory className="me-2" />
            Subscription History ({subscriptions.length})
          </button>
        </li>
      </ul>

      {/* TAB CONTENT: USERS */}
      {activeTab === 'USERS' && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th scope="col" className="ps-4">User ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Disabled Reason</th>
                  <th scope="col">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No sub-users created under this Admin yet.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 fw-semibold text-secondary">#{u.id}</td>
                      <td className="fw-bold text-dark">{u.name}</td>
                      <td className="text-muted small">{u.email_id}</td>
                      <td className="text-muted small">{u.mobile_no}</td>
                      <td>
                        <span className="badge bg-light text-secondary border">{u.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 1 ? 'bg-success' : 'bg-danger'}`}>
                          {u.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="small text-danger fw-semibold">
                        {u.disabledReason || '-'}
                      </td>
                      <td className="small text-muted">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUBSCRIPTIONS */}
      {activeTab === 'SUBSCRIPTIONS' && (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th scope="col" className="ps-4">Order ID</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Code</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Payment Status</th>
                  <th scope="col">Sub Status</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No subscription transactions on record.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td className="ps-4 font-monospace small">
                        {s.razorpayOrderId || `ORD-${s.id}`}
                      </td>
                      <td className="fw-bold text-dark">{s.subscriptionName}</td>
                      <td>
                        <span className="badge bg-light text-primary border font-monospace">
                          {s.subscriptionCode || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">{s.subscriptionType}</span>
                      </td>
                      <td className="fw-semibold text-success">
                        ₹{s.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="small text-muted">{s.subscriptionDuration || 30} days</td>
                      <td>
                        <span className={`badge ${s.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {s.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${s.subscriptionStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {s.subscriptionStatus}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}

