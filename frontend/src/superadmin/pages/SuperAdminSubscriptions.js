import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  Search,
  Receipt,
  Download,
  Funnel,
  ChevronLeft,
  ChevronRight,
  CurrencyRupee
} from 'react-bootstrap-icons';

export default function SuperAdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [billingType, setBillingType] = useState('ALL');
  const [subStatus, setSubStatus] = useState('ALL');
  const [payStatus, setPayStatus] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        search: search.trim() || undefined,
        billingType,
        subStatus,
        payStatus,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };
      const res = await superAdminApi.getSubscriptions(params);
      const data = res.data;
      setSubscriptions(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page, pageSize, billingType, subStatus, payStatus]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchSubscriptions();
  };

  return (
    <SuperAdminLayout title="Subscription & Transaction Management">
      {/* FILTER CONTROLS */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3">
          <form onSubmit={handleFilterSubmit} className="row g-2 align-items-center">
            <div className="col-12 col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Admin, Plan, Order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={billingType}
                onChange={(e) => {
                  setBillingType(e.target.value);
                  setPage(0);
                }}
              >
                <option value="ALL">All Billing</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARILY">Yearly</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={subStatus}
                onChange={(e) => {
                  setSubStatus(e.target.value);
                  setPage(0);
                }}
              >
                <option value="ALL">All Sub Status</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <input
                type="date"
                className="form-control form-control-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-2">
              <input
                type="date"
                className="form-control form-control-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-1">
              <button type="submit" className="btn btn-primary w-100">
                Filter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-dark">Tenant Subscriptions</h5>
          <span className="badge bg-light text-secondary border">Total: {totalElements}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase">
              <tr>
                <th scope="col" className="ps-4">ID / Order</th>
                <th scope="col">Admin Tenant</th>
                <th scope="col">Plan Name</th>
                <th scope="col">Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Payment Status</th>
                <th scope="col">Sub Status</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => {
                  const cleanAdminEmail = sub.adminEmail ? sub.adminEmail.split('|')[0] : '-';
                  return (
                    <tr key={sub.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">#{sub.id}</div>
                        <div className="small font-monospace text-muted">{sub.razorpayOrderId || '-'}</div>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{sub.adminName}</div>
                        <div className="small text-muted">{cleanAdminEmail}</div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {sub.subscriptionName}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">{sub.subscriptionType}</span>
                      </td>
                      <td className="fw-bold text-success">
                        ₹{sub.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`badge ${sub.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {sub.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${sub.subscriptionStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {sub.subscriptionStatus}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {sub.subscriptionStartAt ? new Date(sub.subscriptionStartAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="small text-muted">
                        {sub.subscriptionEndAt ? new Date(sub.subscriptionEndAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="card-footer bg-white py-3 border-0 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">
              Showing page <strong>{page + 1}</strong> of <strong>{Math.max(totalPages, 1)}</strong> (Total <strong>{totalElements}</strong> subscriptions)
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

