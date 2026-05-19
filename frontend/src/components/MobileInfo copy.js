import React, { useState, useEffect,useRef } from "react";
import devices from "./data/device.json";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar"
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import itembrand from "./data/itembrand.json"
import brandProcessor from "./data/brandProcessor.json"

const vendorsInitial = [
  { id: 1, companyName: "ABC Traders", gstNumber: "03AAAAA0000A1Z5", district: "Ludhiana", pincode: "141001", address: "Focal Point, Ludhiana" },
  { id: 2, companyName: "XYZ Enterprises", gstNumber: "27BBBBB1111B2Z6", district: "Mumbai", pincode: "400069", address: "Andheri East, Mumbai" }
];

const ElectronicItem = () => {
  const [vendors] = useState(vendorsInitial);
    
  const dispatch = useDispatch();


const allowedGB = /^(128|256|512)MB$|^(2|4|8|16|32|64|128|256|512)GB$|^([1-9][0-9]?|100)TB$/;

  const [item, setItem] = useState({
    category: "",
    categoryType: "",
    measureType:"",
    brand: null,
    modelName: "",
    itemCondition: "",
    itemSource: "",
    ram : "",
    storage : "",
    ramUnit : "",
    storageType : "",
    storageUnit : "",
    quantity:"",
    initialPrice:"",
    sellingPrice:"",
    description : "",
    itemcolor:"",
    image: "",
    processor: null,
    operatingSystem:null,
    screenSize:null,
    itemGen: null
  });
  
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);
  const [errors, setErrors] = useState({});
  const [processorOptions, setProcessorOptions] = useState(null);
  const [savedItem, setSavedItem] = useState(null);

// item.categoryType check karke brand options set karna
const brandOptions = itembrand?.brands?.[item?.categoryType] ?? [];
// const processorOptions = brandProcessor?.Laptop?.[item?.brand] ?? [];

// const brandOptions = item.categoryType
//   ? itembrand.brands[item.categoryType] || []  // note .brandS
//   : [];

//   const processorOptions = item.brand==null?[]:(brandProcessor.Laptop[item.brand] || []);


  const payload = {
        stratIndex: page,
        pageSize: pageSize,
        order:"DESC"
      };

  useEffect(() => {
      
  API.searchItems(dispatch,payload).then(res => {
    setSavedItem(res.payload.data.items);
    })
  .catch(err => {
    console.log("Error:", err);
  });
    // const data = JSON.parse(localStorage.getItem("electronic_item"));
    // if (data) setSavedItem(data);
  }, []);

   const vendorOptions = [
    // { value: "", label: "Select Vendor" },
    ...vendors.map(v => ({ value: v.id, label: v.companyName }))
  ];
  const handleVendorChange = (selected,itemName) => {
    if(itemName==="itemSource") {
      if (!selected || selected.value === "") {
        setItem({
            ...item,
            [itemSource]: null
          });

        return;
      }
      const v = vendors.find(x => x.id === selected.value);
      if (v) {
        setItem({
              ...item,
              itemSource:  v.companyName
            });
      }
  }else if(itemName==="processor"){
     if(selected!=null){
      setItem({
            ...item,
            processor:   selected.value
      });
    }else{
      setItem({
            ...item,
            processor:   null
      });
    }
  }else{
   if (brandOptions.length === 0) {
    if(selected!=null){
      setItem({
        ...item,
        brand:  selected.value
      }); 
    }else{
       setItem({
        ...item,
        brand:  null
      }); 
    }
   }else{
    if(selected!=null){
      setItem({
        ...item,
        brand:  selected.value
      }); 
      setProcessorOptions(brandProcessor?.Laptop?.[selected.value] ?? []);
    }else{
       setItem({
        ...item,
        brand:  null
      }); 
    }
          
    }
  }
  };

  


  const handleChange = (e) => {
  if(e.target.type==="textarea"){
      let values=e.target.value;
      values = values.replace(/\n/g, " ");
      values = values.replace(/\s+/g, " ");
      values = values.trimStart();
      const words = values.trim() === "" ? [] : values.trim().split(" ");
      
      // Words Split & Clean
      // const words = value.trim().split(/\s+/);
      
      // Allow typing only if words ≤ 10
      if (words.length <= 10) {
        setItem({
          ...item,
          description: values
        });
      }
    }else{
      const { name, value } = e.target;

      setItem((prev) => ({
        ...prev,
        [name]: value,
      }));

      // ✅ Error remove when user types correct value
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
  }
};

