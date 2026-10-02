import React, { useEffect, useState } from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
  type = "danger",

  numberInput = false,
  numberInputLabel = "",
  numberInputPlaceholder = "",
  defaultNumberValue = "",

  input = false,
  inputLabel = "",
  inputPlaceholder = "",

  input2 = false,
  inputLabel2 = "",
  inputPlaceholder2 = "",

  select = false,
  selectLabel = "",
  selectOptions = [],
  defaultSelectValue,
  onChangeSelectOptions,

  select2 = false,
  selectLabel2 = "",
  selectOptions2 = [],
  defaultSelectValue2,
  onChangeSelectOptions2,

  // GST
  billType = "GST",
  showGst = false,
  onGstChange,

  // Custom content
  children,

  onConfirm,
  onCancel,
}) {
  const [numberValue, setNumberValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [selectValue2, setSelectValue2] = useState("");

  // ==============================
  // ESC KEY
  // ==============================

  useEffect(() => {
    if (!open) return;

    const esc = (e) => {
      if (e.key === "Escape") {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", esc);

    return () => {
      document.removeEventListener("keydown", esc);
    };
  }, [open, onCancel]);

  // ==============================
  // RESET WHEN MODAL OPENS
  // ==============================

  useEffect(() => {
    if (!open) return;

    setInputValue("");
    setInputValue2("");
    setNumberValue(defaultNumberValue || "");

    setSelectValue(
      defaultSelectValue ||
        selectOptions?.[0]?.value ||
        ""
    );

    setSelectValue2(
      defaultSelectValue2 ||
        selectOptions2?.[0]?.value ||
        ""
    );
  }, [
    open,
    defaultNumberValue,
    defaultSelectValue,
    defaultSelectValue2,
    selectOptions,
    selectOptions2,
  ]);

  if (!open) return null;

  return (
    <>
      {/* ================================= */}
      {/* BACKDROP */}
      {/* ================================= */}

      <div
        className="cm-backdrop"
        onClick={onCancel}
      />

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      <div className={`cm-modal ${type}`}>

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="cm-header">

          <div className="cm-icon">
            {type === "danger" && "🗑️"}
            {type === "warning" && "⚠️"}
            {type === "info" && "ℹ️"}
          </div>

          {title && (
            <h3 className="cm-title">
              {title}
            </h3>
          )}

        </div>

        {/* ================================= */}
        {/* MESSAGE */}
        {/* ================================= */}

        {message && (
          <p className="cm-message">
            {message}
          </p>
        )}

        {/* ================================= */}
        {/* CUSTOM CHILDREN */}
        {/* ================================= */}

        {children && (
          <div className="cm-children">
            {children}
          </div>
        )}

        {/* ================================= */}
        {/* NUMBER INPUT */}
        {/* ================================= */}

        {numberInput && (
          <div className="cm-input-wrapper">

            {numberInputLabel && (
              <label className="cm-label">
                {numberInputLabel}
              </label>
            )}

            <input
              type="number"
              className="cm-input"
              placeholder={numberInputPlaceholder}
              value={numberValue}
              onChange={(e) =>
                setNumberValue(e.target.value)
              }
            />

          </div>
        )}

        {/* ================================= */}
        {/* INPUT 1 */}
        {/* ================================= */}

        {input && (
          <div className="cm-input-wrapper">

            {inputLabel && (
              <label className="cm-label">
                {inputLabel}
              </label>
            )}

            <input
              type="text"
              className="cm-input"
              name="input1"
              maxLength={200}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
            />

          </div>
        )}

        {/* ================================= */}
        {/* INPUT 2 */}
        {/* ================================= */}

        {input2 && (
          <div className="cm-input-wrapper">

            {inputLabel2 && (
              <label className="cm-label">
                {inputLabel2}
              </label>
            )}

            <input
              type="text"
              className="cm-input"
              name="input2"
              maxLength={200}
              placeholder={inputPlaceholder2}
              value={inputValue2}
              onChange={(e) =>
                setInputValue2(e.target.value)
              }
            />

          </div>
        )}

        {/* ================================= */}
        {/* SELECT 1 */}
        {/* ================================= */}

        {select && (
          <div
            className="cm-input-wrapper"
            id="paymentmethod"
          >

            {selectLabel && (
              <label className="cm-label">
                {selectLabel}
              </label>
            )}

            <select
              className="cm-select"
              value={selectValue}
              onChange={(e) => {

                const value = e.target.value;

                setSelectValue(value);

                onChangeSelectOptions?.(
                  value,
                  e
                );
              }}
            >

              {selectOptions.map((opt, idx) => (
                <option
                  key={idx}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}

            </select>

          </div>
        )}

        {/* ================================= */}
        {/* SELECT 2 */}
        {/* ================================= */}

        {select2 && (
          <div
            className="cm-input-wrapper"
            id="paymentmethod2"
          >

            {selectLabel2 && (
              <label className="cm-label">
                {selectLabel2}
              </label>
            )}

            <select
              className="cm-select"
              value={selectValue2}
              onChange={(e) => {

                const value = e.target.value;

                setSelectValue2(value);

                onChangeSelectOptions2?.(
                  value,
                  e
                );
              }}
            >

              {selectOptions2.map((opt, idx) => (
                <option
                  key={idx}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}

            </select>

          </div>
        )}

        {/* ================================= */}
        {/* GST / NON GST */}
        {/* ================================= */}

        {showGst && (
          <div
            className="d-flex flex-column align-items-center"
            style={{
              marginBottom: "15px",
            }}
          >

            <div className="d-flex gap-4 align-items-center justify-content-center">

              <label className="round-checkbox d-flex align-items-center gap-1">

                <input
                  type="checkbox"
                  className="checkmark"
                  checked={billType === "GST"}
                  onChange={() =>
                    onGstChange?.("GST")
                  }
                />

                GST

              </label>

              <label className="round-checkbox d-flex align-items-center gap-1">

                <input
                  type="checkbox"
                  className="checkmark"
                  checked={billType === "NON_GST"}
                  onChange={() =>
                    onGstChange?.("NON_GST")
                  }
                />

                Non-GST

              </label>

            </div>

          </div>
        )}

        {/* ================================= */}
        {/* ACTIONS */}
        {/* ================================= */}

        {(confirmText || cancelText) && (
          <div className="cm-actions">

            {cancelText && (
              <button
                type="button"
                className="cm-btn cancel"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}

            {confirmText && (
              <button
                type="button"
                className="cm-btn confirm"
                onClick={() =>
                  onConfirm?.({
                    numberValue,
                    inputValue,
                    inputValue2,
                    selectValue,
                    selectValue2,
                    billType,
                  })
                }
              >
                {confirmText}
              </button>
            )}

          </div>
        )}

      </div>

      {/* ================================= */}
      {/* CSS */}
      {/* ================================= */}

      <style>{`

        /* ============================== */
        /* BACKDROP */
        /* ============================== */

        .cm-backdrop {
          position: fixed;
          inset: 0;

          background: rgba(15, 23, 42, 0.55);

          backdrop-filter: blur(2px);

          z-index: 9999;
        }


        /* ============================== */
        /* MODAL */
        /* ============================== */

        .cm-modal {

          position: fixed;

          top: 50%;
          left: 50%;

          transform:
            translate(-50%, -50%)
            scale(.95);

          width: 80vw;
          height: 80vh;

          max-width: none;
          max-height: none;

          background: #fff;

          padding: 20px;

          border-radius: 16px;

          box-shadow:
            0 25px 60px
            rgba(0, 0, 0, .35);

          z-index: 10000;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          animation:
            cmPop .25s ease forwards;
        }


        /* ============================== */
        /* HEADER */
        /* ============================== */

        .cm-header {

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

        }


        .cm-icon {

          font-size: 28px;

        }


        .cm-title {

          margin: 0;

          font-size: 18px;

          font-weight: 600;

          color: #111827;

        }


        /* ============================== */
        /* MESSAGE */
        /* ============================== */

        .cm-message {

          flex-shrink: 0;

          margin: 8px 0 12px;

          font-size: 14px;

          color: #4b5563;

          line-height: 1.5;

          text-align: center;

        }


        /* ============================== */
        /* CUSTOM CHILDREN */
        /* ============================== */

        .cm-children {

          flex: 1;

          min-height: 0;

          width: 100%;

          margin-bottom: 15px;

          overflow: hidden;

          text-align: left;

        }


        /*
          Important for Google Map /
          custom components
        */

        .cm-children > * {

          width: 100%;
          height: 100%;

        }


        /* ============================== */
        /* INPUT */
        /* ============================== */

        .cm-input-wrapper {

          flex-shrink: 0;

          text-align: left;

          margin-bottom: 18px;

        }


        .cm-label {

          display: block;

          margin-bottom: 6px;

          font-size: 13px;

          font-weight: 500;

          color: #374151;

        }


        .cm-input,
        .cm-select {

          width: 100%;

          padding: 10px 12px;

          border:
            1px solid #d1d5db;

          border-radius: 8px;

          outline: none;

          font-size: 14px;

          background: #fff;

        }


        .cm-input:focus,
        .cm-select:focus {

          border-color: #2563eb;

        }


        /* ============================== */
        /* ACTIONS */
        /* ============================== */

        .cm-actions {

          flex-shrink: 0;

          display: flex;

          gap: 12px;

          justify-content: center;

          margin-top: auto;

        }


        .cm-btn {

          min-width: 110px;

          padding: 9px 14px;

          border: none;

          border-radius: 8px;

          cursor: pointer;

          font-size: 13px;

          transition: .2s;

        }


        .cm-btn.cancel {

          background: #e5e7eb;

          color: #111827;

        }


        .cm-btn.cancel:hover {

          background: #d1d5db;

        }


        .cm-modal.danger .confirm {

          background: #dc2626;

          color: #fff;

        }


        .cm-modal.warning .confirm {

          background: #f59e0b;

          color: #fff;

        }


        .cm-modal.info .confirm {

          background: #2563eb;

          color: #fff;

        }


        .cm-btn.confirm:hover {

          opacity: .9;

          transform:
            translateY(-1px);

        }


        /* ============================== */
        /* ANIMATION */
        /* ============================== */

        @keyframes cmPop {

          to {

            transform:
              translate(-50%, -50%)
              scale(1);

          }

        }


        /* ============================== */
        /* TABLET / MOBILE */
        /* ============================== */

        @media (max-width: 768px) {

          .cm-modal {

            width: 95vw;

            height: 95vh;

            padding: 15px;

          }

        }


        @media (max-width: 480px) {

          .cm-modal {

            width: 96vw;

            height: 96vh;

            padding: 12px;

            border-radius: 12px;

          }


          .cm-icon {

            font-size: 24px;

          }


          .cm-title {

            font-size: 16px;

          }


          .cm-actions {

            gap: 8px;

          }


          .cm-btn {

            min-width: 100px;

          }

        }

      `}</style>
    </>
  );
}
