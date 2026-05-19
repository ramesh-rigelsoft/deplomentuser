import React from "react";
import Barcode from "react-barcode";


const GSTRetailBill = ({ data }) => {

  
  if (!data || data.items.length === 0) return null;

  const GST_RATE = 18;

  const subTotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const gstAmount = (subTotal * GST_RATE) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const grandTotal = subTotal + gstAmount;

  return (
    <div
      style={{
        width: "300px",
        padding: "10px",
        fontFamily: "monospace",
        fontSize: "12px",
        background: "#fff",
        color: "#000"
      }}
    >
      {/* ===== SHOP HEADER ===== */}
      <div style={{ textAlign: "center" }}>
        <h3 style={{ margin: "5px 0" }}>KARTAR MOBILE SHOP</h3>
        <div>Balongi, Mohali</div>
        <div>GSTIN: 03ABCDE1234F1Z5</div>
        <div>📞 98729-04782,98729-04783,98729-04784</div>
        <hr />
      </div>

      {/* ===== BILL INFO ===== */}
      <div>
        <div>Invoice No: <b>GST-1025</b></div>
        <div>Date: {new Date().toLocaleDateString()}</div>
        <div>Type: Retail GST Bill</div>
        <hr />
        <div  style={{
            border: "1px dashed #000",
            padding: "5px",
            margin: "8px 0",
            fontSize: "11px",
            lineHeight: "16px"
          }}
        >
        <div><b>Customer:</b> {data.buyerName}</div>
        <div><b>Mobile:</b> {data.buyerMobileNumber || "N/A"}</div>
        <div><b>Address:</b> {data.buyerAddress || "N/A"}</div>
      </div>
      <hr />
      </div>

      {/* ===== data ===== */}
     <table width="100%" style={{ borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={{ width: "50%", textAlign: "left" }}>Item</th>
      <th style={{ width: "15%", textAlign: "center" }}>Qty</th>
      <th style={{ width: "15%", textAlign: "center" }}>Rate</th>
      <th style={{ width: "20%", textAlign: "right" }}>Amount</th>
    </tr>
  </thead>
      
  <tbody>
    {data.items.map((item, i) => (
      <tr key={i}>
        <td style={{ width: "50%" }}>{item.productName}</td>
        <td style={{ width: "15%", textAlign: "center" }}>{item.quantity}</td>
        <td style={{ width: "15%", textAlign: "center" }}>{item.unitPrice}</td>
        <td style={{ width: "20%", textAlign: "right" }}>
          ₹{item.quantity * item.unitPrice}
        </td>
      </tr>
    ))}
  </tbody>
</table>

      <hr />

      {/* ===== TAX SUMMARY ===== */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Sub Total</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>CGST (9%)</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>SGST (9%)</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
      </div>

      <hr />

      {/* ===== GRAND TOTAL ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      >
        <span>Grand Total</span>
        <span>₹{grandTotal.toFixed(2)}</span>
      </div>

      <hr />

      {/* Brac Code */}
      <div style={{ marginTop: "25px", textAlign: "center" }}>
        <Barcode 
          value={data?.buyerMobileNumber || "0000000000"} 
          format="CODE128"
          width={1.5}
          height={60}
          displayValue={false}
        />
        <div style={{ fontSize: "10px", marginTop: "4px" }}>
          {data?.buyerMobileNumber}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ textAlign: "center", fontSize: "11px" }}>
        <p>Thank you for shopping 🙏</p>
        <p>No return without bill</p>
      </div>
    </div>
  );
};

export default GSTRetailBill;
