import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import "../css/RefreshBadge.css";

const RefreshBadge = ({ count = 0, size = 18, color = "red" }) => {
  return (
    <div className="refresh-container">
      <FiRefreshCw
        className="me-1"
        size={size}
        // style={{ color }}
      />
{
   count>0&&(<span className="refresh-badge">
        {count}
      </span>)
}
      
    </div>
  );
};

export default RefreshBadge;