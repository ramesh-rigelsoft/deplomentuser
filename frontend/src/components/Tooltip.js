import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  const [style, setStyle] = useState({});
  const [arrowTop, setArrowTop] = useState(0);

  const triggerRef = useRef();
  const tooltipRef = useRef();

  const handleMouseEnter = () => {
    const rect = triggerRef.current.getBoundingClientRect();

    const gap = 10;
    const tooltipWidth = 260;

    let left = rect.right + gap;
    let top = rect.top + rect.height / 2;

    // 👉 right overflow → left side
    if (left + tooltipWidth > window.innerWidth) {
      left = rect.left - tooltipWidth - gap;
    }

    setStyle({
      position: "fixed",
      top,
      left,
      transform: "translateY(-50%)",
      background: "#1f2937",
      color: "#fff",
      padding: "10px 12px",
      borderRadius: "6px",
      fontSize: "13px",
      zIndex: 999999,
      maxWidth: tooltipWidth,
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
    });

    setShow(true);
  };

  const handleMouseLeave = () => setShow(false);

  useLayoutEffect(() => {
    if (show && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();

      let newTop = tooltipRect.top;

      // 👉 top overflow
      if (tooltipRect.top < 10) {
        newTop = 10;
      }

      // 👉 bottom overflow
      if (tooltipRect.bottom > window.innerHeight - 10) {
        newTop = window.innerHeight - tooltipRect.height - 10;
      }

      // 👉 update tooltip position
      setStyle((prev) => ({
        ...prev,
        top: newTop + tooltipRect.height / 2
      }));

      // 🔥 Arrow alignment calculation
      const triggerCenter = triggerRect.top + triggerRect.height / 2;
      const tooltipTop = newTop;

      let arrowPosition = triggerCenter - tooltipTop;

      // clamp arrow inside tooltip
      arrowPosition = Math.max(10, arrowPosition);
      arrowPosition = Math.min(tooltipRect.height - 10, arrowPosition);

      setArrowTop(arrowPosition);
    }
  }, [show]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: "pointer",
          color: "#2563eb",
          textDecoration: "underline dotted"
        }}
      >
        {children}
      </span>

      {show &&
        createPortal(
          <div ref={tooltipRef} style={style}>
            {/* 🔥 Dynamic Arrow */}
            <div
              style={{
                position: "absolute",
                top: arrowTop,
                left: "-6px",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "6px solid #1f2937"
              }}
            />

            {text}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;