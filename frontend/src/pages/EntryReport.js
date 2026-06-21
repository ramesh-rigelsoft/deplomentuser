import React, { useState, useEffect,useRef } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "./Tooltip";
import Cookies from "js-cookie";
// import ConfirmModal from "./ConfirmModal";
// import { navigateTo } from './navigationService';
import { useLocation } from "react-router-dom";
// import BorderHeader from "./BorderHeader";
import { FiInfo, FiDownload,FiRefreshCw  } from "react-icons/fi";
import RefreshBadge from "./RefreshBadge";
import Loader from "./Loader";
import Header from "../components/Header";
import PageHeader from "./PageHeader";
// import DownloadProgressModal from "./DownloadProgressModal";


export default function ItemSummaryReport() {
  
  // const progressModalRef = useRef();
  const location = useLocation();
  const ownerId = Cookies.get("secretCode");       
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("entry"); // sales / entry
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [startIndex, setStartIndex] = useState(0);
  const [maxRecords, setMaxRecords] = useState(10);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modal, setModal] = useState({
      open: false,
      title: "",
      message: "",
      confirmText: "",
      onConfirm: null
    });

  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const columns = [
  { key: "itemCode", label: "Item Code" },
  // { key: "category", label: "Category" },
  { key: "serialNumber", label: "Serial Number" },
  { key: "categoryType", label: "Category Type" },
  // { key: "measureType", label: "Measure Type" },
  { key: "brand", label: "Brand" },
  { key: "modelName", label: "Model" },
  { key: "itemCondition", label: "Condition" },
  // { key: "itemSource", label: "Item Source" },
  // { key: "ram", label: "RAM" },
  // { key: "ramUnit", label: "RAM Unit" },
  // { key: "storage", label: "Storage" },
  // { key: "storageType", label: "Storage Type" },
  // { key: "storageUnit", label: "Storage Unit" },
  { key: "quantity", label: "Quantity" },
  // { key: "initialPrice", label: "Initial Price" },
  // { key: "sellingPrice", label: "Selling Price" },
  { key: "soldPrice", label: "Rate" },
  { key: "description", label: "Description" },
  { key: "itemColor", label: "Color" },
  { key: "processor", label: "Processor" },
  { key: "operatingSystem", label: "Operating System" },
  { key: "screenSize", label: "Screen Size" },
  { key: "itemGen", label: "Generation" },
  // { key: "discountType", label: "Discount Type" },
  { key: "vendorName", label: "Vendor Name" },
  // { key: "vendorGSTNumber", label: "Vendor GST No." },
  // { key: "additionalDetails", label: "Additional Details" },
];

const columnsBuyer = [
  { key: "invoiceNumber", label: "Invoice No" },
  { key: "custumberId", label: "Customer ID" },
  { key: "buyerName", label: "Buyer Name" },
  { key: "companyName", label: "Company" },
  { key: "gstNumber", label: "GST No" },
  { key: "emailId", label: "Email" },
  { key: "mobileNumber", label: "Mobile" },
  { key: "paymentModes", label: "Payment Mode" },
  { key: "createdAt", label: "Ordered Date"}
];


useEffect(() => {
 const queryParams = new URLSearchParams(location.search);
 const itemCodes = queryParams.get("activeTab");
 if(itemCodes!==null){
  setActiveTab("entry");
 }
},[]);

// useEffect(() => {
//   if (!loading) return;

//   const interval = setInterval(() => {
//     setProgress((prev) => {
//       if (prev >= 95) return prev;

//       return prev + Math.floor(Math.random() * 5) + 1;
//     });
//   }, 200);

//   return () => clearInterval(interval);
// }, [loading]);

// const progressValues = [10, 20, 35, 50, 65, 80, 95, 100];

// const startProgressLoader = (time) => {
//   let index = 0;

//   return setInterval(() => {
//     setProgress(progressValues[index]);

//     index++;

