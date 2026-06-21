import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import Cookies from "js-cookie";
import { success } from "../redux/WebTostar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import Header from "../components/Header";

export default function GarbageItem() {

  const ownerId = Cookies.get("secretCode");
  const dispatch = useDispatch();

  const [allItems, setAllItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [statusFilter, setStatusFilter] = useState("collected");
  const [previousIndex, setPreviousIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [maxRecords, setMaxRecords] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filterRequest, setFilterRequest] = useState({
      userId: parseInt(ownerId),
      startIndex: startIndex,
      maxRecords: maxRecords,
      status:statusFilter,
      searchKeyword: null,
      startDate: null,
      endDate: null
  });

  const handleKeywordSearch = (value) => {
  setSearchKeyword(value);

  setFilterRequest(prev => ({
    ...prev,
    searchKeyword: value,
    startIndex: 0
  }));
};
  // ---------- DATE FORMAT ----------
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // ---------- API ----------
  useEffect(() => {
    loadData();
  }, [filterRequest]);

  const loadData = () => {
    API.searchGarbage(dispatch,filterRequest)
      .then(res => {
        const allItems = res?.payload?.data?.garbageList || [];
        setAllItems(allItems);
      })
      .catch(err => console.log(err));
  };

  const handlePagination = (index) => {
    setPreviousIndex(index);
    setFilterRequest(prev => ({
      ...prev,
      startIndex: index*filterRequest.maxRecords
    }));
  }
  
  const filterStatusReq=(status)=>{
      setStatusFilter(status);
      setFilterRequest(prev => ({
        ...prev,
        status: status
      }));
  };
  const handleFilter=()=>{
    loadData();
  };

  return (
    <div>
      <Header
      title="Branch Mangement"
      subTitle="Manage everything in one place"
    />
    <div className="container py-4">

      <h3 className="fw-bold mb-3">
        Garbage Collection
      </h3>
      
      {/* FILTER */}
      <div className="mb-3">
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => {filterStatusReq(e.target.value);}}
        >
          <option value="collected">Collected</option>
          <option value="returned">Returned</option>
        </select>
      </div>
      <div className="row mb-3 g-2">

  {/* Keyword Search */}
  <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      placeholder="Search item, vendor, code..."
      value={searchKeyword}
      onChange={(e) => handleKeywordSearch(e.target.value)}
    />
  </div>

  {/* Start Date */}
  <div className="col-md-3">
    <DatePicker
      className="form-control shadow-sm"
      locale={enUS}
      popperPlacement="bottom-start"
      dateFormat="yyyy-MM-dd"
      placeholderText="📅 Start date (from)"
      selected={filterRequest.startDate}
      maxDate={filterRequest.endDate} 
      onChange={(date) => {
         setFilterRequest(prev => ({
          ...prev,
          startDate: date
        }));
      }}
    />
  </div>

  {/* End Date */}
  <div className="col-md-3">
     <DatePicker
        className="form-control shadow-sm"
        locale={enUS}
        popperPlacement="bottom-start"
        dateFormat="yyyy-MM-dd"
        placeholderText="📅 End date (to)"
        selected={filterRequest.endDate}
        minDate={filterRequest.startDate} 
        onChange={(date) => {
          setFilterRequest(prev => ({
          ...prev,
          endDate: date
        }));
        }}
      />
  </div>

  {/* Apply Button */}
  <div className="col-md-2">
    <button className="btn btn-primary w-100" onClick={handleFilter}>
      Filter
    </button>
  </div>

</div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">

        <div className="card-body p-0 table-responsive">

          <table className="table table-hover align-middle mb-0 table-bordered border-light">

            <thead className="table-light text-nowrap">
              <tr className="">
                <th>Vendor</th>
                <th>Item Code</th>
                <th>Garbage Reason</th>
                <th>Status</th>
                <th>Product</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Initial</th>
                <th>Sold</th>
                <th>Return Date</th>
                <th>Collected Date</th>  
              </tr>
            </thead>

            <tbody>
              {allItems.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center text-muted py-4">
                    No Data Found
                  </td>
                </tr>
              ) : (
                allItems.map((item) => (
                  <tr key={item.id}>
                    <td className="text-nowrap">{item.vendorName}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.garbageReason}</td>
                    <td>
                      <span className={`badge ${
                        item.garbageStatus === "collected"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}>
                        {item.garbageStatus}
                      </span>
                    </td>
                    <td>
                      <b>{item.brand}</b> {item.modelName}
                    </td>

                    <td className="text-muted">
                      {item.description}
                    </td>

                    <td>{item.quantity}</td>

                    <td>₹{item.initialPrice}</td>

                    <td className="text-success fw-bold">
                      ₹{item.soldPrice}
                    </td>
                    {/* ✅ RETURN DATE FIX */}
                    <td className="text-warning fw-semibold">
                      {item.garbageStatus !== "collected"
                        ? formatDateTime(item.updatedAt)
                        : "-"}
                    </td>
                    <td className="text-primary fw-semibold !text-left">
                      {formatDateTime(item.createdAt)}
                    </td>

                  

                  </tr>
                ))
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
            if (start < 0) start = 0;

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
        <li className={`page-item ${allItems.length === 0 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePagination(previousIndex + 1)}>
            Next
          </button>
        </li>

      </ul>
    </nav>


      </div>

    </div>
    </div>
  );
}