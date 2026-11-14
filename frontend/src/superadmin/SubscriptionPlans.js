import React, { useState, useEffect } from "react";
import SuperAdminLayout from "./SuperAdminLayout";
import superadminApi from "./superadminApi";
import { toast } from "react-toastify";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);

  // Form State
  const initialForm = {
    id: 0,
    subscriptionName: "",
    subscriptionCode: "",
    subscriptionType: "YEARLY",
    amountPerMonth: 899,
    month: 12,
    gst: 1941.84,
    totalAmount: 12729.84,
    userCount: 5,
    branchCount: 1,
    isMultipleBranch: false,
    isMultipleUser: true,
    description: "",
    currency: "INR",
    durationUnit: "MONTH",
    features: "Billing, Inventory, Invoices, Reports",
    isRepaireAllow: true,
    isSalesAllow: true,
    isEmployeeAllow: true,
    isReplaceItem: true,
    isReturnItem: true,
    isDownloadInvoice: true,
    isfilterInventory: true,
    isfilterSales: true,
    isDownloadExcelSales: true,
    isDownloadExcelEntryItem: true,
    sukcount: 5000,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchPlans();
  }, [statusFilter]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      let url = "/plans?";
      if (statusFilter === "ACTIVE") url += "status=true&";
      if (statusFilter === "INACTIVE") url += "status=false&";
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await superadminApi.get(url);
      setPlans(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      toast.error("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlans();
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setIsEditing(true);
    setFormData({
      id: plan.id,
      subscriptionName: plan.subscriptionName || "",
      subscriptionCode: plan.subscriptionCode || "",
      subscriptionType: plan.subscriptionType || "YEARLY",
      amountPerMonth: plan.amountPerMonth || 0,
      month: plan.month || 12,
      gst: plan.gst || 0,
      totalAmount: plan.totalAmount || 0,
      userCount: plan.userCount || 1,
      branchCount: plan.branchCount || 1,
      isMultipleBranch: plan.isMultipleBranch || plan.multipleBranch || false,
      isMultipleUser: plan.isMultipleUser || plan.multipleUser || false,
      description: plan.description || "",
      currency: plan.currency || "INR",
      durationUnit: plan.durationUnit || "MONTH",
      features: plan.features || "",
      isRepaireAllow: plan.isRepaireAllow ?? true,
      isSalesAllow: plan.isSalesAllow ?? true,
      isEmployeeAllow: plan.isEmployeeAllow ?? true,
      isReplaceItem: plan.isReplaceItem ?? true,
      isReturnItem: plan.isReturnItem ?? true,
      isDownloadInvoice: plan.isDownloadInvoice ?? true,
      isfilterInventory: plan.isfilterInventory ?? true,
      isfilterSales: plan.isfilterSales ?? true,
      isDownloadExcelSales: plan.isDownloadExcelSales ?? true,
      isDownloadExcelEntryItem: plan.isDownloadExcelEntryItem ?? true,
      sukcount: plan.sukcount || plan.SUKCount || 5000,
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (plan) => {
    const nextStatus = !plan.status;
    const confirmMsg = nextStatus
      ? `Activate '${plan.subscriptionName}'? New owners will be able to subscribe to it.`
      : `Deactivate '${plan.subscriptionName}'? New owners won't be able to subscribe, but existing subscriptions will continue safely until expiry.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await superadminApi.patch(`/plans/${plan.id}/status`, { status: nextStatus });
      toast.success(`Plan marked as ${nextStatus ? "ACTIVE" : "INACTIVE"}`);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update plan status.");
    }
  };

  // Auto calculate total amount
  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const months = formData.month || 1;
    const subtotal = val * months;
    const gstVal = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + gstVal) * 100) / 100;
    setFormData({
      ...formData,
      amountPerMonth: val,
      gst: gstVal,
      totalAmount: total,
    });
  };

  const handleMonthChange = (e) => {
    const months = parseInt(e.target.value) || 1;
    const monthly = formData.amountPerMonth || 0;
    const subtotal = monthly * months;
    const gstVal = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + gstVal) * 100) / 100;
    setFormData({
      ...formData,
      month: months,
      gst: gstVal,
      totalAmount: total,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subscriptionName.trim()) {
      toast.error("Please enter Plan Name.");
      return;
    }
    if (!formData.subscriptionCode.trim()) {
      toast.error("Please enter Plan Code.");
      return;
    }

    try {
      if (isEditing) {
        await superadminApi.put(`/plans/${formData.id}`, formData);
        toast.success("Plan updated successfully!");
      } else {
        await superadminApi.post("/plans", formData);
        toast.success("Plan created successfully!");
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save plan.");
    }
  };

  return (
    <SuperAdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Subscription Plans Management
          </h2>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
            Add, modify, and activate/deactivate subscription plans for businesses
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "0.55rem 1.25rem",
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(37, 99, 235, 0.25)",
          }}
        >
          <i className="fa fa-plus" />
          <span>Add New Plan</span>
        </button>
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
          <div style={{ position: "relative", flex: 1 }}>
            <i
              className="fa fa-search"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            />
            <input
              type="text"
              placeholder="Search by plan name or code..."
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
              backgroundColor: "#334155",
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

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Status:</span>
          {["ALL", "ACTIVE", "INACTIVE"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "0.35rem 0.75rem",
                border: "none",
                borderRadius: "6px",
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

      {/* Plans Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "0.85rem 1rem" }}>#</th>
                <th style={{ padding: "0.85rem 1rem" }}>Plan Name</th>
                <th style={{ padding: "0.85rem 1rem" }}>Code</th>
                <th style={{ padding: "0.85rem 1rem" }}>Duration</th>
                <th style={{ padding: "0.85rem 1rem" }}>Price / Month</th>
                <th style={{ padding: "0.85rem 1rem" }}>GST</th>
                <th style={{ padding: "0.85rem 1rem" }}>Total Price</th>
                <th style={{ padding: "0.85rem 1rem" }}>Max Child Users</th>
                <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    <i className="fa fa-spinner fa-spin fa-2x" />
                    <p style={{ margin: "0.5rem 0 0" }}>Loading plans...</p>
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                    No subscription plans found.
                  </td>
                </tr>
              ) : (
                plans.map((p, index) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      backgroundColor: p.status ? "#ffffff" : "#fbfbfb",
                    }}
                  >
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>{index + 1}</td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "#1e293b" }}>
                      {p.subscriptionName}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          backgroundColor: "#f1f5f9",
                          padding: "0.2rem 0.45rem",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                          color: "#334155",
                        }}
                      >
                        {p.subscriptionCode}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#475569" }}>
                      {p.month} {p.month === 1 ? "Month" : "Months"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>₹{p.amountPerMonth || 0}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b" }}>₹{p.gst || 0}</td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                      ₹{p.totalAmount || 0}
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#475569" }}>
                      <i className="fa fa-users text-primary" style={{ marginRight: "0.35rem" }} />
                      {p.userCount || 1} {p.userCount === 1 ? "user" : "users"}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: p.status ? "#dcfce7" : "#fee2e2",
                          color: p.status ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {p.status ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => setViewPlan(p)}
                          style={{
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            padding: "0.35rem 0.65rem",
                            fontSize: "0.8rem",
                            color: "#334155",
                            cursor: "pointer",
                          }}
                          title="View Details"
                        >
                          <i className="fa fa-eye" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          style={{
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "6px",
                            padding: "0.35rem 0.65rem",
                            fontSize: "0.8rem",
                            color: "#1d4ed8",
                            cursor: "pointer",
                          }}
                          title="Edit Plan"
                        >
                          <i className="fa fa-pencil" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(p)}
                          style={{
                            backgroundColor: p.status ? "#fef2f2" : "#f0fdf4",
                            border: `1px solid ${p.status ? "#fecaca" : "#bbf7d0"}`,
                            borderRadius: "6px",
                            padding: "0.35rem 0.65rem",
                            fontSize: "0.8rem",
                            color: p.status ? "#dc2626" : "#16a34a",
                            cursor: "pointer",
                          }}
                          title={p.status ? "Deactivate Plan" : "Activate Plan"}
                        >
                          <i className={`fa ${p.status ? "fa-ban" : "fa-check"}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Plan Modal */}
      {modalOpen && (
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
              maxWidth: "680px",
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
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
                {isEditing ? "Edit Subscription Plan" : "Create New Subscription Plan"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", color: "#64748b", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Professional"
                    value={formData.subscriptionName}
                    onChange={(e) => setFormData({ ...formData, subscriptionName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Plan Code * (Unique identifier)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    placeholder="e.g. PRO01"
                    value={formData.subscriptionCode}
                    onChange={(e) => setFormData({ ...formData, subscriptionCode: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      backgroundColor: isEditing ? "#f1f5f9" : "#ffffff",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Price / Month (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amountPerMonth}
                    onChange={handleAmountChange}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.month}
                    onChange={handleMonthChange}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Total Amount (incl. 18% GST)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Max Child Users Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.userCount}
                    onChange={(e) => setFormData({ ...formData, userCount: parseInt(e.target.value) || 1 })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                    Max Branch Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.branchCount}
                    onChange={(e) => setFormData({ ...formData, branchCount: parseInt(e.target.value) || 1 })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                  Description / Marketing Summary
                </label>
                <textarea
                  rows="2"
                  placeholder="Short description of this plan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Feature Toggles */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>
                  Feature Permissions & Limits
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.8rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input
                      type="checkbox"
                      checked={formData.isSalesAllow}
                      onChange={(e) => setFormData({ ...formData, isSalesAllow: e.target.checked })}
                    />
                    <span>Sales Management</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input
                      type="checkbox"
                      checked={formData.isRepaireAllow}
                      onChange={(e) => setFormData({ ...formData, isRepaireAllow: e.target.checked })}
                    />
                    <span>Repair Jobs</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input
                      type="checkbox"
                      checked={formData.isEmployeeAllow}
                      onChange={(e) => setFormData({ ...formData, isEmployeeAllow: e.target.checked })}
                    />
                    <span>Employee Manager</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input
                      type="checkbox"
                      checked={formData.isDownloadInvoice}
                      onChange={(e) => setFormData({ ...formData, isDownloadInvoice: e.target.checked })}
                    />
                    <span>Download Invoices</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input
                      type="checkbox"
                      checked={formData.isDownloadExcelSales}
                      onChange={(e) => setFormData({ ...formData, isDownloadExcelSales: e.target.checked })}
                    />
                    <span>Export Sales Excel</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <input
                      type="checkbox"
                      checked={formData.isMultipleBranch}
                      onChange={(e) => setFormData({ ...formData, isMultipleBranch: e.target.checked })}
                    />
                    <span>Multi-Branch</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#334155",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.55rem 1.25rem",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.55rem 1.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {isEditing ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Plan Modal */}
      {viewPlan && (
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
              maxWidth: "520px",
              padding: "1.5rem",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "#0f172a" }}>
                  {viewPlan.subscriptionName}
                </h3>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Code: {viewPlan.subscriptionCode}</span>
              </div>
              <span
                style={{
                  padding: "0.25rem 0.65rem",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: viewPlan.status ? "#dcfce7" : "#fee2e2",
                  color: viewPlan.status ? "#15803d" : "#b91c1c",
                }}
              >
                {viewPlan.status ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              <div><strong>Price / Month:</strong> ₹{viewPlan.amountPerMonth}</div>
              <div><strong>Duration:</strong> {viewPlan.month} Months</div>
              <div><strong>GST (18%):</strong> ₹{viewPlan.gst}</div>
              <div><strong>Total Price:</strong> ₹{viewPlan.totalAmount}</div>
              <div><strong>Max Child Users:</strong> {viewPlan.userCount || 1}</div>
              <div><strong>Max Branches:</strong> {viewPlan.branchCount || 1}</div>
              <div><strong>Multiple Branches:</strong> {viewPlan.isMultipleBranch ? "Yes" : "No"}</div>
              <div><strong>Multi User:</strong> {viewPlan.isMultipleUser ? "Yes" : "No"}</div>
            </div>

            {viewPlan.description && (
              <div style={{ marginBottom: "1rem", fontSize: "0.85rem", color: "#475569" }}>
                <strong>Description:</strong> {viewPlan.description}
              </div>
            )}

            <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
              <button
                onClick={() => setViewPlan(null)}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.45rem 1.25rem",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SubscriptionPlans;
