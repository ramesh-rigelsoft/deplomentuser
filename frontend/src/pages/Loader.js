import React, { useEffect, useState } from "react";
import "../css/Loader.css";

export default function Loader({ isOpen }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    let value = 0;

    const interval = setInterval(() => {
      value += 1;

      if (value > 95) {
        value = 10; // 🔥 reset (100% nahi jayega)
      }

      setProgress(value);
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-box">

        {/* spinning border */}
        <div className="spinner-border"></div>

        {/* percent (never 100%) */}
        <div className="percent">{progress}%</div>

        <div className="text">Loading...</div>
      </div>
    </div>
  );
}