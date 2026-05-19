import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import { success, fail } from "../redux/WebTostar";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "./Tooltip";
import Cookies from "js-cookie";

export default function ItemSummaryReport() {
  const secret = Cookies.get("secretCode");       
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("sales"); // sales / entry
  const [items, setItems] = useState([]);

  const [startIndex, setStartIndex] = useState(0);
  const [maxRecords, setMaxRecords] = useState(10);
  const [searchKeywords, setSearchKeywords] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [previousIndex, setPreviousIndex] = useState(0);

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
      const res = await API.searchItems(dispatch, {startIndex:startIndex,maxRecords:maxRecords,searchKeyword:searchKeywords,startDate:startDate,endDate:endDate,isdownload:isdownload,userId:secret});
       const data = res.payload.data?.items || [];
      if(!isdownload){
        if(data.length>0){
          setItems(mapItems(data));
        }else{
          setItems([]);
        }
      }else{  
        if(data.length==0){
          fail("Record is not in selected filter");
        }else{
            success("Excel file download Successfully.")
        }
      }
      // success("Items loaded");
    } catch (err) {
      console.error(err);
      fail("Contact to Service Provider");
      setItems([]);
    }
  };

  const fetchSales = async (startIndex,maxRecords,searchKeywords,startDate,endDate,isdownload) => {
    try {
      const res = await API.salesListAndSearch(dispatch, {startIndex:startIndex,maxRecords:maxRecords,searchKeyword:searchKeywords,startDate:startDate,endDate:endDate,isdownload:isdownload,userId:secret});
        const data = res.payload?.data?.sales || [];
        console.log(data.length);
        if(!isdownload){
          if(data.length>0){
            setItems(mapItems(data));
          }else{
            setItems([]);
          }
        }else{
          if(data.length==0){
            fail("Record is not in selected filter");
          }else{
            success("Excel file download Successfully.")
          }
        }
      // success("Sales loaded");
    } catch (err) {
      console.error(err);
      fail("Contact to Service Provider");
      setItems([]);
    }
  };

  const mapItems = (data) =>
    data.map((i) => ({
      itemCode: i.itemCode || "",
      category: i.category || "",
      categoryType: i.categoryType || "",
      itemCondition: i.itemCondition || "",
      measureType: i.measureType || "",
      brand: i.brand || "",
      modelName: i.modelName || "",
      ram: i.ram || "",
      ramUnit: i.ramUnit || "",
      storage: i.storage || "",
      storageUnit: i.storageUnit || "",
      quantity: i.quantity || 0,
      initialPrice: i.initialPrice || 0,
      sellingPrice: i.sellingPrice || 0,
      soldPrice: i.soldPrice || 0,
      image: i.image || "",
      status: i.status || 1,
      createdAt: i.createdAt || null,
      buyerInfo: JSON.stringify(i.buyerInfo || null)
    }));
  
  const handlePagination = (index) => {
    setPreviousIndex(index);
    setStartIndex(index*maxRecords);
    loadData(activeTab,index*maxRecords,false);
  }

  const exportExcel = () => {
    if((startDate!==null&&endDate!==null)||(searchKeywords!==null)){
      loadData(activeTab,startIndex,true);
    }else{
      fail("Select filter");
   }
  };

  const filterRecords = (searchKeywords) => {
    if (activeTab === "sales") {
       console.log(searchKeywords);
   
       fetchSales(startIndex,maxRecords,searchKeywords,startDate,endDate,false);
    }
    else if (activeTab === "entry"){
       fetchItems(startIndex,maxRecords,searchKeywords,startDate,endDate,false);
    }
  };

  const activeTabOnClick= (tab) =>{
    setActiveTab(tab);
    loadData(tab,startIndex,false);
  }

  return (
    <div className="container mt-3 scrollable-div">
       <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-bold mb-0">Item Summary Report</h2>
      </div>

      {/* Tabs */}
      <div className="tabs">
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
      </div>

     {/* Filters */}
    <div className="sr-filters">
      <input
          className="sr-input"
          type="text"
          placeholder="Search by description..."
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
        <button className="btn btn-primary" onClick={exportExcel}>
          Export
        </button>
       
        <button className="btn btn-primary" onClick={() => filterRecords(searchKeywords)}>   Apply Filter
       </button>

    </div>
  

      {/* Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th> {activeTab==="sales"?"Invoice No":("Item Code")}</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Qty</th>
              <th>{activeTab==="sales"?"Sold Price":("Selling Price")}</th>
              <th>Category</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((i, idx) => 
                {
               let buyer = null;
                try {
                  buyer = i.buyerInfo ? JSON.parse(i.buyerInfo) : null;
                } catch (e) {
                  buyer = null;
                }
               return (
                <tr key={i.itemCode + idx}>
                <td>{startIndex + idx + 1}</td>

                  {/* Tooltip */}
                  <td> <Tooltip text={
                    <>
                     <div>
                       {activeTab==="sales"&&(<>
                        {buyer?.buyerName&&(<><strong>Buyer Name:</strong> {buyer?.buyerName || "-"} <br /></>)}
                        <strong>Invoice No:</strong> {buyer?.invoiceNumber || "-"} <br />
                        {buyer?.buyerName&&(<><strong>Email:</strong> {buyer?.emailId || "-"} <br /></>)}
                        <hr /> </> )}
                        <strong>Item Code :</strong> {i.itemCode || "-"} <br />
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
                        {i.gstRate && (
                          <>
                            <strong>GST Rate:</strong> {i.gstRate} <br />
                          </>
                        )}
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
                            <strong>Storage:</strong> {i.storage} {i.storageUnit || ""} <br />
                          </>
                        )}
                        {i.description && (
                          <>
                            <strong>Description:</strong> {i.description} <br />
                          </>
                        )}
                        <strong>Quantity:</strong> {i.quantity || "-"} <br />
                        <strong>Initial Price:</strong> ₹{i.initialPrice?.toFixed(2) || "0.00"} <br />
                        <strong>{activeTab==="sales"?"Sold Price":("Selling Price")}:</strong> ₹{(activeTab === "sales" ? i.soldPrice : i.sellingPrice)?.toFixed(2) || "0.00"}
                      </div>
                     </>
                    }>      
                {activeTab==="sales"?buyer?.invoiceNumber:(i.itemCode)}
                </Tooltip>
                </td>
                  <td>{i.brand}</td>
                  <td>{i.modelName}</td>
                  <td>{i.quantity}</td>
                  <td>{activeTab === "sales" ? i.soldPrice : i.sellingPrice}</td>
                  <td>{i.category}</td>
                  <td>{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}