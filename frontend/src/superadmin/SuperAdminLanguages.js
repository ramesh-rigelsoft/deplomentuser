import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";
import { SUPPORTED_LANGUAGES } from "../i18n/languages";

const SuperAdminLanguages = () => {
  const [activeTab, setActiveTab] = useState("branches"); // "branches" | "owners" | "master"

  // Data states
  const [branches, setBranches] = useState([]);
  const [owners, setOwners] = useState([]);
  const [masterLanguages, setMasterLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [branchSearch, setBranchSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");

  // Modals
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchNewLang, setBranchNewLang] = useState("en");

  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownerNewLang, setOwnerNewLang] = useState("en");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMasterLanguages();
    fetchBranches();
    fetchOwners();
  }, []);

  const fetchMasterLanguages = async () => {
    try {
      const res = await superadminApi.get("/languages");
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setMasterLanguages(res.data.data);
      } else {
        setMasterLanguages(SUPPORTED_LANGUAGES);
      }
    } catch (e) {
      setMasterLanguages(SUPPORTED_LANGUAGES);
    }
  };

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await superadminApi.get("/branches");
      setBranches(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await superadminApi.get("/owners");
      setOwners(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching owners:", err);
    }
  };

  // Branch Language update handler
  const handleSaveBranchLanguage = async () => {
    if (!selectedBranch || !branchNewLang) return;
    setSaving(true);
    try {
      const res = await superadminApi.put(`/branches/${selectedBranch.branchCode}/language`, {
        language: branchNewLang,
      });
      toast.success(res?.data?.message || "Branch language updated successfully.");
      setBranches((prev) =>
        prev.map((b) =>
          b.branchCode === selectedBranch.branchCode
            ? {
                ...b,
                language: branchNewLang,
                languageName: res?.data?.data?.languageName || branchNewLang,
                isRtl: res?.data?.data?.isRtl || false,
              }
            : b
        )
      );
      setSelectedBranch(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update branch language.");
    } finally {
      setSaving(false);
    }
  };

  // Owner Default Language update handler
  const handleSaveOwnerLanguage = async () => {
    if (!selectedOwner || !ownerNewLang) return;
    setSaving(true);
    try {
      const res = await superadminApi.put(`/owners/${selectedOwner.ownerId}/language`, {
        language: ownerNewLang,
      });
      toast.success(res?.data?.message || "Owner default language updated successfully.");
      setOwners((prev) =>
        prev.map((o) =>
          o.ownerId === selectedOwner.ownerId
            ? {
                ...o,
                defaultLanguage: ownerNewLang,
                defaultLanguageName: res?.data?.data?.defaultLanguageName || ownerNewLang,
              }
            : o
        )
      );
      setSelectedOwner(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update owner language.");
    } finally {
      setSaving(false);
    }
  };

  // Master Language active/inactive toggle
  const handleToggleStatus = async (code, currentActive) => {
    try {
      const res = await superadminApi.patch(`/languages/${code}/status`, {
        active: !currentActive,
      });
      toast.success(res?.data?.message || "Language status updated.");
      fetchMasterLanguages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle language status.");
    }
  };

  // Filter branches
  const filteredBranches = branches.filter((b) => {
    const term = branchSearch.toLowerCase();
    return (
      (b.branchName && b.branchName.toLowerCase().includes(term)) ||
      (b.branchCode && b.branchCode.toLowerCase().includes(term)) ||
      (b.ownerName && b.ownerName.toLowerCase().includes(term)) ||
      (b.city && b.city.toLowerCase().includes(term)) ||
      (b.languageName && b.languageName.toLowerCase().includes(term))
    );
  });

  // Filter owners
  const filteredOwners = owners.filter((o) => {
    const term = ownerSearch.toLowerCase();
    return (
      (o.ownerName && o.ownerName.toLowerCase().includes(term)) ||
      (o.email && o.email.toLowerCase().includes(term)) ||
      (o.mobile && o.mobile.toLowerCase().includes(term)) ||
      (o.defaultLanguageName && o.defaultLanguageName.toLowerCase().includes(term))
    );
  });

  return (
    <SuperAdminLayout>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          🌐 Multilingual & Language Management
        </h2>
        <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
          Configure languages across all 13 supported languages. Change individual branch languages, owner default languages, and toggle active languages.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "1.25rem",
          overflowX: "auto",
        }}
      >
        <button
          onClick={() => setActiveTab("branches")}
          style={{
            padding: "0.65rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            borderBottom: activeTab === "branches" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "branches" ? "#2563eb" : "#64748b",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
          }}
        >
          <i className="fa fa-building" />
          <span>Branch Languages ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("owners")}
          style={{
            padding: "0.65rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            borderBottom: activeTab === "owners" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "owners" ? "#2563eb" : "#64748b",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
          }}
        >
          <i className="fa fa-user-circle" />
          <span>Owner Default Languages ({owners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("master")}
          style={{
            padding: "0.65rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            borderBottom: activeTab === "master" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "master" ? "#2563eb" : "#64748b",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
          }}
        >
          <i className="fa fa-language" />
          <span>13 Supported Languages Master</span>
        </button>
      </div>

      {/* TAB 1: BRANCH LANGUAGES */}
      {activeTab === "branches" && (
        <div>
          {/* Search bar */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ position: "relative", minWidth: "260px", flex: 1, maxWidth: "420px" }}>
              <i
                className="fa fa-search"
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
              />
              <input
                type="text"
                placeholder="Search branch name, code, owner, city..."
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.75rem 0.45rem 2.2rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Total Branches: <strong style={{ color: "#1e293b" }}>{filteredBranches.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "850px", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Branch Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Branch Code</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Owner Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>City</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Current Language</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                        <i className="fa fa-spinner fa-spin fa-2x" />
                        <p style={{ margin: "0.5rem 0 0" }}>Loading branches...</p>
                      </td>
                    </tr>
                  ) : filteredBranches.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                        No branches found.
                      </td>
                    </tr>
                  ) : (
                    filteredBranches.map((b) => (
                      <tr key={b.branchCode} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#1e293b" }}>{b.branchName}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#64748b", fontFamily: "monospace" }}>{b.branchCode}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>{b.ownerName || `Owner #${b.ownerId}`}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{b.city || "-"}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span className={`badge ${b.status ? "bg-success" : "bg-danger"}`}>
                            {b.status ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            style={{
                              backgroundColor: "#dbeafe",
                              color: "#1d4ed8",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "12px",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                            }}
                          >
                            {b.languageName || b.language} {b.isRtl ? "[RTL]" : ""}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                          <button
                            onClick={() => {
                              setSelectedBranch(b);
                              setBranchNewLang(b.language || "en");
                            }}
                            style={{
                              backgroundColor: "#2563eb",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.35rem 0.85rem",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <i className="fa fa-language" />
                            <span>Change Language</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OWNER DEFAULT LANGUAGES */}
      {activeTab === "owners" && (
        <div>
          {/* Search bar */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ position: "relative", minWidth: "260px", flex: 1, maxWidth: "420px" }}>
              <i
                className="fa fa-search"
                style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
              />
              <input
                type="text"
                placeholder="Search owner name, email, mobile, language..."
                value={ownerSearch}
                onChange={(e) => setOwnerSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.75rem 0.45rem 2.2rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Total Owners: <strong style={{ color: "#1e293b" }}>{filteredOwners.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "850px", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Owner ID</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Owner Name</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Email</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Mobile</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Default Language</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Personal Language</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                        No business owners found.
                      </td>
                    </tr>
                  ) : (
                    filteredOwners.map((o) => (
                      <tr key={o.ownerId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#64748b" }}>#{o.ownerId}</td>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#1e293b" }}>{o.ownerName}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>{o.email}</td>
                        <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>{o.mobile}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>
                          <span
                            style={{
                              backgroundColor: "#e0e7ff",
                              color: "#3730a3",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "12px",
                              fontWeight: 600,
                              fontSize: "0.8rem",
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
                                padding: "0.25rem 0.6rem",
                                borderRadius: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {o.personalLanguageName || o.personalLanguage}
                            </span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Same as Default</span>
                          )}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                          <button
                            onClick={() => {
                              setSelectedOwner(o);
                              setOwnerNewLang(o.defaultLanguage || "en");
                            }}
                            style={{
                              backgroundColor: "#2563eb",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.35rem 0.85rem",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <i className="fa fa-language" />
                            <span>Change Default Language</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 13 LANGUAGES MASTER */}
      {activeTab === "master" && (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "750px", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Code</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Language Name</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Native Script / Name</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Layout Direction</th>
                  <th style={{ padding: "0.75rem 1rem" }}>System Status</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Toggle Active / Inactive</th>
                </tr>
              </thead>
              <tbody>
                {(masterLanguages.length > 0 ? masterLanguages : SUPPORTED_LANGUAGES).map((l) => {
                  const code = l.languageCode || l.code;
                  const name = l.languageName || l.name;
                  const native = l.nativeName || name;
                  const isRtl = l.rtl !== undefined ? l.rtl : l.isRtl;
                  const isActive = l.active !== undefined ? l.active : true;

                  return (
                    <tr key={code} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontWeight: 700, color: "#2563eb" }}>
                        {code}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#1e293b" }}>{name}</td>
                      <td style={{ padding: "0.75rem 1rem", fontSize: "1rem" }}>{native}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            backgroundColor: isRtl ? "#fef3c7" : "#f1f5f9",
                            color: isRtl ? "#b45309" : "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          {isRtl ? "RTL (Right to Left)" : "LTR (Left to Right)"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.6rem",
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
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                        <button
                          onClick={() => handleToggleStatus(code, isActive)}
                          style={{
                            backgroundColor: isActive ? "#ef4444" : "#10b981",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "5px",
                            padding: "0.3rem 0.75rem",
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
        </div>
      )}

      {/* CHANGE BRANCH LANGUAGE MODAL */}
      {selectedBranch && (
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
              borderRadius: "12px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                Change Branch Language
              </h4>
              <button
                onClick={() => setSelectedBranch(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", color: "#64748b", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                <div style={{ marginBottom: "0.35rem" }}>
                  <strong>Branch:</strong> {selectedBranch.branchName} ({selectedBranch.branchCode})
                </div>
                <div style={{ marginBottom: "0.35rem" }}>
                  <strong>Owner:</strong> {selectedBranch.ownerName || `Owner #${selectedBranch.ownerId}`}
                </div>
                <div>
                  <strong>Current Language:</strong>{" "}
                  <span className="badge bg-primary ms-1">
                    {selectedBranch.languageName || selectedBranch.language}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontWeight: 600, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                  Select New Language:
                </label>
                <select
                  value={branchNewLang}
                  onChange={(e) => setBranchNewLang(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "#ffffff",
                    outline: "none",
                  }}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName}){l.isRtl ? " [RTL]" : ""}
                    </option>
                  ))}
                </select>
                <small style={{ color: "#64748b", display: "block", marginTop: "0.4rem", fontSize: "0.75rem" }}>
                  Note: Updating this branch language will only apply to users mapped to this branch. Other branches and owner personal language will remain unaffected.
                </small>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedBranch(null)}
                  disabled={saving}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBranchLanguage}
                  disabled={saving || branchNewLang === selectedBranch.language}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Save Language"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE OWNER DEFAULT LANGUAGE MODAL */}
      {selectedOwner && (
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
              borderRadius: "12px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                Change Owner Default Language
              </h4>
              <button
                onClick={() => setSelectedOwner(null)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", color: "#64748b", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
                <div style={{ marginBottom: "0.35rem" }}>
                  <strong>Owner Name:</strong> {selectedOwner.ownerName}
                </div>
                <div style={{ marginBottom: "0.35rem" }}>
                  <strong>Email:</strong> {selectedOwner.email}
                </div>
                <div>
                  <strong>Current Default Language:</strong>{" "}
                  <span className="badge bg-primary ms-1">
                    {selectedOwner.defaultLanguageName || selectedOwner.defaultLanguage || "English"}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontWeight: 600, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                  Select New Default Language:
                </label>
                <select
                  value={ownerNewLang}
                  onChange={(e) => setOwnerNewLang(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    backgroundColor: "#ffffff",
                    outline: "none",
                  }}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.nativeName}){l.isRtl ? " [RTL]" : ""}
                    </option>
                  ))}
                </select>
                <small style={{ color: "#64748b", display: "block", marginTop: "0.4rem", fontSize: "0.75rem" }}>
                  Note: Sets the default language for this account. If the owner has configured a personal language, their personal language will take precedence until reset.
                </small>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedOwner(null)}
                  disabled={saving}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOwnerLanguage}
                  disabled={saving || ownerNewLang === selectedOwner.defaultLanguage}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Save Default Language"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminLanguages;
