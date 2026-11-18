import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  FaBoxes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaPauseCircle,
  FaExclamationTriangle,
  FaTimes
} from "react-icons/fa";
import Header from "../components/Header";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import { useTranslation } from "../i18n";
import devicesData from "../components/data/device.json";
import itemBrandsData from "../components/data/itembrand.json";

const EMPTY_FORM = (ownerId, branchCode = "") => ({
  id: null,
  ownerId,
  branchCode,
  category: "",
  categoryType: "",
  selectedBrand: "",
  customBrand: "",
  brand: "",
  model: "",
  skuCode: "",
  minimumStockCount: 5,
  status: true
});

const normalizeItemName = (str) => (str ? str.toLowerCase().replace(/[\s\-_]+/g, "") : "");

const findItemId = (categoryTypeName) => {
  if (!categoryTypeName || !devicesData?.categories) return "97";
  const rawTarget = categoryTypeName.trim().toLowerCase();
  const normalizedTarget = normalizeItemName(rawTarget);
  for (const cat of devicesData.categories) {
    if (cat.items) {
      const found = cat.items.find((i) => {
        if (!i.name) return false;
        const rawName = i.name.trim().toLowerCase();
        return rawName === rawTarget || normalizeItemName(rawName) === normalizedTarget;
      });
      if (found && found.id) return found.id;
    }
  }
  return "97";
};

const getComputedSkuCode = (brand, categoryType) => {
  const b = brand && brand.trim() ? brand.trim() : "";
  if (!b && !categoryType) return "";
  const id = findItemId(categoryType);
  return b ? `${b}|${id}` : `[Brand]|${id}`;
};