//     if (index >= progressValues.length) {
//       index = 0; // phir se 10 se start hoga
//     }
//   }, time);
// };
useEffect(() => {
  loadData(activeTab, startIndex, false);
}, [activeTab, searchKeywords, startDate, endDate, startIndex]);//searchKeywords, startDate, endDate]);

  const loadData = (tab,startIndexes1,isdownload) => {
 
    if (tab === "sales") {
       fetchSales(startIndexes1,maxRecords,searchKeywords,startDate,endDate,isdownload);
    }
    else if (tab === "entry"){
       fetchItems(startIndexes1,maxRecords,searchKeywords,startDate,endDate,isdownload);
    }
  };

  const fetchItems = async (startIndex,maxRecords,searchKeywords,startDate,endDate,isdownload) => {
    try {
      if(isdownload){
         setLoading(true);
      }
      const resq = await API.searchItems(dispatch, {startIndex:startIndex,maxRecords:maxRecords,searchKeyword:searchKeywords,startDate:startDate,endDate:endDate,isdownload:isdownload,userId:ownerId

      }).then(res=>{
          const data = res.payload.data?.items || [];
          if(!isdownload){
            if(data.length>0){
              setItems(data);
            }else{
              setItems([]);
            }
          }else{  
            if(data.length==0){
              setLoading(false);
              fail("Record is not found in selected filter");
            }else{
              setLoading(false);
              success("Excel file download Successfully.")
            }
          }
      }).catch((err) => {
        setLoading(false);
        console.error("API Error:", err);
        fail("Contact to Service Provider");
      })
    } catch (err) {
         console.error(err);
         setLoading(false);
         fail("Contact to Service Provider");
         setItems([]);
    }
  };

  const fetchSales = async (startIndex,maxRecords,searchKeywords,startDate,endDate,isdownload) => {
    try {
      if(isdownload){
         setLoading(true);         
      }
      const res1 = await API.salesListAndSearch(dispatch, {startIndex:startIndex,maxRecords:maxRecords,searchKeyword:searchKeywords,startDate:startDate,endDate:endDate,isdownload:isdownload,userId:ownerId

      }).then(res=>{
        const data = res.payload?.data?.sales || [];
        if(!isdownload){
          if(data.length>0){
            setSales(data);
          }else{
            setSales([]);
          }
        }else{
          if(data.length==0){
            fail("Record is not found in selected filter");
             setLoading(false);
          }else{
            setLoading(false);
            success("Excel file download Successfully.")
          }
        }
      }).catch((err) => {
        setLoading(false);
        console.error("API Error:", err);
        fail("Contact to Service Provider");
      })
      .finally(() => {
        setLoading(false);
      });
      // success("Sales loaded");
    } catch (err) {
      console.error(err);
       setLoading(false);
      fail("Contact to Service Provider");
      setSales([]);
    }
  };

  // const deletUpdateItem=(itemId,isDelete)=>{
  //     if(isDelete){
  //       setModal({
  //         open: true,
  //         title: "Delete Item",
  //         message: "Do you want to delete?",
  //         confirmText:"Yes, Delete",
  //         onConfirm: () => {
  //           deleteItem(itemId,isDelete);
  //           setModal({
  //               open: false
  //           })
  //         }
  //       })
  //     }else{
  //      setModal({
  //         open: true,
  //         title: "Edit Item",
  //         message: "Do you want to Edit?",
  //         confirmText:"Yes, Edit",
  //         onConfirm: () => {
  //           setModal({
  //               open: false
  //           })
  //               navigateTo("/addMobile?itemId="+itemId);
          
  //         }
  //       }) 
  //     }
  // }

    // const deleteItem=(itemId,isDelete)=>{
    //   if(activeTab==="entry"){
    //     if(isDelete){
    //         try {
    //           API.deleteItems(dispatch, {itemId:itemId,userId:ownerId,isdownload:true})
    //           .then(res => {
    //             let expense = res.payload;
    //             if(expense.code!=='undefined'){
    //               success(expense.message);
    //               fetchItems(startIndex,maxRecords,searchKeywords,startDate,endDate,false);
    //             }});
    //         } catch (err) {
    //           console.error(err);
    //           fail("Contact to Service Provider");
    //         }
    //    }else{
    //     alert("update");
    //    }
    //   }
    // };
    
  const handlePagination = (index) => {
    setPreviousIndex(index);
    setStartIndex(index*maxRecords);
    loadData(activeTab,index*maxRecords,false);
  }

  const exportExcel = () => {
    if((startDate!==null&&endDate!==null)||(searchKeywords!==null&&searchKeywords!=="")){
      loadData(activeTab,startIndex,true);
    }else{
      fail("Select filter");
   }
  };

  const clearFilter = () => {
   setStartIndex(0);
   setPreviousIndex(0);
   setSearchKeywords("");
   setStartDate(null);
   setEndDate(null);
  };

  const filterRecords = (searchKeywords) => {
    if((startDate!==null&&endDate!==null)||(searchKeywords!==null&&searchKeywords!=="")){
      if (activeTab === "sales") {
          console.log(searchKeywords);
      
          fetchSales(startIndex,maxRecords,searchKeywords,startDate,endDate,false);
      }
      else if (activeTab === "entry"){
          fetchItems(startIndex,maxRecords,searchKeywords,startDate,endDate,false);
      }
    }else{
      fail("Select filter");
    }
 };

