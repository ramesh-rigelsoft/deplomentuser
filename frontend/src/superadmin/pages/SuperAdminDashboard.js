import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  People,
  PersonBadge,
  Receipt,
  CurrencyRupee,
  ArrowUpRight,
  CalendarCheck,
  Funnel
} from 'react-bootstrap-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('THIS_MONTH');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = { filter };
      if (filter === 'CUSTOM') {
        if (customFrom) params.fromDate = customFrom;
        if (customTo) params.toDate = customTo;
      }
      const res = await superAdminApi.getDashboardStats(params);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filter]);

  const handleApplyCustom = () => {
    if (filter === 'CUSTOM') {
      fetchStats();
    } else {
      setFilter('CUSTOM');
    }
  };

  // Prepare chart data
  const subTrendLabels = stats?.monthlySubscriptionTrend?.map((i) => i.month) || [];
  const subTrendData = stats?.monthlySubscriptionTrend?.map((i) => i.count) || [];

  const subTrendChartData = {
    labels: subTrendLabels,
    datasets: [
      {
        label: 'Subscriptions Count',
        data: subTrendData,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const revLabels = stats?.monthlyRevenueTrend?.map((i) => i.month) || [];
  const revData = stats?.monthlyRevenueTrend?.map((i) => i.revenue) || [];

  const revChartData = {
    labels: revLabels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revData,
        backgroundColor: '#198754',
        borderRadius: 6,
      },
    ],
  };

  const planLabels = stats?.planWiseSubscribers?.map((i) => i.planName) || [];
  const planData = stats?.planWiseSubscribers?.map((i) => i.count) || [];

  const planChartData = {
    labels: planLabels.length > 0 ? planLabels : ['No Active Subscribers'],
    datasets: [
      {
        data: planData.length > 0 ? planData : [1],
        backgroundColor: ['#0d6efd', '#20c997', '#ffc107', '#fd7e14', '#6f42c1'],
      },
    ],
  };

  return (
    <SuperAdminLayout title="Dashboard Overview">
      {/* Date Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center">
            <Funnel className="text-primary me-2" size={18} />
            <span className="fw-semibold text-secondary">Date Filter:</span>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR'].map((period) => (
              <button
                key={period}
                onClick={() => setFilter(period)}
                className={`btn btn-sm ${filter === period ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                {period.replace('_', ' ')}
              </button>
            ))}

            <div className="d-flex align-items-center gap-1 ms-md-2">
              <input
                type="date"
                className="form-control form-control-sm"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
              <span className="text-muted small">to</span>
              <input
                type="date"
                className="form-control form-control-sm"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
              <button
                onClick={handleApplyCustom}
                className={`btn btn-sm ${filter === 'CUSTOM' ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading metrics from database...</p>
        </div>
      ) : (
        <>
          {/* STATS ROW 1: Admins & Users */}
          <div className="row g-3 mb-4">
            {/* Admins Card */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold text-uppercase">Admins Overview</span>
                    <div className="p-2 rounded bg-primary-subtle text-primary">
                      <People size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2 text-dark">{stats?.totalAdmins ?? 0}</h3>
                  <div className="d-flex justify-content-between small text-muted">
                    <span className="text-success fw-semibold">Active: {stats?.activeAdmins ?? 0}</span>
                    <span className="text-danger fw-semibold">Inactive: {stats?.inactiveAdmins ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold text-uppercase">End Users Overview</span>
                    <div className="p-2 rounded bg-info-subtle text-info">
                      <PersonBadge size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2 text-dark">{stats?.totalUsers ?? 0}</h3>
                  <div className="d-flex justify-content-between small text-muted">
                    <span className="text-success fw-semibold">Active: {stats?.activeUsers ?? 0}</span>
                    <span className="text-danger fw-semibold">Inactive: {stats?.inactiveUsers ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriptions Card */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold text-uppercase">Subscriptions</span>
                    <div className="p-2 rounded bg-warning-subtle text-warning">
                      <Receipt size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2 text-dark">{stats?.totalSubscriptions ?? 0}</h3>
                  <div className="d-flex justify-content-between small text-muted">
                    <span className="text-success fw-semibold">Active: {stats?.activeSubscriptions ?? 0}</span>
                    <span className="text-secondary fw-semibold">Expired: {stats?.expiredSubscriptions ?? 0}</span>
                  </div>
                  <div className="mt-2 pt-2 border-top d-flex justify-content-between small text-muted">
                    <span>Monthly: {stats?.monthlySubscribers ?? 0}</span>
                    <span>Yearly: {stats?.yearlySubscribers ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-semibold text-uppercase">Total Revenue</span>
                    <div className="p-2 rounded bg-success-subtle text-success">
                      <CurrencyRupee size={20} />
                    </div>
                  </div>
                  <h3 className="fw-bold mb-2 text-dark">
                    ₹{Number(stats?.totalRevenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </h3>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>This Month: ₹{Number(stats?.monthlyRevenue ?? 0).toLocaleString('en-IN')}</span>
                    <span>This Year: ₹{Number(stats?.yearlyRevenue ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="row g-4 mb-4">
            {/* Revenue Trend Chart */}
            <div className="col-12 col-lg-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-bold mb-0 text-dark">Monthly Revenue Trend</h5>
                  <small className="text-muted">Real-time revenue collected per month (₹)</small>
                </div>
                <div className="card-body" style={{ minHeight: '320px' }}>
                  <Bar
                    data={revChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (val) => `₹${val.toLocaleString('en-IN')}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Plan-wise Breakdown Doughnut */}
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-bold mb-0 text-dark">Subscribers by Plan</h5>
                  <small className="text-muted">Active subscriptions split</small>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '320px' }}>
                  <div style={{ maxWidth: '280px', width: '100%' }}>
                    <Doughnut
                      data={planChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: { position: 'bottom' },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS ROW 2: Monthly Subscriptions Trend */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="fw-bold mb-0 text-dark">Subscriptions Trend</h5>
                  <small className="text-muted">New subscriptions volume over the last 12 months</small>
                </div>
                <div className="card-body" style={{ minHeight: '300px' }}>
                  <Line
                    data={subTrendChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { precision: 0 },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </SuperAdminLayout>
  );
}
