import React, { useEffect, useState } from "react";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";
import { useTranslation } from "../i18n";

const SubscriptionPlanList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ownerId = parseInt(Cookies.get("secretCode"));

  const [plans, setPlans] = useState([]);
  const [branches, setBranches] = useState([]);

  // My subscribed plans
  const [mySubscriptions, setMySubscriptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] =
    useState(false);

  // Selected subscription
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Selected subscribed plan for View
  const [viewSubscription, setViewSubscription] =
    useState(null);

  // Subscription form
  const [subscriptionCode, setSubscriptionCode] =
    useState("");

  const [branchCode, setBranchCode] = useState("");
  const [isQueueSelected, setIsQueueSelected] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState("ALL");
  const [showOnlyActivePlans, setShowOnlyActivePlans] = useState(true);

  // Date and Remaining Days helpers
  const getSubscriptionExpiryDate = (sub) => {
    if (!sub) return null;
    if (sub.subscriptionEndAt) {
      return new Date(sub.subscriptionEndAt);
    }
    if (sub.subscriptionStartAt) {
      const d = new Date(sub.subscriptionStartAt);
      const months = sub.subscriptionDuration || sub.month || 1;
      d.setMonth(d.getMonth() + months);
      return d;
    }
    return null;
  };

  const getDaysLeft = (sub) => {
    const expiry = getSubscriptionExpiryDate(sub);
    if (!expiry || isNaN(expiry.getTime())) return null;
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const isSubscriptionExpired = (sub) => {
    if (!sub) return true;
    if (sub.isQueued || sub.queueStatus === "QUEUED") return false;
    const days = getDaysLeft(sub);
    if (days !== null && days <= 0) return true;
    return sub.active === false || sub.status === false;
  };

  // =========================================
  // GET SUBSCRIPTION PLANS
  // =========================================

  useEffect(() => {
    subscriptionPlanList();
  }, []);

  const subscriptionPlanList = () => {
    setLoading(true);

    API.fetchSubscriptionPlan(dispatch, {})
      .then((res) => {
        console.log(
          "Subscription Response:",
          res
        );

        const list =
          res?.payload?.data
            ?.subscriptionPlanList || [];

        setPlans(list);
      })
      .catch((err) => {
        console.error(err);

        fail(
          "Unable to fetch subscription plans."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // =========================================
  // GET MY SUBSCRIBED PLAN LIST
  // =========================================

  useEffect(() => {
    if (!ownerId) return;

    fetchMySubscriptions();
  }, [ownerId]);

  const fetchMySubscriptions = () => {
    if (!ownerId) return;

    setSubscriptionLoading(true);

    API.fetchUserSubscription(dispatch, {
      userId: ownerId,
    })
      .then((res) => {
        console.log(
          "My Subscription Response:",
          res
        );

        const list =
          res?.payload?.data
            ?.mysubscriptionList || [];

        setMySubscriptions(list);
      })
      .catch((err) => {
        console.error(
          "My Subscription Error:",
          err
        );

        setMySubscriptions([]);

        fail(
          "Unable to fetch your subscribed plans."
        );
      })
      .finally(() => {
        setSubscriptionLoading(false);
      });
  };

  // =========================================
  // GET BRANCH LIST
  // =========================================

  useEffect(() => {
    if (!ownerId) return;

    setBranchLoading(true);

    API.fetchOfficeBranch(dispatch, {
      userId: ownerId,
    })
      .then((res) => {
        console.log(
          "Branch Response:",
          res
        );

        const list =
          res?.payload?.data?.branchList || [];

        setBranches(list);
      })
      .catch((err) => {
        console.error(err);

        fail(
          "Unable to fetch branch list."
        );
      })
      .finally(() => {
        setBranchLoading(false);
      });
  }, [ownerId, dispatch]);

  // =========================================
  // SUBSCRIBE BUTTON
  // =========================================

  const handleSubscribe = (plan) => {
    setViewSubscription(null);

    setSelectedPlan(plan);

    setSubscriptionCode(
      plan.subscriptionCode || ""
    );

    setBranchCode("");

    setTimeout(() => {
      document
        .getElementById(
          "subscription-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // =========================================
  // CANCEL
  // =========================================

  const handleCancel = () => {
    setSelectedPlan(null);

    setSubscriptionCode("");

    setBranchCode("");
  };

  // =========================================
  // VIEW MY SUBSCRIPTION
  // =========================================

  const handleViewSubscription = (
    subscription
  ) => {
    setSelectedPlan(null);

    setViewSubscription(subscription);

    setTimeout(() => {
      document
        .getElementById(
          "my-subscription-detail"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // =========================================
  // CLOSE VIEW
  // =========================================

  const handleCloseView = () => {
    setViewSubscription(null);
  };

  // =========================================
  // PAY
  // =========================================

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePay = () => {
  if (!selectedPlan) {
    fail("Please select a subscription plan.");
    return;
  }

  if (!subscriptionCode) {
    fail("Subscription code is required.");
    return;
  }

  if (!branchCode) {
    fail("Please select a branch.");
    return;
  }

  const paymentData = {
    userId: ownerId,
    branchCode: branchCode,
    subscriptionCode: subscriptionCode,
    isQueued: isQueueSelected,
  };

  API.paySubscription(dispatch, paymentData)
    .then(async (res) => {
      const orderData = res?.payload?.data;

      // Handle Razorpay Payment flow
      if (orderData?.paymentRequired || orderData?.orderId) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded && !orderData.mockMode) {
          fail("Unable to load Razorpay payment gateway. Please check your internet connection.");
          return;
        }

        if (orderData.mockMode || !window.Razorpay) {
          const proceed = window.confirm(
            `Razorpay Test/Mock Mode: Complete payment of ₹${orderData.amount} for ${orderData.subscriptionName}?`
          );
          if (proceed) {
            completeVerification({
              ...paymentData,
              razorpayOrderId: orderData.orderId,
              razorpayPaymentId: "pay_mock_" + Date.now(),
              razorpaySignature: "mock_signature",
            });
          }
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency || "INR",
          name: "RigelSoft Technologies",
          description: orderData.subscriptionName || "Subscription Plan",
          order_id: orderData.orderId,
          handler: function (response) {
            completeVerification({
              ...paymentData,
              razorpayOrderId: response.razorpay_order_id || orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          prefill: {
            name: Cookies.get("userName") || "Business Owner",
            email: Cookies.get("userEmail") || "",
            contact: Cookies.get("userMobile") || "",
          },
          theme: {
            color: "#2563eb",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          fail("Payment failed: " + (resp.error?.description || "Transaction declined"));
        });
        rzp.open();
        return;
      }

      if (
        res?.payload?.code === "201" ||
        res?.payload?.status === "CREATED"
      ) {
        success(res?.payload?.message || "Subscription activated successfully!");
        setSelectedPlan(null);
        setSubscriptionCode("");
        setBranchCode("");
        setIsQueueSelected(false);
        fetchMySubscriptions();
      } else {
        fail(res?.payload?.message || "Subscription request failed.");
      }
    })
    .catch((err) => {
      fail(err?.response?.data?.message || err?.message || "Error initiating subscription payment.");
    });
};

const completeVerification = (verifyData) => {
  API.paySubscription(dispatch, verifyData)
    .then((res) => {
      if (
        res?.payload?.code === "201" ||
        res?.payload?.status === "CREATED"
      ) {
        success(res?.payload?.message || "Payment verified & subscription activated!");
        setSelectedPlan(null);
        setSubscriptionCode("");
        setBranchCode("");
        setIsQueueSelected(false);
        fetchMySubscriptions();
      } else {
        fail(res?.payload?.message || "Payment verification failed.");
      }
    })
    .catch((err) => {
      fail(err?.response?.data?.message || "Payment verification failed.");
    });
};

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-IN"
      );
    } catch (error) {
      return date;
    }
  };

  // =========================================
  // BOOLEAN HELPER
  // =========================================

  const isMultipleBranch = (plan) => {
    return (
      plan?.multipleBranch === true ||
      plan?.isMultipleBranch === true
    );
  };

  const isMultipleUser = (plan) => {
    return (
      plan?.multipleUser === true ||
      plan?.isMultipleUser === true
    );
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 page-scroll">

      <Header
        title="Subscription Plans"
        subTitle="Choose the subscription plan that suits your business"
        dashboard="1"
      />

      {/* ACTIVE SUBSCRIPTION OVERVIEW BANNER */}
      {(() => {
        const activeSub = mySubscriptions.find(
          (s) => !isSubscriptionExpired(s) && !s.isQueued && s.queueStatus !== "QUEUED"
        );
        const queuedSub = mySubscriptions.find(
          (s) => s.status !== false && (s.isQueued || s.queueStatus === "QUEUED")
        );

        if (queuedSub) {
          return (
            <div className="alert alert-success border-success shadow-sm mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 fw-bold text-success">
                    ✅ Subscription Renewal Queued: {queuedSub.subscriptionName}
                  </h6>
                  <div className="small text-muted">
                    Your renewal is already confirmed. It will automatically activate on{" "}
                    <strong>{formatDate(queuedSub.subscriptionStartAt)}</strong>. Multiple renewals or duplicate subscriptions are not allowed.
                  </div>
                </div>
                <div className="mt-2 mt-md-0">
                  <span className="badge bg-success fs-6">Renewal Confirmed (1 Max)</span>
                </div>
              </div>
            </div>
          );
        }

        if (activeSub) {
          const days = getDaysLeft(activeSub);
          const isExpiringSoon = days !== null && days <= 30;
          return (
            <div className={`alert ${isExpiringSoon ? "alert-warning border-warning" : "alert-info border-info"} shadow-sm mb-4`}>
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 fw-bold text-dark">
                    🌟 Active Plan: {activeSub.subscriptionName} ({activeSub.subscriptionType || "Active"})
                  </h6>
                  <div className="small text-muted">
                    Branch: <strong>{activeSub.branchCode || "Primary"}</strong> | 
                    Valid From: <strong>{formatDate(activeSub.subscriptionStartAt)}</strong> | 
                    Expiry: <strong>{formatDate(getSubscriptionExpiryDate(activeSub))}</strong>
                  </div>
                </div>
                <div className="mt-2 mt-md-0 d-flex align-items-center gap-2">
                  <span className={`badge ${isExpiringSoon ? "bg-warning text-dark" : "bg-success"} fs-6`}>
                    {days !== null ? `${days} Days Left` : "Active"}
                  </span>
                  {isExpiringSoon && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        const p = plans.find((x) => x.subscriptionCode === activeSub.subscriptionCode) || plans[0];
                        if (p) handleSubscribe(p);
                      }}
                    >
                      Renew Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        } else if (mySubscriptions.length > 0) {
          return (
            <div className="alert alert-danger border-danger shadow-sm mb-4 d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h6 className="mb-1 fw-bold text-danger">⚠ Your subscription has expired!</h6>
                <small className="text-muted">Please renew your plan or choose an active plan below to continue full access.</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger mt-2 mt-md-0"
                onClick={() => {
                  const p = plans.find((x) => x.status !== false);
                  if (p) handleSubscribe(p);
                }}
              >
                Subscribe Now
              </button>
            </div>
          );
        }
        return null;
      })()}

      {/* ========================================= */}
      {/* SELECTED SUBSCRIPTION SECTION */}
      {/* ========================================= */}

      {selectedPlan && (
        <div
          id="subscription-section"
          className="card shadow p-3 mb-4 border-primary"
        >

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h5 className="mb-0 text-primary">
              Subscribe to Plan
            </h5>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

          <div className="row g-3 align-items-end">

            {/* PLAN NAME */}
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">
                Subscription Plan
              </label>
              <input
                type="text"
                className="form-control"
                value={
                  selectedPlan.subscriptionName ||
                  ""
                }
                readOnly
              />
            </div>

            {/* SUBSCRIPTION CODE */}
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">
                Subscription Code
              </label>
              <input
                type="text"
                className="form-control"
                value={subscriptionCode}
                readOnly
              />
            </div>

            {/* BRANCH CODE */}
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label">
                Branch Code
              </label>
              <select
                className="form-select"
                value={branchCode}
                onChange={(e) =>
                  setBranchCode(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Branch
                </option>
                {branchLoading ? (
                  <option disabled>
                    Loading branches...
                  </option>
                ) : (
                  branches.map(
                    (branch) => (
                      <option
                        key={branch.id}
                        value={
                          branch.branchCode
                        }
                      >
                        {
                          branch.branchCode
                        }{" "}
                        -{" "}
                        {
                          branch.branchName
                        }
                      </option>
                    )
                  )
                )}
              </select>
            </div>

            {/* AMOUNT */}
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label">
                Payable Amount
              </label>
              <input
                type="text"
                className="form-control"
                value={`₹${
                  selectedPlan.totalAmount ||
                  0
                }`}
                readOnly
              />
            </div>

            {/* PAY */}
            <div className="col-12 col-sm-12 col-lg-1">
              <button
                type="button"
                className="btn btn-success w-100 py-2 fw-bold"
                onClick={handlePay}
              >
                Pay
              </button>
            </div>

            {/* AUTOMATED RENEWAL NOTE */}
            <div className="col-12 mt-2">
              <small className="text-muted">
                <i className="fa fa-info-circle text-primary me-1"></i>
                <strong>Notice:</strong> Only 1 active subscription and 1 renewal cycle can be held at any time. When renewing an active plan, the new plan automatically queues and activates seamlessly at expiry without losing any days.
              </small>
            </div>

          </div>

        </div>
      )}

      {/* ========================================= */}
      {/* MY SUBSCRIBED PLAN DETAIL */}
      {/* ========================================= */}

      {viewSubscription && (
        <div
          id="my-subscription-detail"
          className="card shadow p-3 mb-4 border-info"
        >

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h5 className="mb-0 text-info">
                My Subscribed Plan
              </h5>

              <small className="text-muted">
                Subscription Details
              </small>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleCloseView}
            >
              Close
            </button>

          </div>

          <div className="row g-3">

            {/* PLAN NAME */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Plan Name
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.subscriptionName ||
                  ""
                }
                readOnly
              />

            </div>

            {/* CODE */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Subscription Code
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.subscriptionCode ||
                  ""
                }
                readOnly
              />

            </div>

            {/* TYPE */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Subscription Type
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.subscriptionType ||
                  ""
                }
                readOnly
              />

            </div>

            {/* BRANCH */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Branch Code
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.branchCode ||
                  ""
                }
                readOnly
              />

            </div>

            {/* AMOUNT */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Amount / Month
              </label>

              <input
                className="form-control"
                value={`₹${
                  viewSubscription.amountPerMonth ||
                  0
                }`}
                readOnly
              />

            </div>

            {/* GST */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                GST
              </label>

              <input
                className="form-control"
                value={`${
                  viewSubscription.gst ||
                  0
                }%`}
                readOnly
              />

            </div>

            {/* TOTAL */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Total Amount
              </label>

              <input
                className="form-control"
                value={`₹${
                  viewSubscription.totalAmount ||
                  0
                }`}
                readOnly
              />

            </div>

            {/* DURATION */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Duration
              </label>

              <input
                className="form-control"
                value={`${
                  viewSubscription.subscriptionDuration ||
                  viewSubscription.month ||
                  0
                } Month`}
                readOnly
              />

            </div>

            {/* START DATE */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Subscription Start
              </label>

              <input
                className="form-control"
                value={formatDate(
                  viewSubscription.subscriptionStartAt
                )}
                readOnly
              />

            </div>

            {/* STATUS */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Status
              </label>

              <div className="mt-2">

                {viewSubscription.status &&
                viewSubscription.active ? (
                  <span className="badge bg-success fs-6">
                    Active
                  </span>
                ) : (
                  <span className="badge bg-danger fs-6">
                    Inactive
                  </span>
                )}

              </div>

            </div>

            {/* MULTIPLE BRANCH */}

            {/* <div className="col-md-3">

              <label className="form-label">
                Multiple Branch
              </label>

              <div>

                {isMultipleBranch(
                  viewSubscription
                ) ? (
                  <span className="badge bg-success">
                    Yes
                  </span>
                ) : (
                  <span className="badge bg-secondary">
                    No
                  </span>
                )}

              </div>

            </div> */}

            {/* BRANCH COUNT */}

            {/* <div className="col-md-3">

              <label className="form-label">
                Branch Count
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.branchCount ||
                  0
                }
                readOnly
              />

            </div> */}

            {/* PER BRANCH USER */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Per Branch User
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.perBranchUser ||
                  0
                }
                readOnly
              />

            </div>

            {/* MULTIPLE USER */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                Multiple User
              </label>

              <div>

                {isMultipleUser(
                  viewSubscription
                ) ? (
                  <span className="badge bg-success">
                    Yes
                  </span>
                ) : (
                  <span className="badge bg-secondary">
                    No
                  </span>
                )}

              </div>

            </div>

            {/* USER COUNT */}

            <div className="col-12 col-sm-6 col-lg-3">

              <label className="form-label">
                User Count
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.userCount ||
                  0
                }
                readOnly
              />

            </div>

            {/* SUK COUNT */}

            {/* <div className="col-md-3">

              <label className="form-label">
                SUK Count
              </label>

              <input
                className="form-control"
                value={
                  viewSubscription.SUKCount ||
                  0
                }
                readOnly
              />

            </div> */}

            {/* PERMISSIONS */}

            <div className="col-12">

              <label className="form-label">
                Permissions
              </label>

              <textarea
                className="form-control"
                rows="3"
                value={
                  viewSubscription.permissions ||
                  ""
                }
                readOnly
              />

            </div>

          </div>

        </div>
      )}

      {/* ========================================= */}
      {/* MY ACTIVE SUBSCRIPTION */}
      {/* ========================================= */}

      <div className="card shadow p-2 p-md-3 mb-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h5 className="mb-0 text-success">
              My Active Subscriptions
            </h5>

            <small className="text-muted">
              Active & queued subscription details
            </small>
          </div>

          <button
            type="button"
            className="btn btn-info btn-sm text-white"
            onClick={fetchMySubscriptions}
            disabled={subscriptionLoading}
          >
            {subscriptionLoading ? "Loading..." : "Refresh"}
          </button>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-sm align-middle">

            <thead>

              <tr className="table-light text-nowrap">

                <th>#</th>

                <th>Plan Name</th>

                <th>Plan Code</th>

                <th>Type</th>

                <th>Branch</th>

                <th>Amount</th>

                <th>Duration</th>

                <th>Start Date</th>

                <th>Expiry Date</th>

                <th>Days Left</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {subscriptionLoading ? (

                <tr>

                  <td
                    colSpan="12"
                    className="text-center py-3 text-muted"
                  >
                    Loading Subscriptions...
                  </td>

                </tr>

              ) : mySubscriptions.filter((s) => !isSubscriptionExpired(s)).length === 0 ? (

                <tr>

                  <td
                    colSpan="12"
                    className="text-center py-3 text-muted"
                  >
                    No Active Subscription Found. Please subscribe to an active plan below.
                  </td>

                </tr>

              ) : (

                mySubscriptions
                  .filter((sub) => !isSubscriptionExpired(sub))
                  .map(
                  (subscription, index) => {
                    const expiryDate = getSubscriptionExpiryDate(subscription);
                    const daysLeft = getDaysLeft(subscription);
                    const isQueued = subscription.isQueued || subscription.queueStatus === "QUEUED";
                    const hasAnyQueued = mySubscriptions.some((s) => s.status !== false && (s.isQueued || s.queueStatus === "QUEUED"));
                    const isExpiringSoon = !isQueued && !hasAnyQueued && daysLeft !== null && daysLeft <= 30;

                    return (
                    <tr
                      key={
                        subscription.id ||
                        index
                      }
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {
                            subscription.subscriptionName
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          subscription.subscriptionCode
                        }
                      </td>

                      <td>
                        {
                          subscription.subscriptionType
                        }
                      </td>

                      <td>
                        {
                          subscription.branchCode ||
                          "-"
                        }
                      </td>

                      <td>
                        ₹
                        {
                          subscription.totalAmount ||
                          0
                        }
                      </td>

                      <td>
                        {
                          subscription.subscriptionDuration ||
                          subscription.month ||
                          0
                        }{" "}
                        Month
                      </td>

                      <td>
                        {formatDate(
                          subscription.subscriptionStartAt
                        )}
                      </td>

                      <td>
                        {formatDate(expiryDate)}
                      </td>

                      {/* DAYS LEFT */}
                      <td>
                        {isQueued ? (
                          <span className="badge bg-info text-white">
                            Queued Plan
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="badge bg-warning text-dark fw-bold">
                            ⚠ {daysLeft} Days Left
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            {daysLeft !== null ? `${daysLeft} Days Left` : "Active"}
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td>
                        {isQueued ? (
                          <span className="badge bg-info text-white">
                            Queued
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            Active
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-info text-white"
                            onClick={() =>
                              handleViewSubscription(
                                subscription
                              )
                            }
                          >
                            View
                          </button>

                          {isExpiringSoon && (
                            <button
                              type="button"
                              className="btn btn-sm btn-warning text-dark fw-bold"
                              onClick={() => {
                                const matchingPlan = plans.find((p) => p.subscriptionCode === subscription.subscriptionCode && p.status !== false) || plans.find((p) => p.status !== false);
                                if (matchingPlan) handleSubscribe(matchingPlan);
                              }}
                            >
                              Renew Now
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ========================================= */}
      {/* AVAILABLE PLAN LIST */}
      {/* ========================================= */}

      <div className="card shadow p-2 p-md-3">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h5 className="mb-0">
              Subscription Plan List
            </h5>
            <small className="text-muted">
              Active plans available to purchase
            </small>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={subscriptionPlanList}
          >
            Refresh
          </button>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-sm align-middle">

            <thead>

              <tr className="table-light text-nowrap">

                <th>#</th>

                <th>Plan Name</th>

                <th>Plan Code</th>

                <th>Type</th>

                <th>Amount / Month</th>

                <th>GST</th>

                <th>Total Amount</th>

                <th>Duration</th>

                {/* <th>Multiple Branch</th>

                <th>Branch Count</th> */}

                <th>Multiple User</th>

                <th>User Count</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="14"
                    className="text-center py-3 text-muted"
                  >
                    Loading...
                  </td>

                </tr>

              ) : plans.filter((p) => p.status !== false).length === 0 ? (

                <tr>

                  <td
                    colSpan="14"
                    className="text-center py-3 text-muted"
                  >
                    No Active Subscription Plans Found
                  </td>

                </tr>

              ) : (

                plans.filter((p) => p.status !== false).map(
                  (plan, index) => (

                    <tr
                      key={
                        plan.id ||
                        index
                      }
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {
                            plan.subscriptionName
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          plan.subscriptionCode
                        }
                      </td>

                      <td>
                        {
                          plan.subscriptionType
                        }
                      </td>

                      <td>
                        ₹
                        {
                          plan.amountPerMonth
                        }
                      </td>

                      <td>
                        {plan.gst}%
                      </td>

                      <td>
                        ₹
                        {
                          plan.totalAmount
                        }
                      </td>

                      <td>
                        {
                          plan.month
                        }{" "}
                        Month
                      </td>

                      {/* <td>

                        {isMultipleBranch(
                          plan
                        ) ? (

                          <span className="badge bg-success">
                            Yes
                          </span>

                        ) : (

                          <span className="badge bg-secondary">
                            No
                          </span>

                        )}

                      </td> */}

                      {/* <td>
                        {
                          plan.branchCount
                        }
                      </td> */}

                      <td>

                        {isMultipleUser(
                          plan
                        ) ? (

                          <span className="badge bg-success">
                            Yes
                          </span>

                        ) : (

                          <span className="badge bg-secondary">
                            No
                          </span>

                        )}

                      </td>

                      <td>
                        {
                          plan.userCount
                        }
                      </td>

                      <td>

                        {plan.status ? (

                          <span className="badge bg-success">
                            Active
                          </span>

                        ) : (

                          <span className="badge bg-danger">
                            InActive
                          </span>

                        )}

                      </td>

                      {/* ACTION */}
                      <td>
                        {(() => {
                          const activeSub = mySubscriptions.find(
                            (s) => !isSubscriptionExpired(s) && !s.isQueued && s.queueStatus !== "QUEUED"
                          );
                          const queuedSub = mySubscriptions.find(
                            (s) => s.status !== false && (s.isQueued || s.queueStatus === "QUEUED")
                          );

                          if (queuedSub) {
                            return (
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                disabled
                                title="Renewal already queued for this account"
                              >
                                Renewal Queued
                              </button>
                            );
                          }

                          if (activeSub) {
                            const days = getDaysLeft(activeSub);
                            const isExpiringSoon = days !== null && days <= 30;
                            if (isExpiringSoon) {
                              return (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-warning text-dark fw-bold"
                                  onClick={() => handleSubscribe(plan)}
                                >
                                  Renew
                                </button>
                              );
                            } else {
                              return (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  disabled
                                  title="Plan currently active. Renewal opens 30 days before expiry."
                                >
                                  Plan Active
                                </button>
                              );
                            }
                          }

                          if (plan.status) {
                            return (
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => handleSubscribe(plan)}
                              >
                                Subscribe
                              </button>
                            );
                          }

                          return (
                            <button
                              type="button"
                              className="btn btn-sm btn-secondary"
                              disabled
                            >
                              Inactive
                            </button>
                          );
                        })()}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default SubscriptionPlanList;