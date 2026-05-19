import React, { useState } from "react";

const Paginations = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // per page items

  const startIndex = (currentPage - 1) * pageSize;
  const selectedItems = items.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div>
      {/* Show items */}
      {selectedItems.map((item, index) => (
        <p key={index}>{item.name}</p>
      ))}

      {/* Pagination Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Paginations;
