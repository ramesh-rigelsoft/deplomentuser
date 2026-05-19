import React from "react";
import BillPrint from "./BillPrint";
import GSTRetailBill from "./GSTRetailBill";
const BillPreview = ({ data, onClose }) => {
  if (data.length==0) {
    return null;
  }

  return (
    <>
   
  <div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
  >
    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">

        {/* ===== HEADER ===== */}
        <div className="modal-header">
          <h5 className="modal-title">🧾 Bill Preview</h5>
          {/* <button
            className="btn-close"
            onClick={() => setShowPreview(false)}
          /> */}
        </div>

        {/* ===== BODY ===== */}
        <div className="modal-body">
          <GSTRetailBill data={data} />
        </div>

        {/* ===== FOOTER ===== */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button className="btn btn-success">
            Print Bill
          </button>
        </div>

      </div>
    </div>
  </div>
    </>
  );
};


export default BillPreview;
