import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../layout/SuperAdminLayout';
import { superAdminApi } from '../api/superAdminApi';
import {
  PlusCircle,
  PencilSquare,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Search,
  Check,
  X
} from 'react-bootstrap-icons';

export default function SuperAdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); // ADD or EDIT
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    plan: null,
    targetStatus: false,
  });

  const [formData, setFormData] = useState({
    subscriptionName: '',
    description: '',
    subscriptionCode: '',
    subscriptionType: 'MONTHLY',
    amountPerMonth: '',
    month: 1,
    gst: 18.0,
    totalAmount: '',
    userCount: 5,
    branchCount: 1,
    status: true,
    isMultipleUser: true,
    isMultipleBranch: false,
    isRepaireAllow: true,
    isSalesAllow: true,
    isEmployeeAllow: true,
    isDownloadInvoice: true,
    isReplaceItem: true,
    isReturnItem: true,
    isfilterInventory: true,
    isfilterSales: true,
    isDownloadExcelSales: true,
    isDownloadExcelEntryItem: true,
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await superAdminApi.getAllPlans();
      setPlans(res.data || []);
    } catch (err) {
      console.error('Failed to load plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openAddModal = () => {
    setModalMode('ADD');
    setSelectedPlan(null);
    setFormError('');
    setFormData({
      subscriptionName: '',
      description: '',
      subscriptionCode: '',
      subscriptionType: 'MONTHLY',
      amountPerMonth: '',
      month: 1,
      gst: 18.0,
      totalAmount: '',
      userCount: 5,
      branchCount: 1,
      status: true,
      isMultipleUser: true,
      isMultipleBranch: false,
      isRepaireAllow: true,
      isSalesAllow: true,
      isEmployeeAllow: true,
      isDownloadInvoice: true,
      isReplaceItem: true,
      isReturnItem: true,
      isfilterInventory: true,
      isfilterSales: true,
      isDownloadExcelSales: true,
      isDownloadExcelEntryItem: true,
    });
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setModalMode('EDIT');
    setSelectedPlan(plan);
    setFormError('');
    setFormData({
      subscriptionName: plan.subscriptionName || '',
      description: plan.description || '',
      subscriptionCode: plan.subscriptionCode || '',
      subscriptionType: plan.subscriptionType || 'MONTHLY',
      amountPerMonth: plan.amountPerMonth || '',
      month: plan.month || 1,
      gst: plan.gst != null ? plan.gst : 18.0,
      totalAmount: plan.totalAmount || '',
      userCount: plan.userCount || 5,
      branchCount: plan.branchCount || 1,
      status: plan.status,
      isMultipleUser: plan.isMultipleUser,
      isMultipleBranch: plan.isMultipleBranch,
      isRepaireAllow: plan.isRepaireAllow,
      isSalesAllow: plan.isSalesAllow,
      isEmployeeAllow: plan.isEmployeeAllow,
      isDownloadInvoice: plan.isDownloadInvoice,
      isReplaceItem: plan.isReplaceItem,
      isReturnItem: plan.isReturnItem,
      isfilterInventory: plan.isfilterInventory,
      isfilterSales: plan.isfilterSales,
      isDownloadExcelSales: plan.isDownloadExcelSales,
      isDownloadExcelEntryItem: plan.isDownloadExcelEntryItem,
    });
    setShowModal(true);
  };

  const handlePriceChange = (e) => {
    const amountPerMonth = parseFloat(e.target.value) || 0;
    const months = parseInt(formData.month) || 1;
    const subtotal = amountPerMonth * months;
    const gstRate = parseFloat(formData.gst) || 18.0;
    const gstAmount = (subtotal * gstRate) / 100;
    const total = subtotal + gstAmount;

    setFormData({
      ...formData,
      amountPerMonth: e.target.value,
      totalAmount: total.toFixed(2),
    });
  };

  const handleMonthChange = (e) => {
    const months = parseInt(e.target.value) || 1;
    const amountPerMonth = parseFloat(formData.amountPerMonth) || 0;
    const subtotal = amountPerMonth * months;
    const gstRate = parseFloat(formData.gst) || 18.0;
    const gstAmount = (subtotal * gstRate) / 100;
    const total = subtotal + gstAmount;

    setFormData({
      ...formData,
      month: months,
      totalAmount: total.toFixed(2),
    });
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!formData.subscriptionName.trim()) {
      setFormError('Plan name is required.');
      return;
    }
    if (!formData.totalAmount || parseFloat(formData.totalAmount) < 0) {
      setFormError('Valid total amount is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (modalMode === 'ADD') {
        await superAdminApi.createPlan(formData);
      } else {
        await superAdminApi.updatePlan(selectedPlan.id, formData);
        if (selectedPlan.status !== formData.status) {
          await superAdminApi.togglePlanStatus(selectedPlan.id, {
            active: formData.status,
            status: formData.status ? 1 : 2,
          });
        }
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatusPrompt = (plan) => {
    setConfirmModal({
      show: true,
      plan,
      targetStatus: !plan.status,
    });
  };

  const executeToggleStatus = async () => {
    if (!confirmModal.plan) return;
    const planId = confirmModal.plan.id;
    const newStatus = confirmModal.targetStatus;
    try {
      // Optimistic update so UI immediately changes
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, status: newStatus } : p))
      );
      await superAdminApi.togglePlanStatus(planId, {
        active: newStatus,
        status: newStatus ? 1 : 2,
      });
      setConfirmModal({ show: false, plan: null, targetStatus: false });
      await fetchPlans();
    } catch (err) {
      alert('Failed to change plan status: ' + (err.response?.data?.message || err.message));
      await fetchPlans();
    }
  };

  // Filter plans
  const filteredPlans = plans.filter((p) => {
    const matchName = (p.subscriptionName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.subscriptionCode || '').toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'ACTIVE') return matchName && p.status;
    if (statusFilter === 'INACTIVE') return matchName && !p.status;
    return matchName;
  });

  return (
    <SuperAdminLayout title="Subscription Plans Management">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0">
                <Search className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="form-select form-select-sm"
              style={{ width: '140px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <button onClick={openAddModal} className="btn btn-primary d-flex align-items-center">
            <PlusCircle className="me-2" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 text-center text-muted">
          <h5>No subscription plans found.</h5>
          <p>Click "Create New Plan" to add your first subscription tier.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredPlans.map((plan) => (
            <div className="col-12 col-md-6 col-xl-4" key={plan.id}>
              <div className={`card h-100 shadow-sm border-0 ${plan.status ? 'border-top border-primary border-3' : 'opacity-75'}`}>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">{plan.subscriptionName}</h5>
                      <span className="badge bg-light text-secondary border me-1">{plan.subscriptionCode}</span>
                      <span className="badge bg-secondary-subtle text-secondary">{plan.subscriptionType}</span>
                    </div>
                    <span className={`badge ${plan.status ? 'bg-success' : 'bg-danger'}`}>
                      {plan.status ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <p className="text-muted small mb-3 flex-grow-1" style={{ minHeight: '40px' }}>
                    {plan.description || 'No description provided.'}
                  </p>

                  <div className="p-3 bg-light rounded mb-3">
                    <div className="d-flex align-items-baseline justify-content-between">
                      <span className="text-muted small">Total Price:</span>
                      <div>
                        <span className="fs-4 fw-bold text-dark">₹{plan.totalAmount?.toLocaleString('en-IN')}</span>
                        <span className="text-muted small"> / {plan.month} month(s)</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between text-muted small mt-1">
                      <span>Rate: ₹{plan.amountPerMonth}/mo</span>
                      <span>GST: {plan.gst}%</span>
                    </div>
                  </div>

                  {/* Quotas & Features */}
                  <div className="small mb-3">
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Max Users:</span>
                      <span className="fw-semibold">{plan.userCount || 'Unlimited'}</span>
                    </div>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Max Branches:</span>
                      <span className="fw-semibold">{plan.branchCount || 1}</span>
                    </div>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Active Subscribers:</span>
                      <span className="fw-semibold text-primary">{plan.activeSubscriberCount ?? 0}</span>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
                    >
                      <PencilSquare className="me-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatusPrompt(plan)}
                      className={`btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center ${plan.status ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    >
                      {plan.status ? (
                        <>
                          <XCircle className="me-1" /> Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="me-1" /> Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PLAN MODAL */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1060,
            overflowY: 'auto',
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  {modalMode === 'ADD' ? 'Create New Subscription Plan' : `Edit Plan: ${selectedPlan?.subscriptionName}`}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSavePlan}>
                <div className="modal-body p-4">
                  {formError && <div className="alert alert-danger py-2 small">{formError}</div>}

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Plan Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Professional Enterprise"
                        value={formData.subscriptionName}
                        onChange={(e) => setFormData({ ...formData, subscriptionName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Plan Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. PLAN_PRO"
                        value={formData.subscriptionCode}
                        onChange={(e) => setFormData({ ...formData, subscriptionCode: e.target.value })}
                        disabled={modalMode === 'EDIT'}
                      />
                      <small className="text-muted">Unique identifier for plan</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Brief summary of plan inclusions..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Billing Type *</label>
                      <select
                        className="form-select"
                        value={formData.subscriptionType}
                        onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value })}
                      >
                        <option value="MONTHLY">MONTHLY</option>
                        <option value="YEARILY">YEARLY</option>
                        <option value="QUARTERLY">QUARTERLY</option>
                        <option value="HALFYEARLY">HALF YEARLY</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Duration (Months) *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={formData.month}
                        onChange={handleMonthChange}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Amount Per Month (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.amountPerMonth}
                        onChange={handlePriceChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">GST Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.gst}
                        onChange={(e) => {
                          const gstRate = parseFloat(e.target.value) || 0;
                          const subtotal = (parseFloat(formData.amountPerMonth) || 0) * (parseInt(formData.month) || 1);
                          const total = subtotal + (subtotal * gstRate) / 100;
                          setFormData({ ...formData, gst: e.target.value, totalAmount: total.toFixed(2) });
                        }}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Total Amount (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control fw-bold text-success"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Status *</label>
                      <select
                        className="form-select"
                        value={formData.status ? 'ACTIVE' : 'INACTIVE'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value === 'ACTIVE' })}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Maximum Allowed Users</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={formData.userCount}
                        onChange={(e) => setFormData({ ...formData, userCount: parseInt(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Maximum Allowed Branches</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={formData.branchCount}
                        onChange={(e) => setFormData({ ...formData, branchCount: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>

                  <h6 className="fw-bold mt-4 mb-2 text-secondary">Plan Permissions & Feature Toggles</h6>
                  <div className="row g-2">
                    {[
                      { key: 'isSalesAllow', label: 'Allow Sales Module' },
                      { key: 'isRepaireAllow', label: 'Allow Repair Services' },
                      { key: 'isEmployeeAllow', label: 'Allow Employee Management' },
                      { key: 'isDownloadInvoice', label: 'Allow Invoice PDF Download' },
                      { key: 'isDownloadExcelSales', label: 'Allow Excel Sales Export' },
                      { key: 'isDownloadExcelEntryItem', label: 'Allow Excel Entry Export' },
                    ].map((f) => (
                      <div className="col-12 col-md-6" key={f.key}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={!!formData[f.key]}
                            onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                            id={`chk-${f.key}`}
                          />
                          <label className="form-check-label small" htmlFor={`chk-${f.key}`}>
                            {f.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary fw-semibold">
                    {saving ? 'Saving...' : modalMode === 'ADD' ? 'Create Plan' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM TOGGLE STATUS MODAL */}
      {confirmModal.show && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1070,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {confirmModal.targetStatus ? 'Activate Plan' : 'Deactivate Plan'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmModal({ show: false, plan: null, targetStatus: false })}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to change the status of{' '}
                  <strong>{confirmModal.plan?.subscriptionName}</strong> to{' '}
                  <span className={`fw-bold ${confirmModal.targetStatus ? 'text-success' : 'text-danger'}`}>
                    {confirmModal.targetStatus ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  ?
                </p>
                {!confirmModal.targetStatus && (
                  <div className="alert alert-warning small mb-0">
                    <strong>Note:</strong> Deactivating this plan will hide it from new customer subscriptions. Existing subscribers will continue uninterrupted until their current expiry.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmModal({ show: false, plan: null, targetStatus: false })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeToggleStatus}
                  className={`btn ${confirmModal.targetStatus ? 'btn-success' : 'btn-danger'}`}
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}