//  const replaceSold = (salesId,returnStatus) => {
//             if(returnStatus){
//               fail("This Item already returned ,You can't replace it.");
//               return;
//             }
//             setModal({
//             open: true,
//             title: "Replace Item",
//             message: "Do you want to Replace?",
//             confirmText: "Yes,Under Warranty Replace",

//             input: true,
//             inputLabel: "Reason",
//             inputPlaceholder: "Enter replace reason",

//             onConfirm: (reason) => {

//               const payloadSold = {
//                 reason: reason,
//                 salesId: salesId,
//                 userId: ownerId
//               };
//               API.replaceSold(dispatch, payloadSold)
//                 .then((res) => {
//                     success(res.payload.message);   
//                 })
//                 .catch((err) => {
//                   console.log("Error:", err);
//                 }).finally(() => {
//                 setModal({
//                   open: false,
//                 });
//             });
//            }
//           })
//         };

    //     const returnSold = (salesId,returnStatus) => {
    //       if(returnStatus){
    //         fail("This Item already returned.");
    //         return;
    //       }
    //       setModal({
    //         open: true,
    //         title: "Return Item",
    //         message: "Do you want to Return?",
    //         confirmText: "Yes, Return",

    //         input: true,
    //         inputLabel: "Reason",
    //         inputPlaceholder: "Enter return reason",

    //         onConfirm: (reason) => {

    //           const payloadSold = {
    //             reason: reason,
    //             salesId: salesId,
    //             userId: ownerId
    //           };
    //           API.returnSold(dispatch, payloadSold)
    //             .then((res) => {
    //               success(res.payload.message);   
    //             })
    //             .catch((err) => {
    //               console.log("Error:", err);
    //             }).finally(() => {
    //             setModal({
    //               open: false,
    //             });
    //         });
    //         }
    //       });
    // };
 
  const downloadInvoiceSold= (invoiceNumber) =>{
    const payloadSold = {
      invoiceNumber: invoiceNumber,
      userId: ownerId
    };
     API.downloadInvoiceSold(dispatch,payloadSold).then(res => {
        success(res.payload.message);
     }).catch(err => {
      console.log("Error:", err);
     });
  }

  const visibleColumnsBuyer = columnsBuyer.filter((col) =>
        sales.some((buyer) =>
          buyer[col.key] !== null &&
          buyer[col.key] !== undefined &&
          buyer[col.key] !== ""
        )
      );

  return (
    <div>
          <Header
          title="Branch Mangement"
          subTitle="Manage everything in one place"
          dashboard = "2"
        />
    <div className="container mt-3 scrollable-div">
       <PageHeader pageName="Entry Items" />
       {/* <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-bold mb-0">Item Summary Report</h2>
      </div> */}
      {/* <BorderHeader message="Items Summary" /> */}

      {/* Tabs */}
      {/* <div className="tabs">
        {["sales", "entry"].map((tab) => (
          <button
            key={tab}
            className={`rigel-tabs col-6 ${activeTab === tab ? "rigel-tabs-active" : ""}`}
            // onClick={() =>{
            //   setSearchKeywords(null); setStartDate(null); setEndDate(null);
            //   activeTabOnClick(tab);setStartIndex(0);setPreviousIndex(0)
            // }}
            onClick={() => {
              setSearchKeywords("");
              setStartDate(null);
              setEndDate(null);
              setStartIndex(0);
              setPreviousIndex(0);
              setActiveTab(tab);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div> */}

     {/* Filters */}
    <div className="sr-filters">
      <input
          className="sr-input"
          type="text"
          placeholder="Search..."
          value={searchKeywords}
          onChange={(e) => setSearchKeywords(e.target.value)}
        />
      <DatePicker
        className="sr-input"
        placeholderText="Start Date"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />

      <DatePicker
        className="sr-input"
        placeholderText="End Date"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
      />
      </div>
      <div className="sr-actions">
        <button className="modern-clear-btn" onClick={exportExcel}>
         Excel Download
        </button>
       
        <button className="modern-clear-btn" onClick={() => filterRecords(searchKeywords)}>  
           Apply Filter
       </button>

       <button className="modern-clear-btn" onClick={clearFilter}>
          Clear
        </button>

    </div>
  

      {/* Table */}
    {activeTab==="entry"?(<div>
      <div className="table-responsive border rounded-4 bg-white shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="border-bottom">
            <tr>
              <th>#</th>
              {activeTab==="sales"&&(<th>Item Code</th>)}
              <th> {activeTab==="sales"?"Invoice No":("Item Code")}</th>
              <th>Items Name</th>
              <th>Brand</th>
              <th>Model</th>
              {/* <th>Vendor</th> */}
              <th>Qty</th>
              <th>Purchage Price</th>
              {activeTab === "sales"&&(<th>Selling Price</th>)}
              <th>{activeTab==="sales"?"Sold Price":("Selling Price")}</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeTab==="entry"&&items.length > 0 ? (
              items.map((i, idx) => 
                {
                  console.log(JSON.stringify(i));
               let buyer = null;
                try {
                  buyer = i.buyerInfo ? JSON.parse(i.buyerInfo) : null;
                } catch (e) {
                  buyer = null;
                }
               return (
                <tr key={i.itemCode + idx}>
                <td className="text-muted">{startIndex + idx + 1}</td>
                {/* Tooltip */}
                  <td className="text-muted"> <Tooltip text={
                    <>
                     <div>
                        <strong>Item Code :</strong> {i.itemCode || "-"} <br />
                        <strong>Vendor :</strong> {i.vendorName || "-"} <br />
                        <strong>Category:</strong> {i.category || "-"} <br />
                        <strong>Category Type:</strong> {i.categoryType || "-"} <br />
                        <strong>Item Type:</strong> {i.itemCondition || "-"} <br />
                        <strong>Measure Type:</strong> {i.measureType || "-"} <br />
                        <strong>Brand:</strong> {i.brand || "-"} <br />
                        <strong>Model Name:</strong> {i.modelName || "-"} <br />
                         {i.processor && (
                          <>
                            <strong>Processor:</strong> {i.processor} <br />
                          </>
                        )}
                        {i.screenSize && (
                          <>
                            <strong>Screen Size:</strong> {i.screenSize} <br />
                          </>
                        )}
                        {i.itemGen && (
                          <>
                            <strong>Generation :</strong> {i.itemGen} <br />
                          </>
                        )}
                        {/* {i.gstRate && (
                          <>
                            <strong>GST Rate:</strong> {i.gstRate} <br />
                          </>
                        )} */}
                         {i.operatingSystem && (
                          <>
                            <strong>Operating System:</strong> {i.operatingSystem} <br />
                          </>
                        )}
                        {i.itemColor && (
                          <>
                            <strong>Item Color:</strong> {i.itemColor} <br />
                          </>
                        )}
                        {i.ram && (
                          <>
                            <strong>RAM:</strong> {i.ram} {i.ramUnit || ""} <br />
                          </>
                        )}

                        {i.storage && (
                          <>
                            <strong>Storage:</strong> {i.storage} {i.storageUnit+", " || ""}{i.storageType||""} <br />
                          </>
                        )}
                        {i.description && (
                          <>
                            <strong>Description:</strong> {i.description} <br />
                          </>
                        )}
                        <strong>Quantity:</strong> {i.quantity || "-"} <br />
                        <strong>Initial Price:</strong> ₹{new Number(i.initialPrice).toFixed(2) || "0.00"} <br />
                        <strong>Selling Price</strong> ₹{new Number(i.sellingPrice).toFixed(2) || "0.00"} <br />
                        {i.itemSource && (
                          <>
                            <strong>Vendor:</strong> {i.vendorName} <br />
                          </>
                        )}
                      </div>
                     </>
                    }>      
                {i.itemCode}
                </Tooltip>
                </td>
                  <td className="text-muted">{i.categoryType}</td>
                  <td className="text-muted">{i.brand}</td>
                  <td className="text-muted">{i.modelName}</td>
                  {/* <td>{i.vendorName||"-"}</td> */}
                  <td className="text-muted">{i.quantity}</td>
                  <td className="text-muted">{i.initialPrice}</td>
                  <td className="text-muted">{i.sellingPrice}</td>
                  <td className="text-muted">{i.createdAt ? new Date(i.createdAt).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true}) : "-"}</td>
                 <td style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                    {/* EDIT BUTTON */}
                    <span
                      onClick={() => deletUpdateItem(i.id,false)}
                      style={{
                        cursor: "pointer",
                        color: "#2563eb",
                        fontSize: "16px",
                      }}
                      title="Edit"
                    >
                      ✏️
                    </span>

                    {/* DELETE BUTTON */}
                    <span
                      onClick={() => deletUpdateItem(i.id,true)}
                      style={{
                        cursor: "pointer",
                        color: "#ef4444",
                        fontSize: "16px",
                      }}
                      title="Delete"
                    >
                      🗑️
                    </span>

                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan={12} style={{ textAlign: "center" }} className="text-center py-4 text-muted">
                 Record Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>):(<div>

  <div className="table-responsive border rounded-4 bg-white shadow-sm">

  {sales.length>0?(<table className="table align-middle mb-0">
    {/* ================= PARENT HEADER ================= */}
    <thead className="border-bottom">
      <tr>
        <th className="px-3 py-2">#</th>
        {visibleColumnsBuyer.map((col) => (
          <th
            key={col.key}
            className="px-3 py-2 text-nowrap"
            style={{
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {col.label}
          </th>
        ))}
        <th className="text-end px-3 py-2">Action</th>
      </tr>
    </thead>

    <tbody>
      {sales.map((buyer, i) => {
        const isOpen = openId === buyer.id;

        const visibleColumns = columns.filter((col) =>
          buyer.salesInfo.some(
            (item) =>
              item[col.key] !== null &&
              item[col.key] !== undefined &&
              item[col.key] !== ""
          )
        );

        return (
          <React.Fragment key={buyer.id}>

            {/* ================= PARENT ROW ================= */}
            <tr
              // style={{
              //   // cursor: "pointer",
              //   background: isOpen ? "#f9fafb" : "white",
              // }}
              className="border-bottom"
            >
           <td className="px-3 py-2">{i + 1}</td>

            {/* {visibleColumnsBuyer.map((col) => (
              <td key={col.key}>
                {buyer[col.key] ?? "-"}
              </td>
            ))} */}
            {visibleColumnsBuyer.map((col) => {
              if (col.key === "invoiceNumber") {
                return (
                  <td key={col.key} className="text-success fw-bold"  
                  style={{ cursor: "pointer", backgroundColor: isOpen ? "#8ddeba" : "transparent", color: isOpen ? "#fff" : "#000", borderRadius: "5px" }}
                  onClick={() => toggle(buyer.id)}>
                    {buyer[col.key] ?? "-"}
                  </td>
                );
              } else {
                return (
                  <td key={col.key} className="text-muted">
                    {buyer[col.key] ?? "-"}
                  </td>
                );
              }
            })}

       <td className="text-end">
          {(() => {
            return (
              <div className="d-flex justify-content-end gap-2">
                {/* Invoice Download Button */}
                <span
                  onClick={() => downloadInvoiceSold(buyer.invoiceNumber)}
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                >
                  <FiDownload className="me-1" />
                  Invoice
                </span>

              </div>
            );
          })()}
       </td>

          </tr>
            {/* ================= CHILD EXPAND ================= */}
            {isOpen && (
              <tr>
                <td colSpan={12} className="p-0 border-0">

                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#fafafa",
                      borderTop: "1px solid #e5e7eb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >

                    {/* INNER WRAPPER */}
                    <div className="border rounded-3 bg-white">

                      {/* SMALL HEADER */}
                      <div
                        style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #e5e7eb",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        Sold Items ({buyer.salesInfo.length})
                      </div>

                      {/* CHILD TABLE */}
                      <table className="table table-sm mb-0">

                        <thead>
                          <tr>
                            {visibleColumns.map((col) => (
                              <th
                                key={col.key}
                                className="px-3 py-2 text-muted"
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 500,
                                   whiteSpace: "nowrap",
                                }}
                              >
                                {col.label}
                              </th>
                            ))}
                            <th className="text-muted text-end">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {buyer.salesInfo.map((s, index) => (
                            <tr key={s.id || index}>

                              {visibleColumns.map((col) => (
                                <td
                                  key={col.key}
                                  className="px-3 py-2"
                                  style={{ fontSize: "11px" }}
                                >

                                  {/* PRICE */}
                                  {col.key === "soldPrice" ? (
                                    <span className="fw-semibold" style={{ fontSize: "11px" }}>
                                      ₹{s[col.key] ?? 0}
                                    </span>
                                  ) :

                                  /* BOOLEAN */
                                  typeof s[col.key] === "boolean" ? (
                                    s[col.key] ? "Yes" : "No"
                                  ) :

                                  /* DEFAULT */
                                  (
                                    s[col.key] || "-"
                                  )}

                                </td>
                              ))}

                              <td className="text-end">
                                  {(() => {
                                    // Invoice Date
                                    const invoiceDate = new Date(buyer?.createdAt);
                                    const currentDate = new Date();

                                    // Days Difference
                                    const diffTime = currentDate - invoiceDate;
                                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                                    // Conditions
                                    const isReturnExpired = diffDays > 15;
                                    const isReturned = buyer?.returnStatus === "Returned";

                                    return (
                                      <div className="d-flex justify-content-end gap-2">

                                        {/* Return Button */}
                                        {!isReturnExpired && (
                                         <div>
                                            <span
                                              onClick={() => returnSold(s.id,s.returnStatus)}
                                              className={`btn btn-sm rounded-pill px-3 text-nowrap fw-semibold ${
                                                isReturned
                                                  ? "btn-success disabled"
                                                  : "btn-outline-danger"
                                              }`}
                                            >
                                            <FiRefreshCw className="me-1" />

                                              {isReturned ? "Returned" : "Return"}
                                            </span>
                                          </div>
                                           )}
                                           {s.warrantyInMonth>0&&(
                                           <span
                                            onClick={() => replaceSold(s.id,s.returnStatus)}
                                            className={`btn btn-sm rounded-pill text-nowrap px-3 fw-semibold ${
                                              isReturned
                                                ? "btn-success disabled"
                                                : "btn-outline-danger"
                                            }`}
                                          >
                                            {s.replaceCount>0?(<RefreshBadge count={s.replaceCount} size={18} />):(<RefreshBadge size={18}/>)}
                                            {/* <FiRefreshCw className="me-1" value={2}/> */}

                                            {isReturned ? "Replace" : "Replace"}
                                          </span>
                                        )}
                                       
                                      </div>
                                    );
                                  })()}
                                </td>

                            </tr>
                          ))}
                        </tbody>

                      </table>

                    </div>
                  </div>

                </td>
              </tr>
            )}

          </React.Fragment>
        );
      })}

    </tbody>
  </table>):(<table className="table align-middle mb-0">
  {/* ================= PARENT HEADER ================= */}
  <thead className="border-bottom">
    <tr>
      {columnsBuyer.map((col) => (
        <th key={col.key}>{col.label}</th>
      ))}
    </tr>
  </thead>

  <tbody>
    {sales?.length > 0 ? (
      sales.map((item, index) => (
        <tr key={index}>
          {columnsBuyer.map((col) => (
            <td key={col.key}>{item[col.key]}</td>
          ))}
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan={columnsBuyer.length}
          className="text-center py-4 text-muted"
        >
          Record Not Found
        </td>
      </tr>
    )}
  </tbody>
</table>)}
</div>
    {loading ? <Loader isOpen={true} progress={95} /> : <p></p>}
    </div>)}
         {/* Pagination */}
      <nav aria-label="Page navigation" className="mt-3 pagination-position">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${previousIndex === 0 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePagination(previousIndex - 1)}>
              Previous
            </button>
          </li>
          {
            (() => {
              let start = previousIndex - 2;

              // ensure minimum 0 se start ho
              if (start <= 0) start = 0;

              // hamesha 3 items generate karo
              const pages = [start, start + 1, start + 2];

              return pages.map((pageIndex) => (
                <li
                  key={pageIndex}
                  className={`page-item ${previousIndex === pageIndex ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePagination(pageIndex)}
                  >
                    {pageIndex + 1}
                  </button>
                </li>
              ));
            })()
          }
          <li className={`page-item ${items.length === 0 ? "disabled" : ""}`}>
            <button disabled={items.length === 0} className="page-link" onClick={() => handlePagination(previousIndex + 1)}>
              Next
            </button>
          </li>

        </ul>
      </nav>
      {/* <ConfirmModal
              open={modal.open}
              title={modal.title}
              message={modal.message}
              confirmText={modal.confirmText}
              cancelText="No"
              type="danger"

              input={modal.input}
              inputLabel={modal.inputLabel}
              inputPlaceholder={modal.inputPlaceholder}

              onCancel={() => setModal({ open: false })}
              onConfirm={modal.onConfirm}
      /> */}
    </div>
   </div> 
  );
}