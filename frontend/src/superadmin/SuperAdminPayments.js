import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SuperAdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, SUCCESS, FAILED, CREATED

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let url = "/payments?";
      if (statusFilter !== "ALL") url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await superadminApi.get(url);
      setPayments(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
            Payment Transactions Log
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
            Real-time Razorpay payment and order audit log with gateway responses
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
            placeholder="Search by Order ID, Payment ID, or Plan Code..."
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
          {["ALL", "SUCCESS", "FAILED", "CREATED"].map((st) => (
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
          <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.75rem 1rem" }}>#</th>
                <th style={{ padding: "0.75rem 1rem" }}>Owner ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Plan</th>
                <th style={{ padding: "0.75rem 1rem" }}>Razorpay Order ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Payment ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Amount</th>
                <th style={{ padding: "0.75rem 1rem" }}>Gateway</th>
                <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    <i className="fa fa-spinner fa-spin fa-2x" />
                    <p style={{ margin: "0.5rem 0 0" }}>Loading payment transactions...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p, index) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{index + 1}</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>#{p.ownerId}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ fontWeight: 600 }}>{p.subscriptionName || p.subscriptionCode}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155" }}>
                      {p.orderId || "-"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155" }}>
                      {p.paymentId || "-"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                      ₹{p.amount || 0}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem" }}>
                        {p.gateway || "RAZORPAY"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor:
                            p.status === "SUCCESS"
                              ? "#dcfce7"
                              : p.status === "FAILED"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            p.status === "SUCCESS"
                              ? "#15803d"
                              : p.status === "FAILED"
                              ? "#b91c1c"
                              : "#b45309",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{formatDate(p.createdAt)}</td>
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

export default SuperAdminPayments;