//   const handleChange = (e) => {
//     setItem({ ...item, [e.target.name]: e.target.value });
//   };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setItem({ ...item, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // 🔐 Validation
  const validate = () => {
    let temp = {};
    if (!item.category) temp.category = "Category required";
    if (!item.categoryType) temp.categoryType = "Item type required";
    if (!item.brand.trim()) temp.brand = "Brand required";
    if (!item.modelName.trim()) temp.modelName = "Item model/Name required";
    if (!item.description.trim()) temp.description = "Item description required";
    if (!item.quantity.trim()) temp.quantity = "Quantity is required";
    if (!item.sellingPrice.trim()) temp.sellingPrice = "SellingPrice is required";
    if (!item.initialPrice.trim()) temp.initialPrice = "Rate is required";
    if (!item.measureType.trim()) temp.measureType = "measureType is required";
    if (!item.itemcolor.trim()) temp.itemcolor = "Item description required";
    
    
    const ramInGB =Number(item.ram)+""+item.ramUnit;
    const storageInGB =Number(item.storage)+""+ item.storageUnit;
     
    if (showSpecs && item.ram && !allowedGB.test(ramInGB)) {
        temp.ram =
        "RAM must be 2,4,8,16,32,64,128,256,512 GB";
    }

    if ((showSpecs || showStoreSpecs) && item.storage && !allowedGB.test(storageInGB)) {
        temp.storage =
        "Storage must be 2,4,8,16,32,64,128,256,512 GB or 1TB–100TB";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };
// const [text, setText] = useState("");

// const handleWordLimit = (e) => {
//   const value = e.target.value;

//   if(e.target.type==="textarea"){
//     // Words Split & Clean
//     const words = value.trim().split(/\s+/);
//     console.log(words.length);
//     // Allow typing only if words ≤ 10
//     if (words.length <= 3) {
//       setItem({
//         ...item,
//         description: value
//       });
//     }
//   }

// };



  const getPagination=(e)=>{
    if(e=="n"){
      setPage(page-2);
    }else{
      setPage(page+2);
    }
    API.searchItems(dispatch,payload).then(res => {
    setSavedItem(res.payload.data.items);
    })
  }

  /* ---------- Custom Styles (height 30px) ---------- */
const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: 30,
    height: 30,
    borderRadius: 3,
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

  const handleEnterNextInput = (e) => {
    // ENTER pressed
  if (e.key === "Enter") {
    e.preventDefault();
    const form = e.target.form;

    const elements = Array.from(form.elements).filter(
      (el) => !el.disabled && el.type !== "hidden"
    );

    const index = elements.indexOf(e.target);
    const next = elements[index + 1];

    if (!next) return;

    // Focus next field
    next.focus();

    // If next is a SELECT → open dropdown
    if (next.tagName === "SELECT") {
      setTimeout(() => next.click(), 20);
    }
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log(JSON.stringify(item));
    if(API.insertItems(dispatch,item)!=null){
      success("Record has been inserted");
      API.searchItems(dispatch,payload).then(res => {
    setSavedItem(res.payload.data.items);
    })
  .catch(err => {
    console.log("Error:", err);
  });
    }else{
      fail("Record can't be inserted at this time");
    }
    // // localStorage.setItem("electronic_item", JSON.stringify(item));
    // setSavedItem(item);

    // setItem({
    //     category: "",
    //     categoryType: "",
    //     measureType:"",
    //     brand: "",
    //     modelName: "",
    //     ram: "",
    //     ramUnit: "GB",
    //     storage: "",
    //     storageUnit: "GB",
    //     quantity:"",
    //     initialPrice:"",
    //     sellingPrice:"",
    //     image: "",
    // });
    // setErrors({});
  };

  const selectedCategory = devices.categories.find(
    (c) => c.category === item.category
  );

   
 const showStorageType = ["Desktop Computer","Tablet", "Laptop","CPU"].includes(item.categoryType);
 const showSpecs = ["Smartphone","Desktop Computer", "Tablet", "Laptop","CPU"].includes(item.categoryType);
 const showStoreSpecs = ["Memory Card","Pendrive", "External Hard Disk","SSD", "RAM","Hard Disk (HDD)","NAS Storage"].includes(item.categoryType);
  return (
    <div className="page"> 
    {/* container-fluid min-vh-100 py-5"> */}
      {/* FORM */}
      <div className="card mb-3 shadow">
         {/* row justify-content-center"> */}
        <div className="card-header">
          {/* col-lg-11"> */}
          <div className="border-0 rounded-2">
            {/* card shadow-lg  */}
            <div className="card-body">
              <h3 className="text-center fw-bold text-primary mb-4">
                🏪 Electronic Item Entry
              </h3>
              <hr className="px-0"/>

              <form onSubmit={handleSubmit} noValidate>

                <div className="row g-3 mt-1">
                {/* CATEGORY */}
                <div className="col">
                  <label className="form-label fw-semibold required">Category</label>
                  <select
                    className={`form-select ${errors.category && "is-invalid"}`}
                    name="category"
                    value={item.category}
                    onChange={(e) =>{
                      setItem({
                        ...item,
                        category: e.target.value,
                        categoryType: "",
                      });  
                       handleChange(e);
                    }}
                    onKeyDown={handleEnterNextInput}
                  >
                    <option value="">-- Select Category --</option>
                    {devices.categories.map((c, i) => (
                      <option key={i}>{c.category}</option>
                    ))}
                  </select>
                  {/* <div className="invalid-feedback">{errors.category}</div> */}
                </div>

                {/* ITEM TYPE */}
                <div className="col">
                  <label className="form-label fw-semibold required">Item Type</label>
                  {item.category!=="Other"?(
                  <select
                    className={`form-select ${errors.categoryType && "is-invalid"}`}
                    name="categoryType"
                    value={item.categoryType}
                    disabled={!item.category}
                    onChange={handleChange}
                    onKeyDown={handleEnterNextInput}
                  >
                    <option value="">-- Select Item --</option>
                    {selectedCategory?.items.map((i, idx) => (
                      <option key={idx.name}>{i.name}</option>
                    ))}
                      </select>
                    ):(
                       <input
                            type="text"
                            className={`form-control ${errors.ram && "is-invalid"}`}
                            name="categoryType"
                            value={item.categoryType}
                            onChange={handleChange}
                            onKeyDown={handleEnterNextInput}
                            placeholder="Enter Item Type"
                            />
                    )}

                  {/* <div className="invalid-feedback">{errors.categoryType}</div> */}
                </div>
                 <div className="col">
                    <label className="form-label fw-semibold required">Measure Type</label>
                 
                      <select
                        className={`form-select ${errors.measureType && "is-invalid"}`}
                        name="measureType"
                        value={item.measureType}
                        onChange={(e) =>{handleChange(e);}}
                        onKeyDown={handleEnterNextInput}
                      >
                        <option key="0">Select</option>
                        <option key="1">PCS</option>
                        <option key="2">BOX</option>
                        <option key="3">BAG</option>
                        <option key="5">PETI</option>
                      </select>
                      {/* <div className="invalid-feedback">{errors.measureType}</div> */}
                    </div>
              </div>
                {/* BRAND & NAME */}
                <div className="row g-3 mt-1">
                  <div className="col">
                    <label className="form-label fw-semibold required">Brand</label>
                    <CreatableSelect
                        isClearable
                        styles={customStyles}
                        options={brandOptions}          // Options pass from parent
                        value={
                            item.brand
                              ? { value: item.brand, label: item.brand }
                              : null
                          }
                        onChange={(e) => handleVendorChange(e, "brand")}
                        placeholder="Select or type"
                    />
                    {/* <input
                      className={`form-control ${errors.brand && "is-invalid"}`}
                      name="brand"
                      value={item.brand}
                      onChange={(e) =>{handleChange(e);}}
                      placeholder="Samsung / Apple"
                      onKeyDown={handleEnterNextInput}
                    /> */}
                    {/* <div className="invalid-feedback">{errors.brand}</div> */}
                  </div>

                  <div className="col">
                    <label className="form-label fw-semibold required"> Name / Model
                    </label>
                    <div className="input-group">
                    <input
                      className={`form-control ${errors.modelName && "is-invalid"}`}
                      name="modelName"
                      value={item.modelName}
                      onChange={handleChange}
                      placeholder="POCO M6 Pro 5G"
                      onKeyDown={handleEnterNextInput}
                    />
                    <select
                        className="form-select"
                        style={{ maxWidth: "80px" }}
                        name="itemCondition"
                        value={item.itemCondition}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        >
                        <option selected value="new">New</option>
                        <option value="used">Used</option>
                         <option value="ref">Refur</option>
                    </select>
                    </div>

                    {/* <div className="invalid-feedback">{errors.modelName}</div> */}
                  </div>
                   <div className="col">
                    <label className="form-label fw-semibold required"> Item Source
                    </label>
                    <Select
                        styles={customStyles}
                        options={vendorOptions}
                        onChange={(e) => handleVendorChange(e, "itemSource")}
                        placeholder="Select / Search Vendor"
                      />

                    {/* <input
                      className={`form-control ${errors.itemSource && "is-invalid"}`}
                      name="itemSource"
                      value={item.itemSource}
                      onChange={handleChange}
                      placeholder="Item Source"
                      onKeyDown={handleEnterNextInput}
                    /> */}
                  </div>
                </div>

                {/* CONDITIONAL SPECS */}
                {showSpecs ?(
                  <div className="row g-3 mt-1">
                    <div className="col">
                      <label className="form-label fw-semibold">RAM</label>
                      <div className="input-group">
                        <input
                            type="number"
                            className={`form-control ${errors.ram && "is-invalid"}`}
                            name="ram"
                            value={item.ram}
                            onChange={handleChange}
                            onKeyDown={handleEnterNextInput}
                            placeholder="Enter RAM"
                            />

                        <select
                        className="form-select"
                        style={{ maxWidth: "80px" }}
                        name="ramUnit"
                        value={item.ramUnit}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        >
                        <option value="MB">MB</option>
                        <option selected value="GB">GB</option>
                        <option value="TB">TB</option>
                        </select>
                        <div className="invalid-feedback">{errors.ram}</div>
                        </div>
                    </div>

                    <div className="col">
                      <label className="form-label fw-semibold required">Storage</label>
                    <div className="input-group">
                        <input
                        type="number"
                        className={`form-control ${errors.storage && "is-invalid"}`}
                        name="storage"
                        value={item.storage}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        placeholder="Enter Storage"
                        />

                        <select
                          className="form-select"
                          style={{ maxWidth: "80px" }}
                          name="storageUnit"
                          value={item.storageUnit}
                          onChange={handleChange}
                          onKeyDown={handleEnterNextInput}
                          >
                          <option value="GB">GB</option>
                          <option value="TB">TB</option>
                        </select>
                       {showStorageType&&(
                        <select
                          className="form-select"
                          style={{ maxWidth: "80px" }}
                          name="storageUnit"
                          value={item.storageType}
                          onChange={handleChange}
                          onKeyDown={handleEnterNextInput}
                          >
                          <option value="SSD">SSD</option>
                          <option value="HDD">HDD</option>
                        </select>
                        )}

                        <div className="invalid-feedback">{errors.storage}</div>
                    </div>
                    </div>
                    <div className="col">
                       <label className="form-label fw-semibold required">Color</label>
                      <input
                        type="text"
                        placeholder="item color"
                        name="itemcolor"
                        value={item.itemcolor}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        className={`form-control ${errors.itemcolor && "is-invalid"}`}
                      />
                    </div>
                  </div>
                ):showStoreSpecs&&(
                   <div className="row g-3 mt-1">
                    <div className="col">
                      <label className="form-label fw-semibold required">Storage</label>
                    <div className="input-group">
                        <input
                        type="number"
                        className={`form-control ${errors.storage && "is-invalid"}`}
                        name="storage"
                        value={item.storage}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        placeholder="Enter Storage"
                        />

                        <select
                        className="form-select"
                        style={{ maxWidth: "80px" }}
                        name="storageUnit"
                        value={item.storageUnit}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        >
                        <option value="GB">GB</option>
                        <option value="TB">TB</option>
                        </select>

                        <div className="invalid-feedback">{errors.storage}</div>
                    </div>
                    </div>
                  </div>
                )}
                {showStorageType&&( <div className="row g-3 mt-1">
                    <div className="col">
                    <label className="form-label fw-semibold required">Processor</label>
                     <div>
                      <CreatableSelect
                        isClearable
                        styles={customStyles}
                        isDisabled={processorOptions==null?true:false}
                        options={processorOptions}          // Options pass from parent
                        value={
                            item.processor
                              ? { value: item.processor, label: item.processor }
                              : null
                        }
                        onChange={(e) => handleVendorChange(e, "processor")}
                        placeholder="Select or type"
                        className="my-select"
                        classNamePrefix="rs"                       
                    />  
                    </div>
                    </div>
                    <div className="col">
                      <label className="form-label fw-semibold required">Screen Size/Gen</label>
                       <div className="d-flex">
                        <input
                          type="text"
                          placeholder="15.6 inch"
                          className={`form-control ${errors.screenSize && "is-invalid"}`}
                          name="screenSize"
                          value={item.screenSize}
                          onKeyDown={handleEnterNextInput}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          placeholder="12th Gen"
                          className={`form-control ${errors.itemGen && "is-invalid"}`}
                          name="screenSize"
                          value={item.itemGen}
                          onKeyDown={handleEnterNextInput}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                    <label className="form-label fw-semibold required">Operating System</label>
                       <input
                        type="number"
                        placeholder="Window 11 Pro"
                        className={`form-control ${errors.sellingPrice && "is-invalid"}`}
                        name="operatingSystem"
                        value={item.operatingSystem}
                        onKeyDown={handleEnterNextInput}
                        onChange={handleChange}
                      />
                      {/* <div className="invalid-feedback">{errors.sellingPrice}</div> */}
                    </div>
                  </div>)}
                <div className="row g-3 mt-1">
                    <div className="col">
                    <label className="form-label fw-semibold required">Qty</label>
                      <input
                        type="number"
                        placeholder="quantity"
                        name="quantity"
                        value={item.quantity}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        className={`form-control ${errors.quantity && "is-invalid"}`}
                      />
                      {/* <div className="invalid-feedback">{errors.quantity}</div> */}
                    </div>
                    <div className="col">
                    <label className="form-label fw-semibold required">Unit Price</label>
                      <input
                        type="number"
                        placeholder="Unit Price"
                        className={`form-control ${errors.initialPrice && "is-invalid"}`}
                        name="initialPrice"
                        value={item.initialPrice}
                        onKeyDown={handleEnterNextInput}
                        onChange={handleChange}
                      />
                      {/* <div className="invalid-feedback">{errors.initialPrice}</div> */}
                    </div>
                    <div className="col">
                    <label className="form-label fw-semibold required">Selling Price</label>
                       <input
                        type="number"
                        placeholder="Selling Price"
                        className={`form-control ${errors.sellingPrice && "is-invalid"}`}
                        name="sellingPrice"
                        value={item.sellingPrice}
                        onKeyDown={handleEnterNextInput}
                        onChange={handleChange}
                      />
                      {/* <div className="invalid-feedback">{errors.sellingPrice}</div> */}
                    </div>
                  </div>
                    <div className="row g-3 mt-1">
                    <div className="col">
                    <label className="form-label fw-semibold required">Description</label>
                      <textarea
                        className={`form-control ${errors.description && "is-invalid"}`}
                        name="description"
                        value={item.description}
                        placeholder="Description"
                        rows={2}      // 👈 Textbox ki height badh jayegi
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                      />
                      {/* <div className="invalid-feedback">{errors.description}</div> */}
                    </div>
                  </div>

                {/* IMAGE */}
                <div className="mb-3 mt-2">
                  <label className="form-label fw-semibold">
                    Item Image <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    name="image"
                    // value={item.image}
                    onChange={handleImage}
                  />
                </div>
                {item.image && (
                  <div className="text-center mb-3">
                    <img
                      src={item.image}
                      alt="preview"
                      className="img-thumbnail shadow-sm"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}

                <div className="d-grid mt-4">
                  <button className="btn btn-primary btn-lg rounded-3">
                    💾 Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SAVED ITEM */}
       {savedItem && (
        <div className="pt-4">
          <div className="card mb-2 shadow">
            <div className="card-header">
                 <div className="border-0 rounded-2">
              <div className="card-body">
                <h4 className="fw-bold text-secondary mb-2">
                  📋 Saved Electronic Item
                </h4>

                <div className="table-responsive">
                  <table className="table table-hover text-center align-middle">
                    <thead className="table-primary">
                      <tr>
                        <th>Image</th>
                        <th>CategoryType</th>
                        <th>Brand</th>
                        <th>Model/Name</th>
                        <th>RAM</th>
                        <th>Storage</th>
                        <th>MeasureType</th>
                        <th>Quantity</th>
                        <th>InitialPrice</th>
                        <th>sellingPrice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedItem.map((savedItem, index) => (
                        <tr key={index}>
                          <td>
                            {savedItem.image ? (
                              <img
                                src={savedItem.image}
                                alt="item"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                }}
                              />
                            ) : (
                              <span className="text-muted">No Image</span>
                            )}
                          </td>

                          <td>{savedItem.categoryType}</td>
                          <td>{savedItem.brand}</td>
                          <td>{savedItem.modelName}</td>

                          <td>{savedItem.ram ? savedItem.ram + "" + savedItem.ramUnit : "-"}</td>
                          <td>{savedItem.storage ? savedItem.storage + "" + savedItem.storageUnit : "-"}</td>

                          <td>{savedItem.measureType}</td>
                          <td>{savedItem.quantity}</td>
                          <td>{savedItem.initialPrice}</td>
                          <td>{savedItem.sellingPrice}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                  <div>
                    <button 
                      disabled={page === 0} 
                      onClick={() => getPagination("n")}
                    >
                      Prev
                    </button>

                    <span style={{ margin: "0 20px" }}>Page: {page + 1}</span>

                    <button 
                      onClick={() => getPagination("p")}
                    >
                      Next
                    </button>
                  </div>
                </div>

              </div>
              </div>
            </div>
          </div>
       </div>
      )} 
    </div>
  );
};

export default ElectronicItem;
