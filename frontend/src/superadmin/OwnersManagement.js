import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";
import { SUPPORTED_LANGUAGES } from "../i18n/languages";

const OwnersManagement = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [ownerDetail, setOwnerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Multilingual states
  const [ownerLangSelect, setOwnerLangSelect] = useState("en");
  const [branchLangSelections, setBranchLangSelections] = useState({});
  const [langUpdating, setLangUpdating] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [languagesList, setLanguagesList] = useState([]);
  const [langModalLoading, setLangModalLoading] = useState(false);

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
      const data = res?.data?.data || null;
      setOwnerDetail(data);

      if (data?.owner?.defaultLanguage) {
        setOwnerLangSelect(data.owner.defaultLanguage);
      } else {
        setOwnerLangSelect("en");
      }

      if (data?.branches && Array.isArray(data.branches)) {
        const branchMap = {};
        data.branches.forEach((b) => {
          branchMap[b.branchCode] = b.language || "en";
        });
        setBranchLangSelections(branchMap);
      }
    } catch (err) {
      console.error("Error loading owner details:", err);
      toast.error("Failed to load owner details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateOwnerDefaultLang = async () => {
    if (!selectedOwnerId || !ownerLangSelect) return;
    setLangUpdating(true);
    try {
      const res = await superadminApi.put(`/owners/${selectedOwnerId}/language`, {
        language: ownerLangSelect,
      });
      toast.success(res?.data?.message || "Owner default language updated.");
      setOwnerDetail((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          defaultLanguage: ownerLangSelect,
          defaultLanguageName: res?.data?.data?.defaultLanguageName || ownerLangSelect,
        },
      }));
      setOwners((prev) =>
        prev.map((o) =>
          o.ownerId === selectedOwnerId
            ? {
                ...o,
                defaultLanguage: ownerLangSelect,
                defaultLanguageName: res?.data?.data?.defaultLanguageName || ownerLangSelect,
              }
            : o
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update owner language.");
    } finally {
      setLangUpdating(false);
    }
  };

  const handleUpdateBranchLang = async (branchCode) => {
    const newLang = branchLangSelections[branchCode];
    if (!branchCode || !newLang) return;
    setLangUpdating(true);
    try {
      const res = await superadminApi.put(`/branches/${branchCode}/language`, {
        language: newLang,
      });
      toast.success(res?.data?.message || "Branch language updated.");
      setOwnerDetail((prev) => ({
        ...prev,
        branches: prev.branches.map((b) =>
          b.branchCode === branchCode
            ? {
                ...b,
                language: newLang,
                languageName: res?.data?.data?.languageName || newLang,
              }
            : b
        ),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update branch language.");
    } finally {
      setLangUpdating(false);
    }
  };

  const fetchLanguages = async () => {
    setLangModalLoading(true);
    try {
      const res = await superadminApi.get("/languages");
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setLanguagesList(res.data.data);
      } else {
        setLanguagesList(SUPPORTED_LANGUAGES.map((l) => ({ ...l, languageCode: l.code, languageName: l.name, active: true, rtl: l.isRtl })));
      }
    } catch (e) {
      setLanguagesList(SUPPORTED_LANGUAGES.map((l) => ({ ...l, languageCode: l.code, languageName: l.name, active: true, rtl: l.isRtl })));
    } finally {
      setLangModalLoading(false);
    }
  };

  const handleToggleLangStatus = async (code, currentActive) => {
    try {
      const res = await superadminApi.patch(`/languages/${code}/status`, {
        active: !currentActive,
      });
      toast.success(res?.data?.message || "Language status updated.");
      fetchLanguages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update language status.");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Owners & Child Users Directory
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
            View all business owners, their staff/child accounts, and active subscription plans
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link
            to="/superadmin/languages"
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 2px 4px rgba(37,99,235,0.2)",
            }}
          >
            <i className="fa fa-language" />
            <span>Manage Branch & Owner Languages</span>
          </Link>

          <button
            onClick={() => {
              fetchLanguages();
              setShowLangModal(true);
            }}
            style={{
              backgroundColor: "#059669",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 2px 4px rgba(5,150,105,0.2)",
            }}
          >
            <i className="fa fa-globe" />
            <span>13 Languages Status</span>
          </button>
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
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "1050px", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Owner ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Owner Name</th>
                <th style={{ padding: "0.75rem 1rem" }}>Email</th>
                <th style={{ padding: "0.75rem 1rem" }}>Mobile</th>
                <th style={{ padding: "0.75rem 1rem" }}>Default Language</th>
                <th style={{ padding: "0.75rem 1rem" }}>Personal Language</th>
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
                          backgroundColor: "#e0e7ff",
                          color: "#3730a3",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {o.defaultLanguageName || o.defaultLanguage || "English"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748b", fontSize: "0.8rem" }}>
                      {o.personalLanguage ? (
                        <span
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            padding: "0.2rem 0.55rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {o.personalLanguageName || o.personalLanguage}
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Same as Default</span>
                      )}
                    </td>
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
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleViewOwner(o.ownerId)}
                        style={{
                          backgroundColor: "#059669",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.35rem 0.65rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          marginRight: "0.4rem",
                        }}
                        title="Change Language & View Branches"
                      >
                        <i className="fa fa-language" />
                        <span>Change Language</span>
                      </button>

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
                      <div>
                        <strong>Default Language:</strong>{" "}
                        <span className="badge bg-primary ms-1">
                          {ownerDetail.owner?.defaultLanguageName || ownerDetail.owner?.defaultLanguage || "English"}
                        </span>
                      </div>
                      <div>
                        <strong>Personal Language:</strong>{" "}
                        {ownerDetail.owner?.personalLanguage ? (
                          <span className="badge bg-warning text-dark ms-1">
                            {ownerDetail.owner?.personalLanguageName || ownerDetail.owner?.personalLanguage}
                          </span>
                        ) : (
                          <span className="text-muted ms-1" style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                            Same as Default
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Change Owner Default Language */}
                    <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed #cbd5e1", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <label style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem" }}>
                        Change Default Language:
                      </label>
                      <select
                        value={ownerLangSelect}
                        onChange={(e) => setOwnerLangSelect(e.target.value)}
                        style={{
                          padding: "0.35rem 0.6rem",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.85rem",
                          backgroundColor: "#ffffff",
                          minWidth: "160px",
                        }}
                      >
                        {SUPPORTED_LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.name} ({l.nativeName}){l.isRtl ? " [RTL]" : ""}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleUpdateOwnerDefaultLang}
                        disabled={langUpdating || ownerLangSelect === ownerDetail.owner?.defaultLanguage}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.35rem 0.85rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {langUpdating ? "Saving..." : "Save Default Language"}
                      </button>
                      {ownerDetail.owner?.personalLanguage && (
                        <span style={{ fontSize: "0.8rem", color: "#b45309", backgroundColor: "#fef3c7", padding: "2px 8px", borderRadius: "4px" }}>
                          Note: Owner has active personal language
                        </span>
                      )}
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

                  {/* Section 2.5: Branches & Language Configuration */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <h4 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: 700 }}>
                        <i className="fa fa-building text-primary" style={{ marginRight: "0.4rem" }} />
                        Owner Branches & Language Configuration ({(ownerDetail.branches || []).length})
                      </h4>
                    </div>

                    {(ownerDetail.branches || []).length === 0 ? (
                      <div style={{ padding: "1.25rem", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", color: "#94a3b8" }}>
                        No branches configured for this owner yet.
                      </div>
                    ) : (
                      <div className="table-responsive" style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <table style={{ width: "100%", minWidth: "700px", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                              <th style={{ padding: "0.6rem 0.75rem" }}>Branch Name</th>
                              <th style={{ padding: "0.6rem 0.75rem" }}>Code</th>
                              <th style={{ padding: "0.6rem 0.75rem" }}>City</th>
                              <th style={{ padding: "0.6rem 0.75rem" }}>Status</th>
                              <th style={{ padding: "0.6rem 0.75rem" }}>Current Language</th>
                              <th style={{ padding: "0.6rem 0.75rem" }}>Change Branch Language</th>
                              <th style={{ padding: "0.6rem 0.75rem", textAlign: "right" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ownerDetail.branches.map((b) => (
                              <tr key={b.branchCode} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600 }}>{b.branchName}</td>
                                <td style={{ padding: "0.6rem 0.75rem", color: "#64748b", fontFamily: "monospace" }}>{b.branchCode}</td>
                                <td style={{ padding: "0.6rem 0.75rem" }}>{b.city || "-"}</td>
                                <td style={{ padding: "0.6rem 0.75rem" }}>
                                  <span className={`badge ${b.status ? "bg-success" : "bg-danger"}`}>
                                    {b.status ? "ACTIVE" : "INACTIVE"}
                                  </span>
                                </td>
                                <td style={{ padding: "0.6rem 0.75rem" }}>
                                  <span
                                    style={{
                                      backgroundColor: "#dbeafe",
                                      color: "#1d4ed8",
                                      padding: "0.2rem 0.5rem",
                                      borderRadius: "12px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {b.languageName || b.language} {b.isRtl ? "[RTL]" : ""}
                                  </span>
                                </td>
                                <td style={{ padding: "0.6rem 0.75rem" }}>
                                  <select
                                    value={branchLangSelections[b.branchCode] || b.language || "en"}
                                    onChange={(e) =>
                                      setBranchLangSelections({
                                        ...branchLangSelections,
                                        [b.branchCode]: e.target.value,
                                      })
                                    }
                                    style={{
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "5px",
                                      border: "1px solid #cbd5e1",
                                      fontSize: "0.8rem",
                                      backgroundColor: "#ffffff",
                                    }}
                                  >
                                    {SUPPORTED_LANGUAGES.map((l) => (
                                      <option key={l.code} value={l.code}>
                                        {l.name} ({l.nativeName}){l.isRtl ? " [RTL]" : ""}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td style={{ padding: "0.6rem 0.75rem", textAlign: "right" }}>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBranchLang(b.branchCode)}
                                    disabled={
                                      langUpdating ||
                                      (branchLangSelections[b.branchCode] || b.language) === b.language
                                    }
                                    style={{
                                      backgroundColor: "#2563eb",
                                      color: "#ffffff",
                                      border: "none",
                                      borderRadius: "5px",
                                      padding: "0.25rem 0.65rem",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}
                                  >
                                    Save
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
                      <div className="table-responsive" style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <table style={{ width: "100%", minWidth: "750px", borderCollapse: "collapse", fontSize: "0.825rem" }}>
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
                      <div className="table-responsive" style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <table style={{ width: "100%", minWidth: "750px", borderCollapse: "collapse", fontSize: "0.825rem" }}>
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

      {/* Languages Master Modal (Section 25) */}
      {showLangModal && (
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
              maxWidth: "720px",
              maxHeight: "85vh",
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
                  <i className="fa fa-language text-success" style={{ marginRight: "0.5rem" }} />
                  Supported 13 Multilingual Languages
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Manage and toggle active/inactive status across the application
                </span>
              </div>
              <button
                onClick={() => setShowLangModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", color: "#64748b", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "1.25rem 1.5rem" }}>
              {langModalLoading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                  <i className="fa fa-spinner fa-spin fa-2x" />
                  <p style={{ margin: "0.5rem 0 0" }}>Loading languages...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                        <th style={{ padding: "0.6rem 0.75rem" }}>Code</th>
                        <th style={{ padding: "0.6rem 0.75rem" }}>Language Name</th>
                        <th style={{ padding: "0.6rem 0.75rem" }}>Native Name</th>
                        <th style={{ padding: "0.6rem 0.75rem" }}>Direction</th>
                        <th style={{ padding: "0.6rem 0.75rem" }}>Status</th>
                        <th style={{ padding: "0.6rem 0.75rem", textAlign: "right" }}>Toggle Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(languagesList.length > 0 ? languagesList : SUPPORTED_LANGUAGES).map((l) => {
                        const code = l.languageCode || l.code;
                        const name = l.languageName || l.name;
                        const native = l.nativeName || name;
                        const isRtl = l.rtl !== undefined ? l.rtl : l.isRtl;
                        const isActive = l.active !== undefined ? l.active : true;

                        return (
                          <tr key={code} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "0.6rem 0.75rem", fontFamily: "monospace", fontWeight: 700, color: "#2563eb" }}>
                              {code}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontWeight: 600, color: "#1e293b" }}>
                              {name}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", fontSize: "0.95rem" }}>
                              {native}
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem" }}>
                              <span style={{ fontSize: "0.75rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: isRtl ? "#fef3c7" : "#f1f5f9", color: isRtl ? "#b45309" : "#64748b", fontWeight: 600 }}>
                                {isRtl ? "RTL (Right to Left)" : "LTR"}
                              </span>
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem" }}>
                              <span
                                style={{
                                  padding: "0.2rem 0.5rem",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                                  color: isActive ? "#15803d" : "#b91c1c",
                                }}
                              >
                                {isActive ? "ACTIVE" : "INACTIVE"}
                              </span>
                            </td>
                            <td style={{ padding: "0.6rem 0.75rem", textAlign: "right" }}>
                              <button
                                type="button"
                                onClick={() => handleToggleLangStatus(code, isActive)}
                                style={{
                                  backgroundColor: isActive ? "#ef4444" : "#10b981",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "5px",
                                  padding: "0.25rem 0.65rem",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                {isActive ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default OwnersManagement;
