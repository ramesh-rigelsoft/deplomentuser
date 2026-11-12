import React, { useEffect, useState } from "react";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Header from "./Header";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // Renewal mode
  const [isRenewal, setIsRenewal] = useState(false);

  // Receipt Modal for Print / Download Slip
  const [receiptModal, setReceiptModal] = useState(null);

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
    setIsRenewal(false);
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
  // RENEW SUBSCRIPTION BUTTON
  // =========================================

  const handleRenewSubscription = (subscription) => {
    setIsRenewal(true);
    setViewSubscription(null);

    const matchedPlan = plans.find(
      (p) => p.subscriptionCode === subscription.subscriptionCode
    ) || {
      subscriptionName: subscription.subscriptionName,
      subscriptionCode: subscription.subscriptionCode,
      subscriptionType: subscription.subscriptionType,
      amountPerMonth: subscription.amountPerMonth,
      gst: subscription.gst,
      totalAmount: subscription.totalAmount,
      month:
        subscription.month ||
        subscription.subscriptionDuration ||
        12,
    };

    setSelectedPlan(matchedPlan);
    setSubscriptionCode(subscription.subscriptionCode || "");
    setBranchCode(subscription.branchCode || "");

    setTimeout(() => {
      document
        .getElementById("subscription-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  // =========================================
  // RECEIPT / SLIP MODAL HANDLERS
  // =========================================

  const handleOpenReceipt = (sub) => {
    setReceiptModal(sub);
  };

  const handleCloseReceipt = () => {
    setReceiptModal(null);
  };

  const handlePrintSlip = () => {
    const printContent = document.getElementById("subscription-receipt-print");
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Subscription Payment Slip - ${receiptModal?.subscriptionCode || ""}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 25px; color: #1e293b; }
            .box { max-width: 650px; margin: 0 auto; border: 2px solid #2563eb; border-radius: 8px; padding: 25px; background: #fff; }
            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 15px; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #2563eb; font-size: 24px; text-transform: uppercase; font-weight: bold; }
            .header h4 { margin: 4px 0; color: #0f172a; font-size: 16px; }
            .header p { margin: 2px 0; color: #64748b; font-size: 13px; }
            .badge-paid { display: inline-block; background-color: #16a34a; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-top: 6px; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 18px; font-size: 13px; }
            .info-col { width: 48%; }
            .info-row { margin-bottom: 6px; }
            .info-label { color: #64748b; font-weight: 500; }
            .info-val { font-weight: 600; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; font-size: 13px; text-align: left; }
            th { background-color: #f8fafc; color: #334155; }
            .total-row { font-size: 15px; font-weight: bold; background-color: #f0fdf4; color: #15803d; }
            .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="box">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  const handleDownloadPdf = (subData) => {
    const sub = subData || receiptModal;
    if (!sub) return;

    try {
      const doc = new jsPDF();

      // Top colored banner
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 26, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SUBSCRIPTION PAYMENT RECEIPT", 105, 16, { align: "center" });

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const companyName = Cookies.get("name") || "Subscriber / Company";
      const receiptDate = sub.createdAt
        ? new Date(sub.createdAt).toLocaleString("en-IN")
        : new Date().toLocaleString("en-IN");

      doc.text(`Receipt Date: ${receiptDate}`, 14, 36);
      doc.text(`Subscriber: ${companyName}`, 14, 42);
      doc.text(`Branch Code: ${sub.branchCode || "-"}`, 14, 48);

      doc.text(`Status: SUCCESS (PAID)`, 130, 36);
      doc.text(`Razorpay Order ID: ${sub.razorpayOrderId || "N/A"}`, 130, 42);
      doc.text(`Razorpay Payment ID: ${sub.razorpayPaymentId || "N/A"}`, 130, 48);

      const tableBody = [
        ["Plan Name", sub.subscriptionName || "Plan"],
        ["Plan Code", sub.subscriptionCode || "-"],
        ["Billing Cycle", sub.subscriptionType || "YEARLY"],
        [
          "Duration",
          `${sub.subscriptionDuration || sub.month || 12} Months`,
        ],
        ["Monthly Rate", `INR ${sub.amountPerMonth || 0}`],
        ["GST (18%)", `INR ${sub.gst || 0}`],
        ["Total Amount Paid", `INR ${sub.totalAmount || 0}`],
        [
          "Start Date",
          sub.subscriptionStartAt
            ? new Date(sub.subscriptionStartAt).toLocaleDateString("en-IN")
            : "-",
        ],
      ];

      autoTable(doc, {
        startY: 55,
        head: [["Subscription Details", "Information"]],
        body: tableBody,
        theme: "striped",
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: "bold" },
          1: { cellWidth: 100 },
        },
      });

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 18 : 160;
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Thank you for subscribing! This is an electronically generated payment receipt.",
        105,
        finalY,
        { align: "center" }
      );

      const fileName = `Subscription_Receipt_${sub.subscriptionCode || "plan"}_${sub.branchCode || ""}.pdf`;
      doc.save(fileName);
      success("Receipt downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      fail("Failed to generate PDF slip.");
    }
  };

  // =========================================
  // CANCEL
  // =========================================

  const handleCancel = () => {
    setSelectedPlan(null);

    setSubscriptionCode("");

    setBranchCode("");

    setIsRenewal(false);
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
          isRenewal: isRenewal,
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
              const activatedSub =
                verifyRes?.payload?.data?.userSubscription || {
                  ...verificationData,
                  ...selectedPlan,
                  createdAt: new Date().toISOString(),
                };
              setReceiptModal(activatedSub);
              success(
                verifyRes?.payload?.message ||
                  (isRenewal
                    ? "Subscription renewed successfully!"
                    : "Subscription activated successfully!")
              );
              setSelectedPlan(null);
              setSubscriptionCode("");
              setBranchCode("");
              setIsRenewal(false);
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
      isRenewal: isRenewal,
    };

    console.log("User Subscription Request:", paymentData);

    API.paySubscription(dispatch, paymentData)
      .then((res) => {
        console.log("User Subscription Response:", res);

        const payload = res?.payload;
        const orderData = payload?.data || payload;

        // If Razorpay order created, trigger Razorpay modal
        if (orderData?.orderId || orderData?.paymentRequired) {
          openRazorpayCheckout(orderData);
          return;
        }

        if (
          payload?.code === "201" ||
          payload?.status === "CREATED"
        ) {
          const activatedSub =
            payload?.data?.userSubscription || {
              ...paymentData,
              ...selectedPlan,
              createdAt: new Date().toISOString(),
            };
          setReceiptModal(activatedSub);
          success(
            payload?.message ||
              (isRenewal
                ? "Subscription renewed successfully!"
                : "Subscription activated successfully!")
          );
          setSelectedPlan(null);
          setSubscriptionCode("");
          setBranchCode("");
          setIsRenewal(false);
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
              <i
                className={`fa ${
                  isRenewal
                    ? "fa-refresh text-warning"
                    : "fa-tag"
                } me-2`}
              ></i>
              {isRenewal
                ? "Renew Subscription Plan"
                : "Subscribe to Plan"}
            </h5>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {isRenewal && (
            <div className="alert alert-warning py-2 px-3 mb-3 d-flex align-items-center">
              <i className="fa fa-refresh me-2"></i>
              <span>
                <strong>Subscription Renewal Mode:</strong> You
                are extending the subscription for plan{" "}
                <strong>
                  {selectedPlan?.subscriptionName}
                </strong>
                . Select your branch and complete payment to
                renew.
              </span>
            </div>
          )}

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
                className={`btn ${
                  isRenewal
                    ? "btn-warning text-dark fw-bold"
                    : "btn-success"
                } w-100`}
                onClick={handlePay}
              >
                {isRenewal ? "Renew" : "Pay"}
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

                      {/* ACTION BUTTONS: VIEW, RENEW, SLIP */}

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
                            title="View Plan Details"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-warning text-dark fw-bold"
                            onClick={() =>
                              handleRenewSubscription(
                                subscription
                              )
                            }
                            title="Renew Subscription"
                          >
                            <i className="fa fa-refresh me-1"></i> Renew
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-success text-white"
                            onClick={() =>
                              handleOpenReceipt(
                                subscription
                              )
                            }
                            title="Print or Download Payment Slip"
                          >
                            <i className="fa fa-file-text-o me-1"></i> Slip
                          </button>
                        </div>
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

      {/* ========================================= */}
      {/* PAYMENT SLIP / RECEIPT MODAL */}
      {/* ========================================= */}
      {receiptModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title mb-0">
                  <i className="fa fa-file-text-o me-2"></i>
                  Subscription Payment Receipt / Slip
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseReceipt}
                ></button>
              </div>

              <div className="modal-body p-4 bg-light">
                {/* Print and view container */}
                <div
                  id="subscription-receipt-print"
                  className="p-4 bg-white border rounded shadow-sm"
                >
                  <div className="text-center pb-3 mb-3 border-bottom border-2 border-primary">
                    <h3 className="text-primary mb-1 fw-bold">RIGELSOFT</h3>
                    <h5 className="mb-1 text-dark">
                      SUBSCRIPTION PAYMENT SLIP
                    </h5>
                    <p className="text-muted small mb-2">
                      Computer Generated Confirmation
                    </p>
                    <span className="badge bg-success px-3 py-2 fs-6">
                      <i className="fa fa-check me-1"></i> PAYMENT SUCCESS - ACTIVE
                    </span>
                  </div>

                  <div className="row g-3 mb-3 small">
                    <div className="col-12 col-md-6">
                      <div className="mb-1">
                        <span className="text-muted">Subscriber:</span>{" "}
                        <strong>
                          {Cookies.get("name") || "Valued Subscriber"}
                        </strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">User ID:</span>{" "}
                        <strong>{ownerId || "-"}</strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Branch Code:</span>{" "}
                        <strong>{receiptModal.branchCode || "-"}</strong>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 text-md-end">
                      <div className="mb-1">
                        <span className="text-muted">Receipt Date:</span>{" "}
                        <strong>
                          {receiptModal.createdAt
                            ? new Date(
                                receiptModal.createdAt
                              ).toLocaleString("en-IN")
                            : new Date().toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Order ID:</span>{" "}
                        <code className="text-primary">
                          {receiptModal.razorpayOrderId || "N/A"}
                        </code>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Payment ID:</span>{" "}
                        <code className="text-success">
                          {receiptModal.razorpayPaymentId || "N/A"}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered mb-2">
                      <thead className="table-light">
                        <tr>
                          <th>Particulars</th>
                          <th className="text-end">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Subscription Plan</strong>
                            <div className="text-muted small">
                              Code: {receiptModal.subscriptionCode || "-"}
                            </div>
                          </td>
                          <td className="text-end fw-bold">
                            {receiptModal.subscriptionName || "Plan"}
                          </td>
                        </tr>
                        <tr>
                          <td>Billing Cycle & Duration</td>
                          <td className="text-end">
                            {receiptModal.subscriptionType || "YEARLY"} (
                            {receiptModal.subscriptionDuration ||
                              receiptModal.month ||
                              12}{" "}
                            Months)
                          </td>
                        </tr>
                        <tr>
                          <td>Monthly Equivalent</td>
                          <td className="text-end">
                            ₹{receiptModal.amountPerMonth || 0}
                          </td>
                        </tr>
                        <tr>
                          <td>GST (18%)</td>
                          <td className="text-end">
                            ₹{receiptModal.gst || 0}
                          </td>
                        </tr>
                        <tr className="table-success">
                          <td className="fw-bold fs-6 text-success">
                            Total Amount Paid
                          </td>
                          <td className="text-end fw-bold fs-6 text-success">
                            ₹{receiptModal.totalAmount || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center text-muted small mt-3 pt-2 border-top">
                    Thank you for subscribing to RigelSoft services! For billing support, please reach out to support@rigelsoft.com.
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCloseReceipt}
                >
                  Close
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handlePrintSlip}
                  >
                    <i className="fa fa-print me-1"></i> Print Slip
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDownloadPdf(receiptModal)}
                  >
                    <i className="fa fa-download me-1"></i> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubscriptionPlanList;