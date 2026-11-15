import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SubscriptionSalesReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("thisMonth");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("table"); // table, chart

  useEffect(() => {
    fetchReport();
  }, [filterType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let url = `/reports/sales?filterType=${filterType}&`;
      if (filterType === "custom" && customStart && customEnd) {
        url += `startDate=${customStart}&endDate=${customEnd}&`;
      }
      if (search) {
        url += `search=${encodeURIComponent(search)}&`;
      }

      const res = await superadminApi.get(url);
      setReport(res?.data?.data || {});
    } catch (err) {
      console.error("Error fetching sales report:", err);
      toast.error("Failed to load sales report.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customStart || !customEnd) {
      toast.warn("Please select both start and end date.");
      return;
    }
    setFilterType("custom");
    fetchReport();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const txs = report?.transactions || [];
    if (txs.length === 0) {
      toast.info("No data to export.");
      return;
    }

    const headers = [
      "Subscription ID",
      "Owner Name",
      "Owner ID",
      "Owner Mobile",
      "Plan Name",
      "Plan Code",
      "Amount",
      "Payment ID",
      "Order ID",
      "Payment Status",
      "Subscription Status",
      "Start Date",
      "Expiry Date",
      "Created Date",
    ];

    const csvRows = [headers.join(",")];
    txs.forEach((t) => {
      const row = [
        t.subscriptionId,
        `"${t.ownerName || ""}"`,
        t.ownerId,
        `"${t.ownerMobile || ""}"`,
        `"${t.planName || ""}"`,
        `"${t.planCode || ""}"`,
        t.amount,
        `"${t.paymentId || ""}"`,
        `"${t.orderId || ""}"`,
        `"${t.paymentStatus || ""}"`,
        `"${t.subscriptionStatus || ""}"`,
        `"${formatDate(t.startDate)}"`,
        `"${formatDate(t.expiryDate)}"`,
        `"${formatDate(t.createdAt)}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscription_sales_report_${filterType}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sales report exported successfully!");
  };

  const filterButtons = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "last7days", label: "Last 7 Days" },
    { key: "thisMonth", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { key: "thisYear", label: "This Year" },
    { key: "lastYear", label: "Last Year" },
    { key: "custom", label: "Custom Range" },
  ];

  return (
    <SuperAdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Subscription Sales Report
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
            Analyze subscription sales volume, revenue, and transaction reconciliation
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleExportCSV}
            style={{
              backgroundColor: "#10b981",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
            }}
          >
            <i className="fa fa-file-excel-o" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filter Pills */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1.25rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: filterType === "custom" ? "1rem" : 0 }}>
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilterType(btn.key)}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "6px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: filterType === btn.key ? "#2563eb" : "#f1f5f9",
                color: filterType === btn.key ? "#ffffff" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Custom Range Picker */}
        {filterType === "custom" && (
          <form
            onSubmit={handleApplyCustom}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
              paddingTop: "0.75rem",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                style={{ padding: "0.4rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={{ padding: "0.4rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.45rem 1rem",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Apply Filter
            </button>
          </form>
        )}
      </div>

      {/* Summary KPI Highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ backgroundColor: "#ffffff", padding: "1.1rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>PLANS SOLD</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginTop: "0.2rem" }}>
            {report?.totalSubscriptions || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Total sales count</div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1.1rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>GROSS REVENUE</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2563eb", marginTop: "0.2rem" }}>
            {formatCurrency(report?.totalRevenue)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Total payments collected</div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1.1rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#059669" }}>SUCCESSFUL</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#059669", marginTop: "0.2rem" }}>
            {report?.successfulCount || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#059669" }}>Activated subscriptions</div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1.1rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>FAILED</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#dc2626", marginTop: "0.2rem" }}>
            {report?.failedCount || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#dc2626" }}>Failed checkout attempts</div>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "1.1rem", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#d97706" }}>PENDING</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#d97706", marginTop: "0.2rem" }}>
            {report?.pendingCount || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#d97706" }}>Awaiting payment capture</div>
        </div>
      </div>

      {/* View Switcher & Search */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px 10px 0 0",
          padding: "0.85rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("table")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "table" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "table" ? "#ffffff" : "#475569",
            }}
          >
            <i className="fa fa-table" style={{ marginRight: "0.3rem" }} />
            Table View
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "chart" ? "#2563eb" : "#f1f5f9",
              color: activeTab === "chart" ? "#ffffff" : "#475569",
            }}
          >
            <i className="fa fa-bar-chart" style={{ marginRight: "0.3rem" }} />
            Plan Breakdown
          </button>
        </div>

        <input
          type="text"
          placeholder="Filter by owner or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchReport();
          }}
          style={{
            padding: "0.4rem 0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "0.85rem",
            width: "240px",
            outline: "none",
          }}
        />
      </div>

      {/* Main Content: Table or Chart */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {activeTab === "table" ? (
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "1000px", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>ID</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Owner</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Plan Name</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Amount</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Razorpay Order ID</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Payment ID</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Payment Status</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Start Date</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Expiry Date</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                      <i className="fa fa-spinner fa-spin fa-2x" />
                      <p style={{ margin: "0.5rem 0 0" }}>Generating report...</p>
                    </td>
                  </tr>
                ) : (report?.transactions || []).length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                      No subscription transactions found for this period.
                    </td>
                  </tr>
                ) : (
                  report.transactions.map((t) => (
                    <tr key={t.subscriptionId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>#{t.subscriptionId}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{t.ownerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {t.ownerId}</div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ fontWeight: 600 }}>{t.planName}</span>
                        <span style={{ marginLeft: "0.35rem", fontSize: "0.75rem", color: "#64748b" }}>({t.planCode})</span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                        {formatCurrency(t.amount)}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155" }}>
                        {t.orderId || "-"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155" }}>
                        {t.paymentId || "-"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor:
                              t.paymentStatus === "SUCCESS"
                                ? "#dcfce7"
                                : t.paymentStatus === "FAILED"
                                ? "#fee2e2"
                                : "#fef3c7",
                            color:
                              t.paymentStatus === "SUCCESS"
                                ? "#15803d"
                                : t.paymentStatus === "FAILED"
                                ? "#b91c1c"
                                : "#b45309",
                          }}
                        >
                          {t.paymentStatus || "PENDING"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor:
                              t.subscriptionStatus === "ACTIVE"
                                ? "#dbeafe"
                                : t.subscriptionStatus === "QUEUED"
                                ? "#e0f2fe"
                                : "#f1f5f9",
                            color:
                              t.subscriptionStatus === "ACTIVE"
                                ? "#1d4ed8"
                                : t.subscriptionStatus === "QUEUED"
                                ? "#0284c7"
                                : "#64748b",
                          }}
                        >
                          {t.subscriptionStatus}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>{formatDate(t.startDate)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>{formatDate(t.expiryDate)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{formatDate(t.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "2rem" }}>
            <h4 style={{ margin: "0 0 1rem", color: "#1e293b", fontSize: "1rem" }}>
              Sales by Plan Distribution
            </h4>
            {(() => {
              const txs = report?.transactions || [];
              const planMap = {};
              txs.forEach((t) => {
                const name = t.planName || "Unknown";
                if (!planMap[name]) planMap[name] = { count: 0, revenue: 0 };
                planMap[name].count += 1;
                planMap[name].revenue += t.amount || 0;
              });

              const keys = Object.keys(planMap);
              if (keys.length === 0) {
                return <p style={{ color: "#94a3b8" }}>No data to visualize.</p>;
              }

              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
                  {keys.map((k) => (
                    <div
                      key={k}
                      style={{
                        padding: "1rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>{k}</div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2563eb", marginTop: "0.25rem" }}>
                        {formatCurrency(planMap[k].revenue)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>
                        {planMap[k].count} {planMap[k].count === 1 ? "subscription" : "subscriptions"} sold
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default SubscriptionSalesReport;
