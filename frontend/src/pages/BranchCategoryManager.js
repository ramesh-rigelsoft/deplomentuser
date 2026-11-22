import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import Header from "../components/Header";
import { useTranslation } from "../i18n";
import deviceData from "../asset/device.json";

export default function BranchCategoryManager() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ownerId = parseInt(Cookies.get("secretCode"));

  // All categories from device.json
  const allCategories = deviceData.categories || [];

  // Branch list from API
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selected branch
  const [selectedBranchId, setSelectedBranchId] = useState("");

  // Form state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryTypes, setCategoryTypes] = useState([]); // filtered items for selected category
  const [selectedCategoryTypes, setSelectedCategoryTypes] = useState([]); // multi-select chosen items

  // Saved data from Database: list of { id, ownerId, branchCode, category, categoryType, hsn, gst }
  const [savedCategories, setSavedCategories] = useState([]);

  // ─── Fetch branches & saved categories on mount ───
  useEffect(() => {
    if (ownerId) {
      loadInitialData();
    }
    // eslint-disable-next-line
  }, [ownerId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Fetch branches
      const branchRes = await API.fetchOfficeBranch(dispatch, { userId: ownerId });
      const list = branchRes?.payload?.data?.branchList || branchRes?.data?.branchList || [];
      setBranches(list);

      if (list.length > 0) {
        setSelectedBranchId(list[0].id);
      }

      // Fetch saved categories from database
      await fetchSavedCategories();
    } catch (err) {
      console.error("loadInitialData error:", err);
      fail("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCategories = async () => {
    try {
      const res = await API.fetchBranchCategories(dispatch, { ownerId });
      const catList = res?.payload?.data?.categories || res?.data?.categories || [];
      setSavedCategories(catList);
    } catch (err) {
      console.error("fetchSavedCategories error:", err);
    }
  };

  // ─── When category changes, update available categoryTypes ───
  useEffect(() => {
    if (selectedCategory) {
      const found = allCategories.find((c) => c.category === selectedCategory);
      setCategoryTypes(found ? found.items : []);
    } else {
      setCategoryTypes([]);
    }
    setSelectedCategoryTypes([]);
  }, [selectedCategory]);

  // ─── Handlers ───
  const handleCategoryTypeToggle = (item) => {
    setSelectedCategoryTypes((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleSelectAll = () => {
    if (selectedCategoryTypes.length === categoryTypes.length) {
      setSelectedCategoryTypes([]);
    } else {
      setSelectedCategoryTypes([...categoryTypes]);
    }
  };

  const getSelectedBranch = () => branches.find((b) => b.id === selectedBranchId);

  const handleAddCategories = async () => {
    const branch = getSelectedBranch();
    if (!branch) {
      fail("Please select a branch");
      return;
    }
    if (!selectedCategory) {
      fail("Please select a category");
      return;
    }
    if (selectedCategoryTypes.length === 0) {
      fail("Please select at least one category type");
      return;
    }

    try {
      setSaving(true);
      const itemsPayload = selectedCategoryTypes.map((item) => {
        let gstVal = "18%";
        if (item.gst) {
          if (item.gst.igst !== undefined) {
            gstVal = `${item.gst.igst}%`;
          } else if (item.gst.up_to_32_inch) {
            gstVal = `${item.gst.up_to_32_inch.igst}% / ${item.gst.above_32_inch.igst}%`;
          }
        }
        return {
          categoryType: item.name,
          hsn: item.hsn || "",
          gst: gstVal,
        };
      });

      const payload = {
        ownerId,
        branchId: branch.id ? String(branch.id) : "",
        branchCode: branch.branchCode,
        category: selectedCategory,
        items: itemsPayload,
      };

      const res = await API.saveBranchCategory(dispatch, payload);

      if (res?.payload?.code === "200" || res?.code === "200") {
        success(res?.payload?.message || "Categories saved to database successfully!");
        // Refresh from database
        await fetchSavedCategories();
        // Reset form
        setSelectedCategory("");
        setCategoryTypes([]);
        setSelectedCategoryTypes([]);
      } else {
        fail(res?.payload?.message || "Failed to save categories");
      }
    } catch (err) {
      console.error("Save error:", err);
      fail("Error saving categories to database");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const res = await API.deleteBranchCategory(dispatch, { id: entryId });
      if (res?.payload?.code === "200" || res?.code === "200") {
        success("Category removed from database!");
        setSavedCategories((prev) => prev.filter((item) => item.id !== entryId));
      } else {
        fail(res?.payload?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      fail("Error deleting category");
    }
  };

  const handleDeleteAllForBranch = async (branch) => {
    if (!branch) return;
    if (!window.confirm(`Are you sure you want to remove all categories for branch ${branch.branchName}?`)) {
      return;
    }
    try {
      const res = await API.clearBranchCategories(dispatch, {
        ownerId,
        branchCode: branch.branchCode,
      });
      if (res?.payload?.code === "200" || res?.code === "200") {
        success("All categories removed for this branch!");
        setSavedCategories((prev) =>
          prev.filter(
            (item) => item.branchCode?.toLowerCase() !== branch.branchCode?.toLowerCase()
          )
        );
      } else {
        fail(res?.payload?.message || "Failed to clear categories");
      }
    } catch (err) {
      console.error("Clear error:", err);
      fail("Error clearing branch categories");
    }
  };

  const selectedBranch = getSelectedBranch();

  // Filter saved categories for the selected branch
  const currentBranchData = savedCategories.filter((item) => {
    if (!selectedBranch) return false;
    return (
      (item.branchCode &&
        selectedBranch.branchCode &&
        item.branchCode.toLowerCase() === selectedBranch.branchCode.toLowerCase()) ||
      (item.branchId && String(item.branchId) === String(selectedBranch.id))
    );
  });

  // Group by category for display
  const groupedByCategory = currentBranchData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // ─── Render ───
  return (
    <div className="page-scroll container-fluid px-2 px-sm-3 px-md-4 py-3">
      <Header
        title="Branch Category Management"
        subTitle="Assign category types to branches from device catalog (Database Connected)"
        dashboard="1"
      />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading branches & categories from database...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-building text-muted" style={{ fontSize: "3rem" }}></i>
          <p className="text-muted mt-2">
            {t("No branches found. Please add branches first.", "No branches found. Please add branches first.")}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {/* ─── LEFT: Add Form ─── */}
          <div className="col-12 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary bg-opacity-10 border-0 py-3">
                <h6 className="mb-0 fw-bold text-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  {t("Add Category Types", "Add Category Types")}
                </h6>
              </div>
              <div className="card-body p-3">
                {/* Branch Select */}
                <div className="mb-3">
                  <label className="form-label small fw-bold mb-1">
                    {t("Select Branch", "Select Branch")}
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedBranchId}
                    onChange={(e) =>
                      setSelectedBranchId(
                        e.target.value ? (isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)) : ""
                      )
                    }
                  >
                    <option value="">{t("-- Select Branch --", "-- Select Branch --")}</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.branchName} ({b.branchCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Select */}
                <div className="mb-3">
                  <label className="form-label small fw-bold mb-1">
                    {t("Category", "Category")}
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">{t("-- Select Category --", "-- Select Category --")}</option>
                    {allCategories.map((cat, i) => (
                      <option key={i} value={cat.category}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Type Multi-Select */}
                {selectedCategory && categoryTypes.length > 0 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label small fw-bold mb-0">
                        {t("Category Type", "Category Type")}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        onClick={handleSelectAll}
                      >
                        {selectedCategoryTypes.length === categoryTypes.length
                          ? t("Deselect All", "Deselect All")
                          : t("Select All", "Select All")}
                      </button>
                    </div>
                    <div
                      className="border rounded p-2"
                      style={{
                        maxHeight: "220px",
                        overflowY: "auto",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      {categoryTypes.map((item) => {
                        const isSelected = selectedCategoryTypes.some((s) => s.id === item.id);
                        return (
                          <div
                            key={item.id}
                            className={`form-check d-flex align-items-center px-2 py-1 rounded mb-1 ${
                              isSelected ? "bg-primary bg-opacity-10" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCategoryTypeToggle(item)}
                          >
                            <input
                              className="form-check-input me-2 flex-shrink-0"
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ cursor: "pointer" }}
                            />
                            <label
                              className="form-check-label small w-100"
                              style={{ cursor: "pointer" }}
                            >
                              {item.name}
                              <span className="text-muted ms-1" style={{ fontSize: "11px" }}>
                                (HSN: {item.hsn})
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    {selectedCategoryTypes.length > 0 && (
                      <small className="text-success mt-1 d-block">
                        <i className="bi bi-check-circle me-1"></i>
                        {selectedCategoryTypes.length} selected
                      </small>
                    )}
                  </div>
                )}

                {/* Add Button */}
                <button
                  className="btn btn-success btn-sm w-100"
                  onClick={handleAddCategories}
                  disabled={
                    saving ||
                    !selectedBranchId ||
                    !selectedCategory ||
                    selectedCategoryTypes.length === 0
                  }
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up me-1"></i>
                      {t("Save to Database", "Save to Database")}
                      {selectedCategoryTypes.length > 0 && ` (${selectedCategoryTypes.length})`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Branch Category Table ─── */}
          <div className="col-12 col-lg-7 col-xl-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info"
                    style={{ width: "36px", height: "36px", fontSize: "15px" }}
                  >
                    <i className="bi bi-building"></i>
                  </span>
                  <div>
                    <h6 className="mb-0 fw-bold">
                      {selectedBranch?.branchName || "Select a Branch"}
                    </h6>
                    <small className="text-muted">
                      {selectedBranch?.branchCode
                        ? `${selectedBranch.branchCode} • ${selectedBranch.city || ""}`
                        : ""}
                    </small>
                  </div>
                  <span className="badge bg-primary ms-2">
                    {currentBranchData.length} Saved in DB
                  </span>
                </div>
                {currentBranchData.length > 0 && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteAllForBranch(selectedBranch)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    {t("Clear All", "Clear All")}
                  </button>
                )}
              </div>

              <div className="card-body p-0">
                {currentBranchData.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-tags" style={{ fontSize: "2.5rem" }}></i>
                    <p className="mt-2 mb-0">
                      {t(
                        "No category types saved in database for this branch. Use the form to add.",
                        "No category types saved in database for this branch. Use the form to add."
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3" style={{ width: "45px" }}>#</th>
                          <th>{t("Category", "Category")}</th>
                          <th>{t("Category Type", "Category Type")}</th>
                          <th>{t("HSN", "HSN")}</th>
                          <th className="text-center">{t("GST", "GST")}</th>
                          <th className="text-center" style={{ width: "70px" }}>{t("Action", "Action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(groupedByCategory).map((catName) => {
                          const items = groupedByCategory[catName];
                          return items.map((entry, idx) => {
                            const overallIdx =
                              currentBranchData.findIndex((e) => e.id === entry.id) + 1;

                            return (
                              <tr key={entry.id}>
                                <td className="ps-3 text-muted small">{overallIdx}</td>
                                <td>
                                  {idx === 0 ? (
                                    <span className="badge bg-secondary bg-opacity-75">
                                      {entry.category}
                                    </span>
                                  ) : (
                                    <span className="text-muted small">
                                      ↳ {entry.category}
                                    </span>
                                  )}
                                </td>
                                <td className="fw-semibold">{entry.categoryType}</td>
                                <td>
                                  <code className="small">{entry.hsn || "—"}</code>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-success bg-opacity-75">
                                    {entry.gst || "18%"}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <button
                                    className="btn btn-outline-danger btn-sm py-0 px-1"
                                    title="Delete from DB"
                                    onClick={() => handleDeleteEntry(entry.id)}
                                  >
                                    <i className="bi bi-trash" style={{ fontSize: "12px" }}></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Branch Tabs at Bottom */}
              {branches.length > 1 && (
                <div
                  className="card-footer bg-light border-top d-flex flex-wrap gap-1 py-2 px-3"
                  style={{ overflowX: "auto" }}
                >
                  <small className="text-muted me-2 align-self-center fw-bold">
                    {t("Switch Branch:", "Switch Branch:")}
                  </small>
                  {branches.map((b) => {
                    const count = savedCategories.filter(
                      (item) =>
                        (item.branchCode &&
                          b.branchCode &&
                          item.branchCode.toLowerCase() === b.branchCode.toLowerCase()) ||
                        (item.branchId && String(item.branchId) === String(b.id))
                    ).length;

                    return (
                      <button
                        key={b.id}
                        className={`btn btn-sm ${
                          selectedBranchId === b.id
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        style={{ fontSize: "12px" }}
                        onClick={() => setSelectedBranchId(b.id)}
                      >
                        {b.branchName}
                        {count > 0 && (
                          <span className="badge bg-white text-primary ms-1">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
