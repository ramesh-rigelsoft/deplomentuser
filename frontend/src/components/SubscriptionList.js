import React, { useEffect, useState } from "react";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";

const SubscriptionPlanList = () => {
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
  // RAZORPAY PAYMENT
  // =========================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (orderData) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      fail("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amountInPaise,
      currency: orderData.currency || "INR",
      name: "RigelSoft Subscription",
      description: orderData.subscriptionName || "Subscription Plan",
      order_id: orderData.orderId,
      handler: function (response) {
        console.log("Razorpay payment response:", response);
        const verificationData = {
          userId: ownerId,
          branchCode: branchCode,
          subscriptionCode: subscriptionCode,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        };

        API.paySubscription(dispatch, verificationData)
          .then((verifyRes) => {
            if (
              verifyRes?.payload?.code === "201" ||
              verifyRes?.payload?.status === "CREATED"
            ) {
              success(
                verifyRes?.payload?.message ||
                  "Subscription activated successfully!"
              );
              setSelectedPlan(null);
              setSubscriptionCode("");
              setBranchCode("");
              fetchMySubscriptions();
            } else {
              fail(verifyRes?.payload?.message || "Payment verification failed.");
            }
          })
          .catch((verifyErr) => {
            console.error("Payment verification error:", verifyErr);
            fail(
              verifyErr?.response?.data?.message ||
                "Payment verification error."
            );
          });
      },
      prefill: {
        name: Cookies.get("name") || "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.error("Razorpay Payment Failed:", response.error);
      fail(
        "Payment failed: " +
          (response.error?.description || "Transaction cancelled")
      );
    });
    rzp.open();
  };

  // =========================================
  // PAY
  // =========================================

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
    };

    console.log("User Subscription Request:", paymentData);

    API.paySubscription(dispatch, paymentData)
      .then((res) => {
        console.log("User Subscription Response:", res);

        const payload = res?.payload;

        // If Razorpay order created, trigger Razorpay modal
        if (payload?.data?.paymentRequired && payload?.data?.orderId) {
          openRazorpayCheckout(payload.data);
          return;
        }

        if (
          payload?.code === "201" ||
          payload?.status === "CREATED"
        ) {
          success(payload?.message);
          setSelectedPlan(null);
          setSubscriptionCode("");
          setBranchCode("");
          fetchMySubscriptions();
        } else {
          fail(payload?.message);
        }
      })
      .catch((err) => {
        console.error("User Subscription Error:", err);
        fail(err?.response?.data?.message || "Failed to process subscription.");
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
    <div className="container py-3 page-scroll">

      <Header
        title="Subscription Plans"
        subTitle="Choose the subscription plan that suits your business"
        dashboard="1"
      />

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

            <div className="col-12 col-md-3">

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

            <div className="col-12 col-md-3">

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

            <div className="col-12 col-md-3">

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

            <div className="col-12 col-md-2">

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

            <div className="col-12 col-md-1">

              <button
                type="button"
                className="btn btn-success w-100"
                onClick={handlePay}
              >
                Pay
              </button>

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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

            <div className="col-md-3">

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
      {/* MY SUBSCRIBE PLAN LIST */}
      {/* ========================================= */}

      <div className="card shadow p-2 p-md-3 mb-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h5 className="mb-0">
              My Subscribe Plan List
            </h5>

            <small className="text-muted">
              Your subscription history
            </small>
          </div>

          <button
            type="button"
            className="btn btn-info btn-sm text-white"
            onClick={fetchMySubscriptions}
            disabled={subscriptionLoading}
          >
            {subscriptionLoading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-sm align-middle">

            <thead>

              <tr>

                <th>#</th>

                <th>Plan Name</th>

                <th>Plan Code</th>

                <th>Type</th>

                <th>Branch</th>

                <th>Amount</th>

                <th>Duration</th>

                <th>Start Date</th>

                {/* <th>Active</th> */}

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {subscriptionLoading ? (

                <tr>

                  <td
                    colSpan="11"
                    className="text-center"
                  >
                    Loading My Subscriptions...
                  </td>

                </tr>

              ) : mySubscriptions.length === 0 ? (

                <tr>

                  <td
                    colSpan="11"
                    className="text-center"
                  >
                    No Subscribed Plans Found
                  </td>

                </tr>

              ) : (

                mySubscriptions.map(
                  (subscription, index) => (

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

                      {/* ACTIVE */}

                      {/* <td>

                        {subscription.active ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            Inactive
                          </span>
                        )}

                      </td> */}

                      {/* STATUS */}

                      <td>

                        {subscription.status ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            Expaired
                          </span>
                        )}

                      </td>

                      {/* VIEW */}

                      <td>

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

                      </td>

                    </tr>

                  )
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

          <h5 className="mb-0">
            Subscription Plan List
          </h5>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={
              subscriptionPlanList
            }
          >
            Refresh
          </button>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-sm align-middle">

            <thead>

              <tr>

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
                    className="text-center"
                  >
                    Loading...
                  </td>

                </tr>

              ) : plans.length === 0 ? (

                <tr>

                  <td
                    colSpan="14"
                    className="text-center"
                  >
                    No Subscription Plans Found
                  </td>

                </tr>

              ) : (

                plans.map(
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

                        {plan.status ? (

                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              handleSubscribe(
                                plan
                              )
                            }
                          >
                            Subscribe
                          </button>

                        ) : (

                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            disabled
                          >
                            Inactive
                          </button>

                        )}

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