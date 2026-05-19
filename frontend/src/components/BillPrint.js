import React from "react";

const BillPrint = ({data}) => {

    // if(data.length!=0){
        console.log(data);
    // }

  const total = data.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const buyer = {
    name: "Walk-in Customer",
    address:  "Balongi, Mohali",
    phone:  "+91 9872904782"
  };
  return (
    <div
      style={{
        fontFamily: "serif",
        fontSize: "14px",
        color: "#000",
        padding: "20px",
        border: "1px solid #000"
      }}
    >
      {/* ===== HEADER ===== */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h3 style={{ margin: 0 }}>KARTAR LAUNDRY</h3>
        <div>Shop No. 12, Gali No. 1, Near Krishna Electronics</div>
        <div>Dashmesh Market, Balongi</div>
        <div>Mob: +91-8054338895</div>
        <hr />
      </div>

      {/* ===== BILL INFO ===== */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>Bill No:</strong> 1687
        </div>
        <div>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </div>
      </div>

      <div style={{ marginTop: "8px" }}>
        <strong>Name:</strong> {buyer.name || "__________"}
      </div>
      <div>
        <strong>Address:</strong> {buyer.address || "__________"}
      </div>

      {/* ===== TABLE ===== */}
      <table
        width="100%"
        border="1"
        cellPadding="6"
        style={{
          borderCollapse: "collapse",
          marginTop: "15px",
          textAlign: "center"
        }}
      >
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Particulars</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice}</td>
              <td>{item.quantity * item.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== TOTAL ===== */}
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <strong>Total: ₹ {total}</strong>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ marginTop: "25px", fontSize: "12px" }}>
        <div>Note: Period for complaint is only one month.</div>
        <div>Due to no supply of electricity delivery can be delayed.</div>
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "right",
          fontWeight: "bold"
        }}
      >
        Signature
      </div>
    </div>
  );
};

export default BillPrint;
