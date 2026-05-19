import React, { useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const PAGE_SIZE = 10;

import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar"

/* ---------------- MOCK DATA ---------------- */
const salesData = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  invoice: "INV-" + (1000 + i),
  amount: (Math.random() * 5000).toFixed(2),
  purchasePrice: (Math.random() * 3000).toFixed(2),
  date: `2024-02-${(i % 28 + 1).toString().padStart(2, "0")}`
}));


const entryData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  itemCode: "ITM-" + (200 + i),
  qty: Math.floor(Math.random() * 10 + 1),
  price: (Math.random() * 1000).toFixed(2),
  date: `2024-02-${(i % 28 + 1).toString().padStart(2, "0")}`
}));

/* ---------------- COMPONENT ---------------- */
export default function SummaryReport() {
  const dispatch = useDispatch();
  const [active, setActive] = useState("sales");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  

  /* ---------------- SELECT DATA ---------------- */
  let data;
  if (active === "sales") data = salesData;
  else if (active === "entry") data = entryData;
  else if (active === "daily") data = salesData; // Daily uses sales data

  /* ---------------- FILTER DATA ---------------- */
  const filteredData = data.filter(d => {
    const keyword = search.toLowerCase();
    const matchesKeyword =
      active === "sales" || active === "daily"
        ? d.invoice.toLowerCase().includes(keyword)
        : d.itemCode.toLowerCase().includes(keyword);

    const dDate = new Date(d.date);
    const afterStart = startDate ? dDate >= new Date(startDate) : true;
    const beforeEnd = endDate ? dDate <= new Date(endDate) : true;

    return matchesKeyword && afterStart && beforeEnd;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (start > 1) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...");

    return (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>◀</button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i}>…</span>
          ) : (
            <button
              key={i}
              className={p === page ? "active" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>▶</button>
      </div>
    );
  };

  /* ---------------- TOTALS FOR DAILY ---------------- */
  let totalSelling = 0, totalPurchase = 0, totalProfit = 0;
  if (active === "daily") {
    filteredData.forEach(d => {
      totalSelling += parseFloat(d.amount);
      totalPurchase += parseFloat(d.purchasePrice);
      totalProfit += parseFloat(d.amount) - parseFloat(d.purchasePrice);
    });
  }

  /* ---------------- EXPORT FUNCTIONS ---------------- */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${active}-report.xlsx`);
  };

  const featchItemEntry = () =>{
   API.searchItems(dispatch, {})
    .then(res => {
     let qty=res.payload.data.items[0].quantity;
    
     
     
     })
    .catch(err => {
      console.log("Error:", err);
    });
 };

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`${active.toUpperCase()} REPORT`, 14, 15);
    let y = 25;
    filteredData.forEach(d => {
      pdf.text(JSON.stringify(d), 14, y);
      y += 8;
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
    });
    pdf.save(`${active}-report.pdf`);
  };

  return (
    <div className="summary-page">
      <style>{`
        body { background:#f5f7fb }
        .summary-page { padding: 20px; }
        .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-bottom:16px; }
        .card {
          background:#fff; padding:20px; border-radius:12px;
          box-shadow:0 8px 20px rgba(0,0,0,.06);
          cursor:pointer; font-weight:600; text-align:center;
        }
        .card.active { border:2px solid #2563eb }
        .actions { display:flex; gap:10px; margin-bottom:16px }
        .actions button { padding:6px 12px; cursor:pointer; border-radius:6px; border:1px solid #d1d5db; background:#fff; }
        .actions button:hover { background:#2563eb; color:#fff; border-color:#2563eb }

        .filter-bar { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:16px; align-items:center; }
        .filter-bar input { padding:6px 10px; border:1px solid #d1d5db; border-radius:6px; }

        .summary-cards { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
        .summary-card { flex:1; background:#2563eb; color:#fff; padding:16px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); text-align:center; font-weight:600; }
        .summary-card span { display:block; font-size:14px; opacity:0.8; margin-top:6px; font-weight:400; }

        .table-wrapper {
          background:#fff;
          padding:16px;
          border-radius:12px;
          box-shadow:0 8px 20px rgba(0,0,0,.06);
          display:flex;
          flex-direction:column;
          min-height: calc(${PAGE_SIZE} * 44px + 60px);
        }

        table { width:100%; border-collapse:collapse; flex:1; }
        th,td { padding:10px; border-bottom:1px solid #e5e7eb; font-size:14px; text-align:left; }
        th { background:#f9fafb }

        .pagination {
          display:flex; 
          gap:6px; 
          justify-content:center; 
          margin-top:16px;
          flex-shrink:0;
        }
        .pagination button {
          padding:6px 10px; border:1px solid #d1d5db;
          background:#fff; border-radius:6px; cursor:pointer
        }
        .pagination button.active { background:#2563eb; color:#fff }
        .pagination span { padding:6px 10px; }

        @media(max-width:600px){
          table { font-size:12px }
          .filter-bar { flex-direction:column; align-items:flex-start; }
          .summary-cards { flex-direction:column; }
        }
      `}</style>

      {/* Cards */}
      <div className="cards">
        <div className={`card ${active==="sales"?"active":""}`} onClick={()=>{setActive("sales"); setPage(1)}}>My Sales</div>
        <div className={`card ${active==="entry"?"active":""}`} onClick={()=>{setActive("entry"); setPage(1)}}>My Entry</div>
        <div className={`card ${active==="daily"?"active":""}`} onClick={()=>{setActive("daily"); setPage(1)}}>Daily Live Profit</div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={exportExcel}>Export Excel</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <input type="text" placeholder="Search..." value={search} onChange={(e)=>{setSearch(e.target.value); setPage(1)}} />
        <input type="date" value={startDate} onChange={(e)=>{setStartDate(e.target.value); setPage(1)}} />
        <input type="date" value={endDate} onChange={(e)=>{setEndDate(e.target.value); setPage(1)}} />
      </div>

      {/* Daily summary cards */}
      {active === "daily" && (
        <div className="summary-cards">
          <div className="summary-card">
            Selling Price
            <span>₹ {totalSelling.toFixed(2)}</span>
          </div>
          <div className="summary-card">
            Total Purchase
            <span>₹ {totalPurchase.toFixed(2)}</span>
          </div>
          <div className="summary-card">
            Profit
            <span>₹ {totalProfit.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {active === "sales" || active === "daily" ? (
                <>
                  <th>#</th><th>Invoice</th><th>Selling Price</th><th>Purchase Price</th><th>Profit</th><th>Date</th>
                </>
              ) : (
                <>
                  <th>#</th><th>Item Code</th><th>Qty</th><th>Price</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((r,i)=>(
              <tr key={i}>
                <td>{(page-1)*PAGE_SIZE + i + 1}</td>
                {active === "sales" || active === "daily" ? (
                  <>
                    <td>{r.invoice}</td>
                    <td>{r.amount}</td>
                    <td>{r.purchasePrice}</td>
                    <td>{(r.amount - r.purchasePrice).toFixed(2)}</td>
                    <td>{r.date}</td>
                  </>
                ) : (
                  <>
                    <td>{r.itemCode}</td>
                    <td>{r.qty}</td>
                    <td>{r.price}</td>
                  </>
                )}
              </tr>
            ))}

            {/* Fill empty rows for paginated reports */}
            {paginatedData.length < PAGE_SIZE &&
              Array.from({length: PAGE_SIZE - paginatedData.length}).map((_,i)=>(
                <tr key={`empty-${i}`}><td colSpan={6} style={{height:'40px'}}>&nbsp;</td></tr>
              ))
            }
          </tbody>
        </table>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}
