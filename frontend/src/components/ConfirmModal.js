import React, { useEffect } from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
  type = "danger", // danger | warning | info
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onCancel]);

  if (!open) return null;

  return (
    <>
      <div className="cm-backdrop" onClick={onCancel} />

      <div className={`cm-modal ${type}`}>
        <div className="cm-icon">
          {type === "danger" && "🗑️"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </div>

        <h3>{title}</h3>
        <p>{message}</p>

        <div className="cm-actions">
          <button className="cm-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="cm-btn confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .cm-backdrop{
          position:fixed;
          inset:0;
          background:rgba(15,23,42,.55);
          backdrop-filter: blur(2px);
          z-index:999;
        }

        .cm-modal{
          position:fixed;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%) scale(.95);
          background:#fff;
          width:92%;
          max-width:420px;
          padding:24px;
          border-radius:16px;
          box-shadow:0 25px 60px rgba(0,0,0,.35);
          z-index:1000;
          text-align:center;
          animation:cmPop .25s ease forwards;
        }

        .cm-icon{
          font-size:36px;
          margin-bottom:8px;
        }

        .cm-modal h3{
          margin:0;
          font-size:18px;
          font-weight:600;
          color:#111827;
        }

        .cm-modal p{
          margin:10px 0 22px;
          font-size:14px;
          color:#4b5563;
          line-height:1.6;
        }

        .cm-actions{
          display:flex;
          gap:12px;
          justify-content:center;
        }

        .cm-btn{
          min-width:110px;
          padding:8px 14px;
          font-size:13px;
          border-radius:8px;
          cursor:pointer;
          border:none;
          transition:.2s;
        }

        .cm-btn.cancel{
          background:#e5e7eb;
          color:#111827;
        }

        .cm-btn.cancel:hover{
          background:#d1d5db;
        }

        .cm-btn.confirm{
          color:#fff;
        }

        .cm-modal.danger .confirm{ background:#dc2626 }
        .cm-modal.warning .confirm{ background:#f59e0b }
        .cm-modal.info .confirm{ background:#2563eb }

        .cm-btn.confirm:hover{
          opacity:.9;
          transform:translateY(-1px);
        }

        @keyframes cmPop{
          to{transform:translate(-50%,-50%) scale(1)}
        }

        @media(max-width:480px){
          .cm-modal{ padding:20px }
        }
      `}</style>
    </>
  );
}
