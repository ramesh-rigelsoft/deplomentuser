import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const OwnersManagement = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [ownerDetail, setOwnerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      let url = "/owners";
      if (search) url += `?search=${encodeURIComponent(search)}`;
      const res = await superadminApi.get(url);
      setOwners(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching owners:", err);
      toast.error("Failed to load owners list.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOwners();
  };

  const handleViewOwner = async (ownerId) => {
    setSelectedOwnerId(ownerId);
    setDetailLoading(true);
    try {
      const res = await superadminApi.get(`/owners/${ownerId}`);
      setOwnerDetail(res?.data?.data || null);
    } catch (err) {
      console.error("Error loading owner details:", err);
      toast.error("Failed to load owner details.");
    } finally {
      setDetailLoading(false);
    }
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
            Owners & Child Users Directory
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
            View all business owners, their staff/child accounts, and active subscription plans
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem", flex: 1, maxWidth: "480px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <i
              className="fa fa-search"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            />
            <input
              type="text"
              placeholder="Search by owner name, email, mobile, or license key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.45rem 0.75rem 0.45rem 2.25rem",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "0.85rem",
                outline: "none",
                boxSizing: "border-box",
              }}
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
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Total Registered Owners: <strong style={{ color: "#1e293b" }}>{owners.length}</strong>
        </div>
      </div>

      {/* Owners Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Owner ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Owner Name</th>
                <th style={{ padding: "0.75rem 1rem" }}>Email</th>
                <th style={{ padding: "0.75rem 1rem" }}>Mobile</th>
                <th style={{ padding: "0.75rem 1rem" }}>Account Status</th>
                <th style={{ padding: "0.75rem 1rem" }}>Current Plan</th>
                <th style={{ padding: "0.75rem 1rem" }}>Subscription Status</th>
                <th style={{ padding: "0.75rem 1rem" }}>Start Date</th>
                <th style={{ padding: "0.75rem 1rem" }}>Expiry Date</th>
                <th style={{ padding: "0.75rem 1rem" }}>Child Users</th>
                <th style={{ padding: "0.75rem 1rem" }}>Registered Date</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    <i className="fa fa-spinner fa-spin fa-2x" />
                    <p style={{ margin: "0.5rem 0 0" }}>Loading owners...</p>
                  </td>
                </tr>
              ) : owners.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                    No business owners found.
                  </td>
                </tr>
              ) : (
                owners.map((o) => (
                  <tr key={o.ownerId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#64748b" }}>#{o.ownerId}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>{o.ownerName}</div>
                      {o.softwareKey && (
                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>
                          Key: {o.softwareKey}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>{o.email}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>{o.mobile}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: o.accountStatus === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                          color: o.accountStatus === "ACTIVE" ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {o.accountStatus}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#1e293b" }}>
                      {o.currentPlanName || "None"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor:
                            o.subscriptionStatus === "ACTIVE"
                              ? "#dbeafe"
                              : o.subscriptionStatus === "QUEUED"
                              ? "#e0f2fe"
                              : "#f1f5f9",
                          color:
                            o.subscriptionStatus === "ACTIVE"
                              ? "#1d4ed8"
                              : o.subscriptionStatus === "QUEUED"
                              ? "#0284c7"
                              : "#64748b",
                        }}
                      >
                        {o.subscriptionStatus}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>{formatDate(o.subscriptionStartDate)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "#475569" }}>{formatDate(o.subscriptionExpiryDate)}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          backgroundColor: "#f1f5f9",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "12px",
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        <i className="fa fa-users text-primary" style={{ marginRight: "0.3rem" }} />
                        {o.childUsersCount || 0}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{formatDate(o.createdAt)}</td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleViewOwner(o.ownerId)}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.35rem 0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <i className="fa fa-eye" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner Detail Modal */}
      {selectedOwnerId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "840px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                backgroundColor: "#ffffff",
                zIndex: 10,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                  Owner Profile & Tree Hierarchy
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Owner ID #{selectedOwnerId}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedOwnerId(null);
                  setOwnerDetail(null);
                }}
                style={{ background: "none", border: "none", fontSize: "1.25rem", color: "#64748b", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {detailLoading || !ownerDetail ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                  <i className="fa fa-spinner fa-spin fa-2x" />
                  <p style={{ margin: "0.5rem 0 0" }}>Loading owner profile & child users...</p>
                </div>
              ) : (
                <>
                  {/* Section 1: Owner Information */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      padding: "1.25rem",
                      border: "1px solid #e2e8f0",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h4 style={{ margin: "0 0 0.85rem", fontSize: "1rem", color: "#1e293b", fontWeight: 700 }}>
                      <i className="fa fa-user-circle text-primary" style={{ marginRight: "0.4rem" }} />
                      Owner Profile
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                      <div><strong>Full Name:</strong> {ownerDetail.owner?.name}</div>
                      <div><strong>Email:</strong> {ownerDetail.owner?.email}</div>
                      <div><strong>Mobile:</strong> {ownerDetail.owner?.mobile}</div>
                      <div><strong>Software Key:</strong> <code style={{ backgroundColor: "#e2e8f0", padding: "2px 4px", borderRadius: "3px" }}>{ownerDetail.owner?.softwareKey || "-"}</code></div>
                      <div><strong>Account Status:</strong> <span className={`badge ${ownerDetail.owner?.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>{ownerDetail.owner?.status}</span></div>
                      <div><strong>Registered Date:</strong> {formatDate(ownerDetail.owner?.createdAt)}</div>
                      <div><strong>Branch Count:</strong> {ownerDetail.owner?.branchCount || 1}</div>
                      <div><strong>Total Child Users:</strong> {ownerDetail.childUsersCount || 0}</div>
                    </div>
                  </div>

                  {/* Section 2: Current Subscription Information */}
                  <div
                    style={{
                      backgroundColor: "#eff6ff",
                      borderRadius: "10px",
                      padding: "1.25rem",
                      border: "1px solid #bfdbfe",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <h4 style={{ margin: "0 0 0.85rem", fontSize: "1rem", color: "#1e40af", fontWeight: 700 }}>
                      <i className="fa fa-shield" style={{ marginRight: "0.4rem" }} />
                      Current Active Subscription
                    </h4>
                    {ownerDetail.currentSubscription ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                        <div><strong>Plan Name:</strong> {ownerDetail.currentSubscription.planName} ({ownerDetail.currentSubscription.planCode})</div>
                        <div><strong>Total Amount:</strong> ₹{ownerDetail.currentSubscription.amount}</div>
                        <div><strong>Duration:</strong> {ownerDetail.currentSubscription.duration} Months</div>
                        <div><strong>Status:</strong> <span className="badge bg-primary">{ownerDetail.currentSubscription.status}</span></div>
                        <div><strong>Start Date:</strong> {formatDate(ownerDetail.currentSubscription.startDate)}</div>
                        <div><strong>Expiry Date:</strong> {formatDate(ownerDetail.currentSubscription.expiryDate)}</div>
                        <div><strong>Razorpay Order ID:</strong> {ownerDetail.currentSubscription.orderId || "-"}</div>
                        <div><strong>Razorpay Payment ID:</strong> {ownerDetail.currentSubscription.paymentId || "-"}</div>
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                        No active subscription at the moment.
                      </p>
                    )}
                  </div>

                  {/* Section 3: Child Users Hierarchy */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <h4 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: 700 }}>
                        <i className="fa fa-sitemap text-primary" style={{ marginRight: "0.4rem" }} />
                        Child Users Under Owner ({ownerDetail.childUsers?.length || 0})
                      </h4>
                    </div>

                    {(ownerDetail.childUsers || []).length === 0 ? (
                      <div style={{ padding: "1.5rem", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", color: "#94a3b8" }}>
                        No child users added under this owner yet.
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                              <th style={{ padding: "0.5rem 0.75rem" }}>User ID</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Name</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Email</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Mobile</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Role</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Branch</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Status</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerDetail.childUsers.map((c) => (
                              <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.5rem 0.75rem", color: "#64748b" }}>#{c.id}</td>
                                <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>{c.name}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>{c.email}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>{c.mobile}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>
                                  <span style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                                    {c.role || "User"}
                                  </span>
                                </td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>{c.branchCode || "-"}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>
                                  <span className={`badge ${c.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td style={{ padding: "0.5rem 0.75rem", color: "#64748b" }}>{formatDate(c.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Section 4: Complete Subscription History */}
                  <div>
                    <h4 style={{ margin: "0 0 0.75rem", fontSize: "1rem", color: "#1e293b", fontWeight: 700 }}>
                      <i className="fa fa-history text-primary" style={{ marginRight: "0.4rem" }} />
                      Subscription & Renewal History
                    </h4>
                    {(ownerDetail.subscriptionHistory || []).length === 0 ? (
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No subscription history.</p>
                    ) : (
                      <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Sub ID</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Plan Name</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Amount</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Start Date</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Expiry Date</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Status</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Razorpay Order ID</th>
                              <th style={{ padding: "0.5rem 0.75rem" }}>Payment ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerDetail.subscriptionHistory.map((sh) => (
                              <tr key={sh.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.5rem 0.75rem" }}>#{sh.id}</td>
                                <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>{sh.planName}</td>
                                <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>₹{sh.amount}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>{formatDate(sh.startDate)}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>{formatDate(sh.expiryDate)}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>
                                  <span
                                    className={`badge ${
                                      sh.status === 'ACTIVE'
                                        ? 'bg-primary'
                                        : sh.status === 'QUEUED'
                                        ? 'bg-info'
                                        : 'bg-secondary'
                                    }`}
                                  >
                                    {sh.status}
                                  </span>
                                </td>
                                <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace" }}>{sh.orderId || "-"}</td>
                                <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace" }}>{sh.paymentId || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default OwnersManagement;
