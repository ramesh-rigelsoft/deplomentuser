import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  GraphUp,
  CurrencyRupee,
  Receipt,
  Download,
  CalendarCheck,
  FileEarmarkPdf
} from 'react-bootstrap-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SuperAdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const [repRes, subRes] = await Promise.all([
        superAdminApi.getSubscriptionReport(params),
        superAdminApi.getSubscriptions({ ...params, size: 100 }),
      ]);
      setReport(repRes.data);
      setSubscriptions(subRes.data.content || []);
    } catch (err) {
      console.error('Failed to load report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const downloadPdfReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Super Admin Revenue & Subscription Summary Report', 14, 20);

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      if (fromDate || toDate) {
        doc.text(`Date Range: ${fromDate || 'Start'} to ${toDate || 'Today'}`, 14, 34);
      }

      // Summary table
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
          ['Total Revenue', `Rs. ${report?.totalRevenue?.toLocaleString('en-IN') || 0}`],
          ['Monthly Plans Revenue', `Rs. ${report?.monthlyRevenue?.toLocaleString('en-IN') || 0}`],
          ['Yearly Plans Revenue', `Rs. ${report?.yearlyRevenue?.toLocaleString('en-IN') || 0}`],
          ['Total Subscriptions', `${report?.totalSubscriptions || 0}`],
          ['Monthly Subscriptions', `${report?.monthlySubscriptions || 0}`],
          ['Yearly Subscriptions', `${report?.yearlySubscriptions || 0}`],
        ],
      });

      // Detailed list
      const rows = subscriptions.map((s) => [
        s.id,
        s.adminName || '-',
        s.subscriptionName || '-',
        s.subscriptionType || '-',
        `Rs. ${s.totalAmount || 0}`,
        s.paymentStatus || '-',
        s.subscriptionStatus || '-',
        s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-',
      ]);

      autoTable(doc, {
        startY: (doc.lastAutoTable.finalY || 80) + 10,
        head: [['#', 'Admin Tenant', 'Plan', 'Billing', 'Amount', 'Payment', 'Sub Status', 'Date']],
        body: rows,
      });

      doc.save(`SuperAdmin_Revenue_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      alert('Failed to generate PDF: ' + err.message);
    }
  };

  return (
    <SuperAdminLayout title="Revenue & Subscription Reports">
      {/* FILTER & EXPORT BAR */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="fw-semibold text-secondary small">Filter Period:</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="text-muted small">to</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button onClick={fetchReport} className="btn btn-sm btn-primary">
              Generate Report
            </button>
          </div>

          <button onClick={downloadPdfReport} className="btn btn-outline-danger btn-sm d-flex align-items-center">
            <FileEarmarkPdf className="me-2" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          {/* REVENUE SUMMARY METRICS */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 border-start border-success border-4">
                <div className="card-body">
                  <span className="text-muted small fw-semibold text-uppercase">Total Period Revenue</span>
                  <h3 className="fw-bold text-success my-2">
                    ₹{Number(report?.totalRevenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </h3>
                  <small className="text-muted">{report?.totalSubscriptions ?? 0} total subscriptions recorded</small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 border-start border-primary border-4">
                <div className="card-body">
                  <span className="text-muted small fw-semibold text-uppercase">Monthly Plan Revenue</span>
                  <h3 className="fw-bold text-primary my-2">
                    ₹{Number(report?.monthlyRevenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </h3>
                  <small className="text-muted">{report?.monthlySubscriptions ?? 0} monthly subscribers</small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 border-start border-info border-4">
                <div className="card-body">
                  <span className="text-muted small fw-semibold text-uppercase">Yearly Plan Revenue</span>
                  <h3 className="fw-bold text-info my-2">
                    ₹{Number(report?.yearlyRevenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </h3>
                  <small className="text-muted">{report?.yearlySubscriptions ?? 0} yearly subscribers</small>
                </div>
              </div>
            </div>
          </div>

          {/* SUBSCRIPTION TRANSACTIONS BREAKDOWN */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-0">
              <h5 className="fw-bold mb-0 text-dark">Included Transactions ({subscriptions.length})</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary small text-uppercase">
                  <tr>
                    <th scope="col" className="ps-4">Sub ID</th>
                    <th scope="col">Admin Name</th>
                    <th scope="col">Plan</th>
                    <th scope="col">Billing Type</th>
                    <th scope="col">Total Paid</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Sub Status</th>
                    <th scope="col">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No transactions found in this period.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((s) => (
                      <tr key={s.id}>
                        <td className="ps-4 fw-semibold text-secondary">#{s.id}</td>
                        <td className="fw-bold text-dark">{s.adminName}</td>
                        <td>{s.subscriptionName}</td>
                        <td>
                          <span className="badge bg-light text-secondary border">{s.subscriptionType}</span>
                        </td>
                        <td className="fw-semibold text-success">
                          ₹{s.totalAmount?.toLocaleString('en-IN')}
                        </td>
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
        </>
      )}
    </SuperAdminLayout>
  );
}

