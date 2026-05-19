import React, { useState } from "react";

const orders = [
  { orderNo: "001", name: "Product A", packagePcs: 10, qty: 5, gst: "18%" },
  { orderNo: "001", name: "Product B", packagePcs: 20, qty: 2, gst: "12%" },
  { orderNo: "002", name: "Product C", packagePcs: 5, qty: 10, gst: "5%" },
  { orderNo: "002", name: "Product D", packagePcs: 8, qty: 3, gst: "18%" },
  { orderNo: "003", name: "Product E", packagePcs: 15, qty: 7, gst: "12%" },
  { orderNo: "003", name: "Product F", packagePcs: 12, qty: 4, gst: "18%" },
  { orderNo: "004", name: "Product G", packagePcs: 6, qty: 8, gst: "5%" },
  { orderNo: "004", name: "Product H", packagePcs: 9, qty: 6, gst: "12%" },
  { orderNo: "005", name: "Product I", packagePcs: 20, qty: 2, gst: "18%" },
  { orderNo: "005", name: "Product J", packagePcs: 11, qty: 5, gst: "5%" },
];


export default function OutBondItem({ cartItems, setCartItems }) {

  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(orders.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="container py-4">
      {/* header1-container bg-white shadow-sm p-3 d-flex justify-content-between align-items-center */}
    <div className="card mb-3 shadow">
      <div className="card-header d-flex justify-content-between align-items-center">
      {/* <h2 className="text-center mb-4">Orders List</h2> */}
      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === orders.length}
              />
            </th>
            <th>Order No</th>
            <th>Name</th>
            <th>Package Pcs</th>
            <th>Qty</th>
            <th>GST</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
              className={selectedRows.includes(index) ? "table-info" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>{order.orderNo}</td>
              <td>{order.name}</td>
              <td>{order.packagePcs}</td>
              <td>{order.qty}</td>
              <td>{order.gst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>    
  </div>
</div>
  );
}
