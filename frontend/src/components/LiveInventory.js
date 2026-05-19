import React, { useState, useEffect,useRef } from "react";
import devices from "./data/device.json";
import itembrand from "./data/itembrand.json";
import brandProcessor from "./data/brandProcessor.json";
import Select from "react-select";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar"
import Tooltip from "./Tooltip"
import Cookies from "js-cookie";

/* ---------- Custom Styles (height 30px) ---------- */
const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: 30,
    height: 30,
    borderRadius: 6,
    borderColor: "#d9d9d9",
    boxShadow: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 30,
    padding: "0 10px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: 30,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 4,
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
};

const LiveInventory = () => {
  
  const secret = Cookies.get("secretCode"); 
  const dispatch = useDispatch();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [processorOptions, setProcessorOptions] = useState([]);
  const [initialInventory, setInitialInventory] = useState([]);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [filterRequest, setFilterRequest] = useState({
    startIndex: 0,
    maxRecords: 10,
    category: null,
    categoryType: null,
    brand: null,
    processor: null,
    itemCondition: null,
    modelName: null,
    ram: null,
    storage: null,
    storageType: null,
    operatingSystem: null,
    screenSize: null,
    itemGen: null,
    description: null,
    userId:secret
  });

  const categories = devices.categories.map((c) => c.category);
  const selectedCategory = devices.categories.find(
    (c) => c.category === filterRequest.category
  );

  const brandOptions = itembrand?.brands?.[filterRequest?.categoryType] ?? [];

  const itemConditionOptions = [
    { value: "New", label: "New" },
    { value: "Refurbished", label: "Refurbished" },
    { value: "Used", label: "Used" },
  ];

  const storageTypeOptions = [
    { value: "SSD", label: "SSD" },
    { value: "HDD", label: "HDD" },
    { value: "NVMe", label: "NVMe" },
  ];
useEffect(() => {
  initialInventoryLoad();
}, [filterRequest]);

  const initialInventoryLoad = () => {
    // console.log(filterRequest);
    API.inventryItemListAndSearch(dispatch,filterRequest).then(res => {
      console.log(res.payload);
        setInitialInventory(res.payload.data.items);
      })
    .catch(err => {
      console.log("Error:", err);
    });
  }

  const handlePagination = (index) => {
    setPreviousIndex(index);
    setFilterRequest(prev => ({
      ...prev,
      startIndex: index*filterRequest.maxRecords
    }));
  }

  const handleFilter = (name, value) => {
    setFilterRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleFilter = (selected, itemName) => {
  //   if (!selected) {
  //     setFilterRequest({ ...filterRequest, [itemName]: null });
  //     return;
  //   }
  //     setFilterRequest({ ...filterRequest, [itemName]: selected.value });

  //   if (itemName === "brand") {
  //     setProcessorOptions(brandProcessor?.Laptop?.[selected.value] ?? []);
  //   }
  // };

  // const handleTextChange = (e) => {
  //   setFilterRequest({ ...filterRequest, [e.target.name]: e.target.value });
  // };




  
  const clearFilters = () => {
    setFilterRequest({
      startIndex: 0,
      maxRecords: 10,
      category: null,
      categoryType: null,
      brand: null,
      processor: null,
      itemCondition: null,
      modelName: null,
      ram: null,
      storage: null,
      storageType: null,
      operatingSystem: null,
      screenSize: null,
      itemGen: null,
      description: null,
      userId:secret
    });
    setProcessorOptions([]);
    initialInventoryLoad();
  };

  const searchFilters = () => {
   console.log(filterRequest);
  };

  return (
    <div className="container mt-3 scrollable-div">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-bold mb-0">Inventory Dashboard</h2>
        <span className="badge bg-primary fs-6">Total Items: {initialInventory==null?0:initialInventory.length}</span>
      </div>

      {/* Normal Search */}
      <div className="mb-3">
        <input
          className="form-control shadow-sm"
          style={{
            height: 30,
            borderRadius: 8,
            borderColor: "#d9d9d9",
          }}
          placeholder="Search Description..."
          name="description"
          value={filterRequest.description || null}
          onChange={(e) => {
                  handleFilter("description", e.target.value);
                }}
        />
      </div>

      {/* Advanced Search Toggle */}
      <div className="mb-3 text-end">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
      </div>

      {/* Advanced Search */}
      {showAdvanced && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              {/* Category */}
              <div className="col-md-3">
                <Select
                  styles={customStyles}
                  options={categories.map((c) => ({ value: c, label: c }))}
                  value={
                    filterRequest.category
                      ? { value: filterRequest.category, label: filterRequest.category }
                      : null
                  }
                  onChange={(selected) => {
                    handleFilter("category", selected?.value);
                    setProcessorOptions([]);
                  }}
                  placeholder="Search Category"
                  isClearable
                />
              </div>

              {/* Item Type */}
              <div className="col-md-3">
                <Select
                  styles={customStyles}
                  options={selectedCategory?.items?.map((i) => ({ value: i.name, label: i.name })) || []}
                  value={
                    filterRequest.categoryType
                      ? { value: filterRequest.categoryType, label: filterRequest.categoryType }
                      : null
                  }
                  onChange={(selected) => {
                    handleFilter("categoryType", selected?.value);
                  }}
                  placeholder="Search Item Type"
                  isDisabled={!filterRequest.category}
                  isClearable
                />
              </div>

              {/* Brand */}
              <div className="col-md-3">
                <Select
                  styles={customStyles}
                  options={brandOptions}
                  value={
                    filterRequest.brand
                      ? { value: filterRequest.brand, label: filterRequest.brand }
                      : null
                  }
                  onChange={(selected) => {
                    handleFilter("brand", selected?.value);
                  }}
                  placeholder="Search Brand"
                  isDisabled={!filterRequest.categoryType}
                  isClearable
                />
              </div>

              {/* Processor */}
              <div className="col-md-3">
                <Select
                  styles={customStyles}
                  options={processorOptions}
                  value={
                    filterRequest.processor
                      ? { value: filterRequest.processor, label: filterRequest.processor }
                      : null
                  }
                  onChange={(selected) => {
                    handleFilter("processor", selected?.value);
                  }}
                  placeholder="Search Processor"
                  isDisabled={!filterRequest.brand}
                  isClearable
                />
              </div>

              {/* Condition */}
              <div className="col-md-3">
                <Select
                  styles={customStyles}
                  options={itemConditionOptions}
                  value={
                    filterRequest.itemCondition
                      ? { value: filterRequest.itemCondition, label: filterRequest.itemCondition }
                      : null
                  }
                  onChange={(selected) => {
                    handleFilter("itemCondition", selected?.value);
                  }}
                  placeholder="Search Condition"
                  isClearable
                />
              </div>

              {/* Storage Type */}
              <div className="col-md-3">
                <Select
                  styles={customStyles}
                  options={storageTypeOptions}
                  value={
                    filterRequest.storageType
                      ? { value: filterRequest.storageType, label: filterRequest.storageType }
                      : null
                  }
                  onChange={(selected) => {
                    handleFilter("storageType", selected?.value);
                  }}
                   placeholder="Search Storage Type"
                  isClearable
                />
              </div>

              {/* Model Name */}
              <div className="col-md-3">
                <input
                  className="form-control"
                  style={{ height: 30, borderRadius: 8, borderColor: "#d9d9d9" }}
                  placeholder="Search Model Name"
                  name="modelName"
                  value={filterRequest.modelName || ""}
                  onChange={(e) => {
                    handleFilter("modelName", e.target.value);
                  }}
                />
              </div>

              {/* RAM */}
              <div className="col-md-3">
                <input
                  className="form-control"
                  style={{ height: 30, borderRadius: 8, borderColor: "#d9d9d9" }}
                  placeholder="Search RAM"
                  name="ram"
                  value={filterRequest.ram || ""}
                  onChange={(e) => {
                    handleFilter("ram", e.target.value);
                  }}
                />
              </div>

              {/* Storage */}
              <div className="col-md-3">
                <input
                  className="form-control"
                  style={{ height: 30, borderRadius: 8, borderColor: "#d9d9d9" }}
                  placeholder="Search Storage"
                  name="storage"
                  value={filterRequest.storage || ""}
                  onChange={(e) => {
                    handleFilter("storage", e.target.value);
                  }}
                />
              </div>

              {/* Operating System */}
              <div className="col-md-3">
                <input
                  className="form-control"
                  style={{ height: 30, borderRadius: 8, borderColor: "#d9d9d9" }}
                  placeholder="Search OS"
                  name="operatingSystem"
                  value={filterRequest.operatingSystem || ""}
                  onChange={(e) => {
                    handleFilter("operatingSystem", e.target.value);
                  }}
                />
              </div>

              {/* Screen Size */}
              <div className="col-md-3">
                <input
                  className="form-control"
                  style={{ height: 30, borderRadius: 8, borderColor: "#d9d9d9" }}
                  placeholder="Search Screen"
                  name="screenSize"
                  value={filterRequest.screenSize || ""}
                  onChange={(e) => {
                    handleFilter("screenSize", e.target.value);
                  }}
                />
              </div>

              <div className="col-12 text-end">
                <button className="btn btn-outline-secondary" onClick={searchFilters}>
                  Search
                </button>
              </div>
              <div className="col-12 text-end">
                <button className="btn btn-outline-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th className="col-1">#</th>
              <th className="col-2"><center>Code</center></th>
              <th className="col-1">Brand</th>
              <th className="col-1">Model</th>
              <th className="col-1">Item Type</th>
              <th className="col-5">Description</th>
              <th className="col-1">Quantity</th>
              <th className="col-1">Purchage</th>
              <th className="col-1">Selling</th>
              <th>Measure</th>
            </tr>
          </thead>
          <tbody>
            {initialInventory.length >0 ? (
              initialInventory.map((i, idx) => (
                <tr key={i.id}>
                  <td  className="col-1">{filterRequest.startIndex + idx + 1}</td>
                  <td>
                    <Tooltip text={
                        <>
                        <div>
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
                          <strong>Selling Price:</strong> ₹{i.sellingPrice?.toFixed(2) || "0.00"}
                        </div>
                          </>
                        }>
                      {i.itemCode|| "-"}
                    </Tooltip>
                  </td>
                  <td className="col-1">{i.brand}</td>
                  <td className="col-1">{i.modelName}</td>
                  <td className="col-1">{i.itemCondition}</td>
                  <td className="col-5">{i.description}</td>
                  <td className="col-1">{i.quantity}</td>
                  <td className="col-1">{i.initialPrice}</td>
                  <td className="col-1">{i.sellingPrice}</td>
                  <td>{i.measureType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No products found
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
        <li className={`page-item ${initialInventory.length === 0 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePagination(previousIndex + 1)}>
            Next
          </button>
        </li>

      </ul>
    </nav>

    </div>
  );
};

export default LiveInventory;