export default function LowStockAlert() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const secret = Cookies.get("secretCode");
  const ownerId = secret ? parseInt(secret, 10) : null;

  // State
  const [alerts, setAlerts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [formData, setFormData] = useState(EMPTY_FORM(ownerId));
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (ownerId) {
      loadBranches();
      loadAlerts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  // Escape key closes modal
  useEffect(() => {
    if (!showModal) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) setShowModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal, submitting]);

  const loadBranches = () => {
    if (!ownerId) return;
    API.fetchOfficeBranch(dispatch, { userId: ownerId })
      .then((res) => {
        const list = res?.payload?.data?.branchList || res?.data?.branchList || [];
        setBranches(list);
        if (list.length > 0) {
          setFormData((prev) =>
            prev.branchCode ? prev : { ...prev, branchCode: list[0].branchCode }
          );
        }
      })
      .catch((err) => {
        console.error("Failed to load branches", err);
      });
  };

  const loadAlerts = (branchCode = selectedBranchFilter) => {
    if (!ownerId) return;
    setLoading(true);
    const reqData = {
      ownerId,
      branchCode: branchCode === "ALL" ? null : branchCode
    };

    API.fetchLowStockAlerts(dispatch, reqData)
      .then((res) => {
        setLoading(false);
        const list = res?.payload?.data?.alerts || res?.data?.alerts || [];
        setAlerts(list);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch low stock alerts", err);
        fail(err?.message || "Failed to load low stock alerts");
      });
  };

  const handleBranchFilterChange = (e) => {
    const bCode = e.target.value;
    setSelectedBranchFilter(bCode);
    loadAlerts(bCode);
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData(EMPTY_FORM(ownerId, branches.length > 0 ? branches[0].branchCode : ""));
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (alert) => {
    setModalMode("edit");

    let matchedCat = "";
    if (devicesData?.categories) {
      for (const cat of devicesData.categories) {
        if (cat.items && cat.items.some((i) => i.name === alert.categoryType)) {
          matchedCat = cat.category;
          break;
        }
      }
    }

    const availableBrands = itemBrandsData?.brands?.[alert.categoryType] || [];
    const isStandardBrand = availableBrands.some(
      (b) =>
        b.value &&
        alert.brand &&
        b.value.toLowerCase() === alert.brand.toLowerCase() &&
        b.value.toLowerCase() !== "other"
    );

    setFormData({
      id: alert.id,
      ownerId: alert.ownerId || ownerId,
      branchCode: alert.branchCode,
      category: matchedCat,
      categoryType: alert.categoryType,
      selectedBrand: isStandardBrand ? alert.brand : alert.brand ? "Other" : "",
      customBrand: isStandardBrand ? "" : alert.brand || "",
      brand: alert.brand,
      model: alert.model === "All Models" ? "" : (alert.model || ""),
      skuCode: alert.skuCode || `${alert.brand}|${findItemId(alert.categoryType)}`,
      minimumStockCount: alert.minimumStockCount,
      status: alert.status
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.branchCode || !formData.branchCode.trim()) {
      errors.branchCode = "Select a branch";
    }
    if (!formData.categoryType || !formData.categoryType.trim()) {
      errors.categoryType = "Select or enter an item type";
    }
    if (!formData.selectedBrand || !formData.selectedBrand.trim()) {
      errors.selectedBrand = "Select or enter a brand";
    } else if (
      formData.selectedBrand === "Other" &&
      (!formData.customBrand || !formData.customBrand.trim())
    ) {
      errors.customBrand = "Enter the brand name";
    }
    if (
      formData.minimumStockCount === "" ||
      formData.minimumStockCount === null ||
      Number(formData.minimumStockCount) < 0
    ) {
      errors.minimumStockCount = "Enter 0 or more";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const resolvedBrand =
      formData.selectedBrand === "Other"
        ? formData.customBrand.trim()
        : formData.selectedBrand.trim();

    const itemId = findItemId(formData.categoryType);
    const alertSKUCode = `${resolvedBrand}|${itemId}`;

    const payload = {
      id: formData.id,
      ownerId,
      branchCode: formData.branchCode.trim(),
      categoryType: formData.categoryType.trim(),
      brand: resolvedBrand,
      model: formData.model && formData.model.trim() ? formData.model.trim() : "All Models",
      skuCode: alertSKUCode,
      minimumStockCount: parseInt(formData.minimumStockCount, 10),
      status: formData.status
    };

    API.saveLowStockAlert(dispatch, payload)
      .then((res) => {
        setSubmitting(false);
        const code = res?.payload?.code || res?.code;
        if (code === "200" || res?.payload?.status === "OK") {
          success(modalMode === "add" ? "Alert created" : "Alert updated");
          setShowModal(false);
          loadAlerts(selectedBranchFilter);
        } else {
          fail(res?.payload?.message || res?.message || "Could not save the alert");
        }
      })
      .catch((err) => {
        setSubmitting(false);
        fail(err?.message || "Could not save the alert");
      });
  };

  const handleToggleStatus = (alert) => {
    const newStatus = !alert.status;
    API.updateLowStockAlertStatus(dispatch, { id: alert.id, status: newStatus })
      .then((res) => {
        const code = res?.payload?.code || res?.code;
        if (code === "200" || res?.payload?.status === "OK") {
          success(`Alert ${newStatus ? "activated" : "deactivated"}`);
          setAlerts((prev) =>
            prev.map((item) => (item.id === alert.id ? { ...item, status: newStatus } : item))
          );
        } else {
          fail(res?.payload?.message || res?.message || "Could not update status");
        }
      })
      .catch((err) => {
        fail(err?.message || "Could not update status");
      });
  };

  const handleDeleteAlert = (alert) => {
    if (window.confirm(`Delete the low stock alert for ${alert.brand} ${alert.model}?`)) {
      API.deleteLowStockAlert(dispatch, { id: alert.id })
        .then((res) => {
          const code = res?.payload?.code || res?.code;
          if (code === "200" || res?.payload?.status === "OK") {
            success("Alert deleted");
            setAlerts((prev) => prev.filter((item) => item.id !== alert.id));
          } else {
            fail(res?.payload?.message || res?.message || "Could not delete the alert");
          }
        })
        .catch((err) => {
          fail(err?.message || "Could not delete the alert");
        });
    }
  };

  // Form options
  const selectedCategoryObj = devicesData?.categories?.find(
    (c) => c.category === formData.category
  );
  const itemTypeOptions = selectedCategoryObj?.items?.map((i) => i.name) || [];
  const rawBrandOptions = itemBrandsData?.brands?.[formData.categoryType] || [];
  const brandOptions = [...rawBrandOptions];
  if (!brandOptions.some((b) => b.value && b.value.toLowerCase() === "other")) {
    brandOptions.push({ value: "Other", label: "Other" });
  }

  // Filtering
  const q = searchQuery.toLowerCase();
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      (alert.brand && alert.brand.toLowerCase().includes(q)) ||
      (alert.categoryType && alert.categoryType.toLowerCase().includes(q)) ||
      (alert.model && alert.model.toLowerCase().includes(q)) ||
      (alert.branchCode && alert.branchCode.toLowerCase().includes(q)) ||
      (alert.skuCode && alert.skuCode.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
          ? alert.status === true
          : alert.status === false;

    return matchesSearch && matchesStatus;
  });

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((a) => a.status).length;
  const inactiveAlerts = totalAlerts - activeAlerts;

  const kpis = [
    { key: "total", label: t("total_configured_alerts", "Total alerts"), value: totalAlerts, icon: <FaBoxes />, tone: "primary" },
    { key: "active", label: t("active_alerts", "Active"), value: activeAlerts, icon: <FaCheckCircle />, tone: "success" },
    { key: "inactive", label: t("inactive_alerts", "Inactive"), value: inactiveAlerts, icon: <FaPauseCircle />, tone: "secondary" }
  ];

  return (
    <div className="bg-light page-scroll container-fluid px-2 px-sm-3 px-md-4 py-3 min-vh-100 lsa-page">
      <style>{`
        .lsa-page .lsa-kpi { border-radius: 12px; }
        .lsa-page .lsa-kpi-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .lsa-page .lsa-table thead th { font-size: 12px; font-weight: 600; color: #6c757d; background: #f8f9fa; border-bottom: 1px solid #e9ecef; padding: 12px 16px; white-space: nowrap; }
        .lsa-page .lsa-table tbody td { padding: 14px 16px; vertical-align: middle; border-color: #f1f3f5; }
        .lsa-page .lsa-threshold { display: inline-flex; align-items: baseline; gap: 6px; font-weight: 700; font-size: 16px; color: #b42318; }
        .lsa-page .lsa-threshold small { font-weight: 500; font-size: 12px; color: #6c757d; }
        .lsa-page .lsa-switch { display: inline-flex; align-items: center; gap: 8px; border: 0; background: transparent; padding: 0; cursor: pointer; font-size: 13px; font-weight: 600; }
        .lsa-page .lsa-switch-track { width: 34px; height: 20px; border-radius: 20px; background: #ced4da; position: relative; transition: background .15s; }
        .lsa-page .lsa-switch-track::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .15s; box-shadow: 0 1px 2px rgba(0,0,0,.25); }
        .lsa-page .lsa-switch.on .lsa-switch-track { background: #198754; }
        .lsa-page .lsa-switch.on .lsa-switch-track::after { transform: translateX(14px); }
        .lsa-page .lsa-switch:focus-visible, .lsa-page .lsa-icon-btn:focus-visible { outline: 2px solid #0d6efd; outline-offset: 2px; border-radius: 6px; }
        .lsa-page .lsa-icon-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid #dee2e6; background: #fff; display: inline-flex; align-items: center; justify-content: center; color: #495057; }
        .lsa-page .lsa-icon-btn:hover { background: #f1f3f5; }
        .lsa-page .lsa-icon-btn.danger:hover { background: #fdecea; color: #b42318; border-color: #f5c2c0; }
        .lsa-modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, .5); z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .lsa-modal { background: #fff; width: 100%; max-width: 720px; max-height: calc(100vh - 32px); border-radius: 14px; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
        .lsa-modal-body { overflow-y: auto; padding: 20px 24px; }
        .lsa-modal-section { font-size: 13px; font-weight: 700; color: #343a40; margin: 4px 0 12px; }
        @media (prefers-reduced-motion: reduce) { .lsa-page .lsa-switch-track, .lsa-page .lsa-switch-track::after { transition: none; } }
      `}</style>

      <Header
        title={t("low_stock_alert", "Low Stock Alert")}
        subTitle={t("low_stock_alert_subtitle", "Manage and configure low stock alert thresholds by branch")}
        dashboard="4"
      />

      {/* KPI cards */}
      <div className="row g-3 mb-3">
        {kpis.map((k) => (
          <div className="col-12 col-sm-4" key={k.key}>
            <div className="card border-0 shadow-sm lsa-kpi h-100">
              <div className="card-body d-flex align-items-center gap-3 py-3">
                <div className={`lsa-kpi-icon bg-${k.tone}-subtle text-${k.tone}`}>{k.icon}</div>
                <div>
                  <div className="text-muted small">{k.label}</div>
                  <div className="fs-4 fw-bold lh-1 mt-1">{k.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card border-0 shadow-sm rounded-3 mb-3">
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            <div className="col-6 col-lg-3">
              <label className="form-label small text-muted mb-1" htmlFor="lsa-branch">
                {t("branch", "Branch")}
              </label>
              <select
                id="lsa-branch"
                className="form-select form-select-sm"
                value={selectedBranchFilter}
                onChange={handleBranchFilterChange}
              >
                <option value="ALL">{t("all_branches", "All branches")}</option>
                {branches.map((b) => (
                  <option key={b.branchCode} value={b.branchCode}>
                    {b.branchName} ({b.branchCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-lg-2">
              <label className="form-label small text-muted mb-1" htmlFor="lsa-status">
                {t("status", "Status")}
              </label>
              <select
                id="lsa-status"
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">{t("all", "All")}</option>
                <option value="ACTIVE">{t("active", "Active")}</option>
                <option value="INACTIVE">{t("inactive", "Inactive")}</option>
              </select>
            </div>

            <div className="col-12 col-lg">
              <label className="form-label small text-muted mb-1" htmlFor="lsa-search">
                {t("search", "Search")}
              </label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  id="lsa-search"
                  type="text"
                  className="form-control border-start-0"
                  placeholder={t("search_by_brand_model", "Brand, model, item type or branch")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-auto">
              <button
                className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                style={{ height: 31 }}
                onClick={handleOpenAddModal}
              >
                <FaPlus size={12} /> {t("add_low_stock_alert", "Add alert")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-header bg-white border-0 px-3 py-3 d-flex flex-wrap justify-content-between align-items-center gap-1">
          <h6 className="mb-0 fw-bold">
            {t("configured_thresholds", "Stock thresholds")}{" "}
            <span className="text-muted fw-normal">({filteredAlerts.length})</span>
          </h6>
          <span className="text-muted small">
            {t("auto_alerts_desc", "An alert triggers when stock is at or below the minimum count")}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover lsa-table mb-0">
            <thead>
              <tr>
                <th scope="col" style={{ width: 56 }}>#</th>
                <th scope="col">{t("branch", "Branch")}</th>
                <th scope="col">{t("sku_code", "SKU Code")}</th>
                <th scope="col">{t("category_type", "Item type")}</th>
                <th scope="col">{t("brand", "Brand")}</th>
                <th scope="col">{t("model", "Model")}</th>
                <th scope="col" className="text-center">{t("min_stock_count", "Alert at")}</th>
                <th scope="col">{t("status", "Status")}</th>
                <th scope="col" className="text-end" style={{ width: 110 }}>{t("actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                    {t("loading_alerts", "Loading alerts...")}
                  </td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-muted">
                    <FaBoxes size={32} className="opacity-50 mb-2" />
                    <div className="fw-semibold text-dark">
                      {alerts.length > 0
                        ? t("no_match", "No alerts match your filters")
                        : t("no_alerts_found", "No low stock alerts yet")}
                    </div>
                    <small>
                      {alerts.length > 0
                        ? t("clear_filters_hint", "Clear the search or filters to see all alerts.")
                        : t("click_add_alert", "Use \"Add alert\" to set your first threshold.")}
                    </small>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert, idx) => {
                  const branchInfo = branches.find((b) => b.branchCode === alert.branchCode);
                  return (
                    <tr key={alert.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td>
                        <div className="fw-medium">{branchInfo ? branchInfo.branchName : alert.branchCode}</div>
                        {branchInfo && <div className="text-muted small">{alert.branchCode}</div>}
                      </td>
                      <td>
                        <span className="badge bg-light text-primary border font-monospace px-2 py-1">
                          {alert.skuCode || `${alert.brand}|${findItemId(alert.categoryType)}`}
                        </span>
                      </td>
                      <td>{alert.categoryType}</td>
                      <td>{alert.brand}</td>
                      <td className="fw-semibold">{alert.model}</td>
                      <td className="text-center">
                        <span className="lsa-threshold">
                          &le; {alert.minimumStockCount} <small>pcs</small>
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`lsa-switch ${alert.status ? "on text-success" : "text-muted"}`}
                          role="switch"
                          aria-checked={!!alert.status}
                          onClick={() => handleToggleStatus(alert)}
                          title={alert.status ? t("click_to_deactivate", "Click to deactivate") : t("click_to_activate", "Click to activate")}
                        >
                          <span className="lsa-switch-track" />
                          {alert.status ? t("active", "Active") : t("inactive", "Inactive")}
                        </button>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="lsa-icon-btn"
                            onClick={() => handleOpenEditModal(alert)}
                            title={t("edit", "Edit")}
                            aria-label={t("edit", "Edit")}
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            type="button"
                            className="lsa-icon-btn danger"
                            onClick={() => handleDeleteAlert(alert)}
                            title={t("delete", "Delete")}
                            aria-label={t("delete", "Delete")}
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="lsa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !submitting) setShowModal(false);
          }}
        >
          <div className="lsa-modal" role="dialog" aria-modal="true" aria-labelledby="lsa-modal-title">
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <h5 id="lsa-modal-title" className="mb-0 fw-bold fs-6 d-flex align-items-center gap-2">
                <span className="text-danger d-flex"><FaExclamationTriangle /></span>
                {modalMode === "add"
                  ? t("add_low_stock_alert", "Add low stock alert")
                  : t("update_low_stock_alert", "Edit low stock alert")}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              />
            </div>

            <form onSubmit={handleSubmitForm} className="d-flex flex-column" style={{ minHeight: 0 }}>
              <div className="lsa-modal-body">
                <div className="lsa-modal-section">Item</div>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-branch">
                      {t("branch", "Branch")} <span className="text-danger">*</span>
                    </label>
                    <select
                      id="lsa-f-branch"
                      className={`form-select ${formErrors.branchCode ? "is-invalid" : ""}`}
                      value={formData.branchCode}
                      onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                    >
                      <option value="">{t("select_branch", "Select branch")}</option>
                      {branches.map((b) => (
                        <option key={b.branchCode} value={b.branchCode}>
                          {b.branchName} ({b.branchCode})
                        </option>
                      ))}
                    </select>
                    {formErrors.branchCode && <div className="invalid-feedback">{formErrors.branchCode}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-cat">
                      {t("category", "Main category")}
                    </label>
                    <select
                      id="lsa-f-cat"
                      className="form-select"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          categoryType: "",
                          selectedBrand: "",
                          customBrand: "",
                          brand: ""
                        })
                      }
                    >
                      <option value="">{t("select_category", "Select category")}</option>
                      {devicesData?.categories?.map((cat) => (
                        <option key={cat.category} value={cat.category}>
                          {cat.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-type">
                      {t("category_type", "Item type")} <span className="text-danger">*</span>
                    </label>
                    {itemTypeOptions.length > 0 ? (
                      <select
                        id="lsa-f-type"
                        className={`form-select ${formErrors.categoryType ? "is-invalid" : ""}`}
                        value={formData.categoryType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryType: e.target.value,
                            selectedBrand: "",
                            customBrand: "",
                            brand: ""
                          })
                        }
                      >
                        <option value="">{t("select_item_type", "Select item type")}</option>
                        {itemTypeOptions.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="lsa-f-type"
                        type="text"
                        className={`form-control ${formErrors.categoryType ? "is-invalid" : ""}`}
                        placeholder="e.g. Smartphone, Laptop"
                        value={formData.categoryType}
                        onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
                      />
                    )}
                    {formErrors.categoryType && <div className="invalid-feedback">{formErrors.categoryType}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-brand">
                      {t("brand", "Brand")} <span className="text-danger">*</span>
                    </label>
                    {brandOptions.length > 0 ? (
                      <>
                        <select
                          id="lsa-f-brand"
                          className={`form-select ${formErrors.selectedBrand ? "is-invalid" : ""}`}
                          value={formData.selectedBrand}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              selectedBrand: val,
                              brand: val === "Other" ? prev.customBrand : val
                            }));
                          }}
                        >
                          <option value="">{t("select_brand", "Select brand")}</option>
                          {brandOptions.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.selectedBrand && <div className="invalid-feedback">{formErrors.selectedBrand}</div>}

                        {formData.selectedBrand === "Other" && (
                          <div className="mt-2">
                            <input
                              type="text"
                              className={`form-control ${formErrors.customBrand ? "is-invalid" : ""}`}
                              placeholder={t("enter_other_brand", "Brand name (e.g. Motorola, Nothing)")}
                              value={formData.customBrand}
                              autoFocus
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormData((prev) => ({ ...prev, customBrand: val, brand: val }));
                              }}
                            />
                            {formErrors.customBrand && <div className="invalid-feedback">{formErrors.customBrand}</div>}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          id="lsa-f-brand"
                          type="text"
                          className={`form-control ${formErrors.selectedBrand ? "is-invalid" : ""}`}
                          placeholder="e.g. Apple, Samsung, Dell"
                          value={formData.brand}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              selectedBrand: e.target.value,
                              customBrand: e.target.value,
                              brand: e.target.value
                            })
                          }
                        />
                        {formErrors.selectedBrand && <div className="invalid-feedback">{formErrors.selectedBrand}</div>}
                      </>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-model">
                      {t("model", "Model name / number")}
                    </label>
                    <input
                      id="lsa-f-model"
                      type="text"
                      className="form-control"
                      placeholder="e.g. iPhone 15, Galaxy S23, Latitude 5420 (optional)"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-skucode">
                      {t("sku_code", "SKU Code")}{" "}
                      <small className="text-muted fw-normal">({t("auto_generated", "Auto-generated")})</small>
                    </label>
                    <input
                      id="lsa-f-skucode"
                      type="text"
                      className="form-control font-monospace bg-light"
                      value={
                        getComputedSkuCode(
                          formData.selectedBrand === "Other" ? formData.customBrand : formData.selectedBrand,
                          formData.categoryType
                        ) || t("sku_placeholder", "e.g. Brand|ID")
                      }
                      readOnly
                      title="Generated as Brand|Id from device.json"
                    />
                  </div>
                </div>

                <div className="lsa-modal-section">Alert rule</div>
                <div className="row g-3 align-items-start">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold" htmlFor="lsa-f-min">
                      {t("minimum_stock_count", "Alert when stock is at or below")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-group has-validation">
                      <span className="input-group-text bg-light">&le;</span>
                      <input
                        id="lsa-f-min"
                        type="number"
                        min="0"
                        className={`form-control ${formErrors.minimumStockCount ? "is-invalid" : ""}`}
                        placeholder="5"
                        value={formData.minimumStockCount}
                        onChange={(e) => setFormData({ ...formData, minimumStockCount: e.target.value })}
                      />
                      <span className="input-group-text bg-light">pcs</span>
                      {formErrors.minimumStockCount && (
                        <div className="invalid-feedback">{formErrors.minimumStockCount}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-label small fw-semibold">{t("status", "Status")}</div>
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="alertStatusSwitch"
                        checked={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                      />
                      <label className="form-check-label ms-1" htmlFor="alertStatusSwitch">
                        {formData.status ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 px-4 py-3 border-top bg-light" style={{ borderRadius: "0 0 14px 14px" }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  {t("cancel", "Cancel")}
                </button>
                <button type="submit" className="btn btn-danger btn-sm px-4 fw-semibold" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      {t("saving", "Saving...")}
                    </>
                  ) : modalMode === "add" ? (
                    t("add_alert", "Create alert")
                  ) : (
                    t("update_alert", "Save changes")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}