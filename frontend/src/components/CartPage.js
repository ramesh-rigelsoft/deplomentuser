import React from "react";

export default function CartPage({ cartItems }) {
  return (
    <div>
      <h2 className="text-center mb-4">Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">No items in cart.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-success">
            <tr>
              <th>Order No</th>
              <th>Name</th>
              <th>Package Pcs</th>
              <th>Qty</th>
              <th>GST</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.orderNo}</td>
                <td>{item.name}</td>
                <td>{item.packagePcs}</td>
                <td>{item.qty}</td>
                <td>{item.gst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
