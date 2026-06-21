import React from "react";

export default function PageHeader({ pageName = "Dashboard" }) {
  return (
    <div className="premium-simple-header mb-4">
      <div className="accent-bar"></div>

      <h3 className="premium-simple-title m-0">
        {pageName}
      </h3>
    </div>
  );
}