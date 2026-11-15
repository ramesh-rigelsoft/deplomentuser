import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SuperAdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, QUEUED, EXPIRED
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      let url = "/subscriptions?";
      if (statusFilter !== "ALL") url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await superadminApi.get(url);
      setSubscriptions(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      toast.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSubscriptions();
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

  return (
    <SuperAdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            All Subscriptions History
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
            Comprehensive register of active, queued, and expired subscriptions
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem", flex: 1, minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search by owner name, plan name, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "0.45rem 0.75rem",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontSize: "0.85rem",
            }}
          />
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
            Search
          </button>
        </form>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["ALL", "ACTIVE", "QUEUED", "EXPIRED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: statusFilter === st ? "#2563eb" : "#f1f5f9",
                color: statusFilter === st ? "#ffffff" : "#475569",
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "1050px", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.75rem 1rem" }}>ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Owner</th>
                <th style={{ padding: "0.75rem 1rem" }}>Plan Name</th>
                <th style={{ padding: "0.75rem 1rem" }}>Duration</th>
                <th style={{ padding: "0.75rem 1rem" }}>Amount</th>
                <th style={{ padding: "0.75rem 1rem" }}>Start Date</th>
                <th style={{ padding: "0.75rem 1rem" }}>Expiry Date</th>
                <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem" }}>Razorpay Order ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Payment ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Purchased Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    <i className="fa fa-spinner fa-spin fa-2x" />
                    <p style={{ margin: "0.5rem 0 0" }}>Loading subscriptions...</p>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>#{s.id}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>{s.ownerName}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: #{s.ownerId}</div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ fontWeight: 600 }}>{s.planName}</span>
                      <span style={{ marginLeft: "0.3rem", fontSize: "0.75rem", color: "#64748b" }}>({s.planCode})</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>
                      {s.duration} {s.duration === 1 ? "Month" : "Months"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                      ₹{s.amount || 0}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>{formatDate(s.startDate)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>{formatDate(s.expiryDate)}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor:
                            s.status === "ACTIVE"
                              ? "#dbeafe"
                              : s.status === "QUEUED"
                              ? "#e0f2fe"
                              : "#f1f5f9",
                          color:
                            s.status === "ACTIVE"
                              ? "#1d4ed8"
                              : s.status === "QUEUED"
                              ? "#0284c7"
                              : "#64748b",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155" }}>
                      {s.orderId || "-"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155" }}>
                      {s.paymentId || "-"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{formatDate(s.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminSubscriptions;
