import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chartView, setChartView] = useState("monthly"); // daily, monthly, yearly

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await superadminApi.get("/dashboard");
      setStats(res?.data?.data || {});
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      toast.error("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getTimelineData = () => {
    if (!stats) return [];
    if (chartView === "daily") return stats.dailySalesTimeline || [];
    if (chartView === "yearly") return stats.yearlySalesTimeline || [];
    return stats.monthlySalesTimeline || [];
  };

  const timelineData = getTimelineData();
  const maxRevenue = Math.max(...timelineData.map((d) => d.revenue || 0), 100);

  return (
    <SuperAdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Super Admin Overview
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
            Real-time analytics, revenue, owners, child users and subscription status
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            color: "#334155",
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <i className={`fa fa-refresh ${loading ? "fa-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading && !stats ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
          <i className="fa fa-circle-o-notch fa-spin fa-2x" />
          <p style={{ marginTop: "0.75rem" }}>Loading dashboard intelligence...</p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards - Row 1: Revenue & Sales */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            {/* Total Revenue */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderLeft: "5px solid #2563eb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                    Total Revenue
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", marginTop: "0.25rem" }}>
                    {formatCurrency(stats?.totalRevenue)}
                  </div>
                </div>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  <i className="fa fa-inr" />
                </div>
              </div>
              <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#64748b" }}>
                <span>Lifetime earned across all plans</span>
              </div>
            </div>

            {/* Total Subscriptions Sold */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderLeft: "5px solid #10b981",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                    Plans Sold
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", marginTop: "0.25rem" }}>
                    {stats?.totalSalesCount || 0}
                  </div>
                </div>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#ecfdf5",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  <i className="fa fa-shopping-cart" />
                </div>
              </div>
              <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#059669" }}>
                <i className="fa fa-check-circle" /> Total successful transactions
              </div>
            </div>

            {/* Today Sales */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderLeft: "5px solid #f59e0b",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                    Today's Sales
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", marginTop: "0.25rem" }}>
                    {formatCurrency(stats?.todayRevenue)}
                  </div>
                </div>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#fffbeb",
                    color: "#f59e0b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  <i className="fa fa-calendar-check-o" />
                </div>
              </div>
              <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#64748b" }}>
                <span>{stats?.todaySalesCount || 0} subscriptions today</span>
              </div>
            </div>

            {/* Current Month Sales */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "1.25rem",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderLeft: "5px solid #8b5cf6",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                    This Month
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f172a", marginTop: "0.25rem" }}>
                    {formatCurrency(stats?.monthRevenue)}
                  </div>
                </div>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#f5f3ff",
                    color: "#8b5cf6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                  }}
                >
                  <i className="fa fa-calendar" />
                </div>
              </div>
              <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#64748b" }}>
                <span>{stats?.monthSalesCount || 0} subscriptions this month</span>
              </div>
            </div>
          </div>

          {/* Row 2: Owners, Child Users & Subscriptions Status */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Total Owners */}
            <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>TOTAL OWNERS</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1e293b", marginTop: "0.2rem" }}>
                {stats?.totalOwners || 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#2563eb", marginTop: "0.25rem" }}>Registered business owners</div>
            </div>

            {/* Total Child Users */}
            <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>TOTAL CHILD USERS</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1e293b", marginTop: "0.2rem" }}>
                {stats?.totalChildUsers || 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>Staff / sub-accounts</div>
            </div>

            {/* Active Subscriptions */}
            <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600 }}>ACTIVE SUBSCRIPTIONS</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#059669", marginTop: "0.2rem" }}>
                {stats?.activeSubscriptions || 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>Currently live & active</div>
            </div>

            {/* Expiring Soon */}
            <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#d97706", fontWeight: 600 }}>EXPIRING SOON (&lt;30d)</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#d97706", marginTop: "0.2rem" }}>
                {stats?.expiringSoonSubscriptions || 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#d97706", marginTop: "0.25rem" }}>Eligible for renewal</div>
            </div>

            {/* Expired Subscriptions */}
            <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>EXPIRED SUBSCRIPTIONS</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#dc2626", marginTop: "0.2rem" }}>
                {stats?.expiredSubscriptions || 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.25rem" }}>Needs re-subscription</div>
            </div>

            {/* Queued Subscriptions */}
            <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>QUEUED FOR NEXT</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0284c7", marginTop: "0.2rem" }}>
                {stats?.queuedSubscriptions || 0}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "0.25rem" }}>Pre-paid future periods</div>
            </div>
          </div>

          {/* Interactive Chart Section: Sales & Revenue Timeline */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                  Subscription Sales & Revenue Trend
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Track sales volume and gross revenue over time
                </span>
              </div>
              <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "8px", padding: "0.25rem" }}>
                {["daily", "monthly", "yearly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setChartView(view)}
                    style={{
                      padding: "0.4rem 0.85rem",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      backgroundColor: chartView === view ? "#2563eb" : "transparent",
                      color: chartView === view ? "#ffffff" : "#64748b",
                      transition: "all 0.15s ease",
                      textTransform: "capitalize",
                    }}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {timelineData.length === 0 ? (
              <div style={{ padding: "3rem 0", textAlign: "center", color: "#94a3b8" }}>
                <i className="fa fa-bar-chart fa-3x" style={{ marginBottom: "0.5rem" }} />
                <p>No sales recorded in this {chartView} window yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", minHeight: "220px", padding: "1rem 0" }}>
                  {timelineData.map((d, i) => {
                    const heightPercent = Math.max(10, Math.round((d.revenue / maxRevenue) * 180));
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: "48px",
                        }}
                      >
                        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#2563eb", marginBottom: "0.35rem" }}>
                          {formatCurrency(d.revenue)}
                        </div>
                        <div
                          style={{
                            width: "28px",
                            height: `${heightPercent}px`,
                            backgroundColor: "#3b82f6",
                            borderRadius: "4px 4px 0 0",
                            transition: "height 0.3s ease",
                            background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
                          }}
                          title={`${d.label}: ${d.count} sales, ${formatCurrency(d.revenue)}`}
                        />
                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem", whiteSpace: "nowrap" }}>
                          {d.label}
                        </div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#10b981" }}>
                          {d.count} {d.count === 1 ? "sale" : "sales"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Grid: Plan Popularity + Payment Statuses */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {/* Plan Popularity Breakdown */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>
                Plan Popularity Breakdown
              </h3>
              {(stats?.planPopularity || []).length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No plan sales yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {stats.planPopularity.map((p, index) => (
                    <div key={index}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600, color: "#334155" }}>{p.planName}</span>
                        <span style={{ color: "#64748b" }}>
                          {p.count} sold ({formatCurrency(p.revenue)})
                        </span>
                      </div>
                      <div style={{ height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, (p.count / (stats.totalSalesCount || 1)) * 100)}%`,
                            backgroundColor: index === 0 ? "#2563eb" : index === 1 ? "#10b981" : "#f59e0b",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>
                Payment Gateway Reconciliation (Razorpay)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "#ecfdf5",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#065f46", fontWeight: 600 }}>
                    <i className="fa fa-check-circle" />
                    <span>Successful Payments</span>
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#065f46" }}>
                    {stats?.successfulPayments || 0}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "#fef2f2",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#991b1b", fontWeight: 600 }}>
                    <i className="fa fa-times-circle" />
                    <span>Failed Payments</span>
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#991b1b" }}>
                    {stats?.failedPayments || 0}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    backgroundColor: "#fffbeb",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#92400e", fontWeight: 600 }}>
                    <i className="fa fa-clock-o" />
                    <span>Pending / Initiated Orders</span>
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#92400e" }}>
                    {stats?.pendingPayments || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
