import React, { useState, useEffect,useRef } from "react";
import devices from "./data/device.json";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail} from "../redux/WebTostar";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import itembrand from "./data/itembrand.json";
import brandProcessor from "./data/brandProcessor.json";
import Cookies from "js-cookie";


const ElectronicItem = () => {
  // const [vendors] = useState(vendorsInitial);
    
  const dispatch = useDispatch();

    /* -------------------- NEW STATES -------------------- */
  const [isExisting, setIsExisting] = useState(false);
  // const [existingItemCode, setExistingItemCode] = useState("");
  const [searchItemCode,setSearchItemCode] = useState("");
  const [productImage,setProductImage] = useState(null);
  const [previewImage,setPreviewImage] = useState(null);
  const ownerId = Cookies.get("secretCode");

  const allowedGB = /^(128|256|512)MB$|^(2|4|8|16|32|64|128|256|512)GB$|^([1-9][0-9]?|100)TB$/;
  const [item, setItem] = useState({
    category: null,
    categoryType: null,
    measureType: 'PCS',
    brand: null,
    modelName: null,
    itemCondition: "new",
    itemSource: '',
    ram : null,
    storage : null,
    ramUnit : null,
    storageType : null,
    storageUnit : null,
    quantity: '',
    initialPrice:null,
    sellingPrice:null,
    description : null,
    itemColor:null,
    image: null,
    processor: null,
    operatingSystem:null,
    screenSize:null,
    itemGen: null,
    gstRate:0,
    ownerId:ownerId
  });
  
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);
  const [errors, setErrors] = useState({});
  const [processorOptions, setProcessorOptions] = useState(null);
  const [savedItem, setSavedItem] = useState(null);
  const showStorageType = ["Desktop Computer","Tablet", "Laptop","CPU"].includes(item.categoryType);
  const showSpecs = ["Smartphone","Desktop Computer", "Tablet", "Laptop","CPU"].includes(item.categoryType);
  const showStoreSpecs = ["Memory Card","Pendrive", "External Hard Disk","SSD", "RAM","Hard Disk (HDD)","NAS Storage"].includes(item.categoryType);
  const [vendors,setVendors] = useState([]);
  const showScreenSize = ["LED TV","Smart TV"].includes(item.categoryType);
  const repaireInstalation = ["Mobile/Laptop Repair Service","Recharge / SIM Services","Money Transfer","Photography / Studio Service","General Service Charge","Other Services"].includes(item.categoryType);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // item.categoryType check karke brand options set karna
  const brandOptions = itembrand?.brands?.[item?.categoryType] ?? [];
 
  const alreadyExistingItem = (itemCode)=>{
      setSearchItemCode(itemCode);
      API.inventryItemListAndSearch(dispatch,{itemCodes:[itemCode],isdownload:false,stratIndex:0,maxRecords:10,userId:ownerId}).then(res => {
      cleanItems();
      let items = res.payload?.data?.items[0];   
      setItem({
          category: items.category,
          categoryType: items.categoryType,
          measureType:items.measureType,
          brand: items.brand,
          modelName: items.modelName,
          itemCondition: items.itemCondition,
          ram : items.ram,
          storage : items.storage,
          ramUnit : items.ramUnit,
          storageType : items.storageType,
          storageUnit : items.storageUnit,
          initialPrice: items.initialPrice,
          sellingPrice: items.sellingPrice,
          description : items.description,
          itemColor: items.itemColor,
          image: items.image,
          processor: items.processor,
          operatingSystem: items.operatingSystem,
          screenSize: items.screenSize,
          itemGen: items.itemGen,
          gstRate: items.gstRate,
          ownerId: items.ownerId
        });    
   })
   .catch(err => {
       console.log("Error:", err);
  });
  
  }

  useEffect(() => {
      fetchSuppliers();

    }, []);

  // 🔹 Fetch supplier list
  const fetchSuppliers = async (criteria = {status:"Active"}) => {
    try {
      const res = await API.searchSupplier(dispatch, {ownerId:ownerId});
      const payload = res?.payload;
      if (payload?.data?.supplier) {
        console.log(payload.data.supplier);
        setVendors(payload.data.supplier);
        
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error(err);
      fail("Failed to fetch suppliers");
    }
  };

   
   const vendorOptions = [
    // { value: "", label: "Select Vendor" },
    ...vendors.map(v => ({ value: v.id, label: v.supplierName }))
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
              itemSource:  v.supplierName
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
   if(e.target.type==="textarea"||e.target.tagName === "TEXTAREA"){
      let values=e.target.value;
      values = values.replace(/\n/g, " ");
      values = values.replace(/\s+/g, " ");
      values = values.trimStart();
      const words = values.trim() === "" ? [] : values.trim().split(" ");
      
      // Words Split & Clean
      // const words = value.trim().split(/\s+/);
      
      // Allow typing only if words ≤ 10
      // if (words.length <= 10) {
        setItem({
          ...item,
          description: values
        });
      // }
    }else if(e.target.name==="categoryType"){
      if((showStorageType||showSpecs)&&!(["Smartphone"].includes(item.categoryType))){
        setItem({
            ...item,
            ramUnit : "GB",
        storageType : "HDD",
        storageUnit : "GB"
          }); 
      }else if(showStoreSpecs){
        setItem({
              ...item,
          storageType : "HDD",
          storageUnit : "GB"
            }); 
      }else{
        setItem({
              ...item,
              ramUnit : "GB",
          storageUnit : "GB"
            }); 
      }
    const { name, value } = e.target;
     let gst = getGstRate(item.category, value) || 0;
      setItem((prev) => ({
        ...prev,
        [name]: value,
        gstRate:JSON.stringify(gst)
      }));

      // ✅ Error remove when user types correct value
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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

    if (!file.type.startsWith("image/")) return alert("Only images allowed!");
    if (file.size > 5 * 1024 * 1024) return alert("Max 5MB");
    setItem(prev => ({
      ...prev,
      image: file
    }));
    // setProductImage(file);  // Always save file first

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result); // Preview
    reader.readAsDataURL(file);
};

  // 🔐 Validation
  const validate = () => {
    let temp = {};
    if (!item.category) temp.category = "Category required";
    if (!item.categoryType) temp.categoryType = "Item type required";
    if (!item.measureType) temp.measureType = "measureType is required";
    if(!repaireInstalation){
      if (!item.brand) temp.brand = "Brand required";
      if (!item.modelName) temp.modelName = "Item model/Name required";
      if (!item.quantity) temp.quantity = "Quantity is required";
      if (!item.sellingPrice) temp.sellingPrice = "SellingPrice is required";
      if (!item.initialPrice) temp.initialPrice = "Rate is required";
      // if (!item.itemSource) temp.itemSource = "";
    }
    if(!repaireInstalation&&showSpecs) {
      if (!item.itemColor) temp.itemColor = "itemColor is required";
      if (!item.ram) temp.ram = "ram is required";
      if (!item.storage) temp.storage = "storage is required";
    }
    if(!repaireInstalation&&showStoreSpecs){
      if (!item.storage) temp.storage = "storage is required";
    }
    if(!repaireInstalation&&showStorageType){
      if (!item.processor) temp.processor = "processor is required";
      if (!item.operatingSystem) temp.operatingSystem = "operatingSystem is required";
      if (!item.screenSize) temp.screenSize = "screenSize is required";
      if (!item.itemGen) temp.itemGen = "itemGen is required";
    }
     
      
    // const ramInGB =Number(item.ram)+""+item.ramUnit;
    // const storageInGB =Number(item.storage)+""+ item.storageUnit;
     
    // if (showSpecs && item.ram && !allowedGB.test(ramInGB)) {
    //     temp.ram =
    //     "RAM must be 2,4,8,16,32,64,128,256,512 GB";
    // }

    // if ((showSpecs || showStoreSpecs) && item.storage && !allowedGB.test(storageInGB)) {
    //     temp.storage =
    //     "Storage must be 2,4,8,16,32,64,128,256,512 GB or 1TB–100TB";
    // }
    console.log(temp);
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };



  // const getPagination=(e)=>{
  //   if(e=="n"){
  //     setPage(page-2);
  //   }else{
  //     setPage(page+2);
  //   }
  //   API.searchItems(dispatch,payload).then(res => {
  //   setSavedItem(res.payload.data.items);
  //   })
  // }

  /* ---------- Custom Styles (height 30px) ---------- */
const customStyles = {
  control: (provided,state) => ({
    ...provided,
    minHeight: 30,
    height: 30,
    borderRadius: 3,
    borderColor: state.selectProps.error
      ? "red"
      : state.isFocused
      ? "green"
      : "#d9d9d9",
    boxShadow: "none",        // 🔥 remove bootstrap glow
    outline: "none",
    "&:hover": {
      borderColor: state.selectProps.error
        ? "red"
        : state.isFocused
        ? "green"
        : "#d9d9d9"
    }
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
    
    // console.log(JSON.stringify(item));
    // const formData = new Blob([JSON.stringify({
    //   requestInfo: { user:{id: secret} },
    //   items: item,
    //   image:productImage
    // })], { type: "multipart/form-data" });

    // const formData = new FormData();
    // formData.append("userId", secret);
    // formData.append("image", productImage);
    // formData.append("items", item);
      // const formData = {
      //     "userId": secret,
      //     "image":productImage,
      //     "items":item         
      // };
//       for (let [key, value] of formData.entries()) {
//   console.log(key, value);
// }
      console.log(item);
      setIsSubmitted(true);
      API.insertItems(dispatch, item)
        .then((res) => {
         setItem(prev => ({
            ...prev,
            quantity: '',
            initialPrice: '',
            sellingPrice: '',
          }));
        success("Record has been inserted");
        setIsSubmitted(false);
      })
      .catch((err) => {
        fail("Record can't be inserted at this time");
        setIsSubmitted(false);
        console.log(err);
      });
  };

  const cleanItems=()=>{

    setItem({
         category: null,
    categoryType: null,
    measureType: 'PCS',
    brand: null,
    modelName: null,
    itemCondition: "new",
    itemSource: '',
    ram : null,
    storage : null,
    ramUnit : null,
    storageType : null,
    storageUnit : null,
    quantity: '',
    initialPrice:null,
    sellingPrice:null,
    description : null,
    itemColor:null,
    image: null,
    processor: null,
    operatingSystem:null,
    screenSize:null,
    itemGen: null,
    gstRate:0,
    ownerId:ownerId
    });

  };

  const selectedCategory = devices.categories.find(
    (c) => c.category === item.category
  );

  const getGstRate = (categoryName, itemName) => {
    const category = devices?.categories?.find(
      (c) => c.category === categoryName
    );
    const foundItem = category?.items?.find(
      (i) => i.name === itemName
    );
    return foundItem?.gst || { cgst: 0, sgst: 0, igst: 0 };
};

   
 
 return (
    <div className="page scrollable-div"> 
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

            <div className="row mt-2">
              <div className="col">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="existingCheck"
                    checked={isExisting}
                    onChange={(e) => setIsExisting(e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold" htmlFor="existingCheck">
                    Already Existing Item?
                  </label>
                </div>
              </div>
            </div>
            {isExisting && (
              <div className="row g-3 mt-1">
                <div className="col">
                  <label className="form-label fw-semibold required">
                    Enter Item Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="searchByItemCode"
                    placeholder="Enter Existing Item Code"
                    value={searchItemCode}
                    onChange={(e) => {
                      alreadyExistingItem(e.target.value);
                    }}
                    pattern="^ITM\d{9}$"
                    title="Code must start with ITM followed by 9 digits"
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

                <div className="row g-3 mt-1">
                {/* CATEGORY */}
                <div className="col">
                  <label className="form-label fw-semibold required">Category</label>
                  <select
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
                      <option value={c.category}>{c.category}</option>
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
                      <option value={i.name}>{i.name}</option>
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
                        name="measureType"
                        value={item.measureType}
                        onChange={(e) =>{handleChange(e)}}
                        onKeyDown={handleEnterNextInput}
                      >
                        <option value='' >Select</option>
                        <option value='PCS'>PCS</option>
                        <option value='BOX'>BOX</option>
                        <option value='BAG'>BAG</option>
                        <option value='PETI'>PETI</option>
                      </select>
                      {/* <div className="invalid-feedback">{errors.measureType}</div> */}
                    </div>
              </div>
                {/* BRAND & NAME */}

                {!repaireInstalation&&(
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
                        error={isSubmitted && !item.brand}
                        onChange={(e) => handleVendorChange(e, "brand")}
                        placeholder="Select or type"
                    />
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
                      placeholder="Enter name/model"
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

                   </div>
                   <div className="col">
                    <label className="form-label fw-semibold"> Item Source
                     <span className="text-muted">(Optional)</span></label>
                    <Select
                        styles={customStyles}
                        options={vendorOptions}
                        value={vendorOptions.find(v => v.value === item.itemSource)}
                        onChange={(e) => handleVendorChange(e, "itemSource")}
                        placeholder="Select / Search Vendor"
                        // error={isSubmitted && !item.itemSource}
                      />
                    </div>
                </div>
                )}

               {!repaireInstalation&&showSpecs?(
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
                            placeholder="Enter RAM (eg. 8)"
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
                        placeholder="Enter Storage  (eg. 128)"
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
                       {!repaireInstalation&&showStorageType&&(
                        <select
                          className="form-select"
                          style={{ maxWidth: "80px" }}
                          name="storageUnit"
                          value={item.storageType}
                          onChange={handleChange}
                          onKeyDown={handleEnterNextInput}
                          >
                          <option value="HDD">HDD</option>
                          <option value="SSD">SSD</option>
                        </select>
                        )}
                    </div>
                    </div>
                    <div className="col">
                       <label className="form-label fw-semibold required">Color</label>
                      <input
                        className={`form-control ${errors.itemColor && "is-invalid"}`}
                        type="text"
                        placeholder="Enter item color"
                        name="itemColor"
                        value={item.itemColor}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                      />
                    </div>
                  </div>
                ):!repaireInstalation&&showStoreSpecs&&(
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
                        placeholder="Enter Storage  (eg. 8)"
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
                    </div>
                    </div>
                  </div>
                )}
                
                {!repaireInstalation&&showStorageType&&(<div className="row g-3 mt-1">
                    <div className="col">
                    <label className="form-label fw-semibold required">Processor</label>
                     <div>
                      <CreatableSelect
                        isClearable
                        styles={customStyles}
                        // isDisabled={processorOptions==null?true:false}
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
                       error={isSubmitted && !item.processor}
                    />  
                    </div>
                    </div>
                    <div className="col">
                      <label className="form-label fw-semibold required">Screen Size/Gen</label>
                       <div className="d-flex">
                        <input
                          type="text"
                          placeholder=" eg. 15.6 inch"
                          className={`form-control ${errors.screenSize && "is-invalid"}`}
                          name="screenSize"
                          value={item.screenSize}
                          onKeyDown={handleEnterNextInput}
                          onChange={handleChange}
                        />
                       
                        <input
                          type="text"
                          placeholder="eg. 12th Gen"
                          className={`form-control ${errors.itemGen && "is-invalid"}`}
                          name="itemGen"
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
                        placeholder="eg. Window 11 Pro"
                        className={`form-control ${errors.operatingSystem && "is-invalid"}`}
                        name="operatingSystem"
                        value={item.operatingSystem}
                        onKeyDown={handleEnterNextInput}
                        onChange={handleChange}
                      />
                    </div>
                  </div>)}
                    {!repaireInstalation&&showScreenSize&&(
                      <div className="row g-3 mt-1">
                       <div className="col">
                          <label className="form-label fw-semibold required">Screen Size</label>
                       <div className="d-flex">
                        <input
                          type="text"
                          placeholder=" eg. 15.6 inch"
                          className={`form-control ${errors.screenSize && "is-invalid"}`}
                          name="screenSize"
                          value={item.screenSize}
                          onKeyDown={handleEnterNextInput}
                          onChange={handleChange}
                        />
                        </div>
                       </div>
                       </div>)}
{!repaireInstalation&&(
                <div className="row g-3 mt-1">
                    <div className="col">
                    <label className="form-label fw-semibold required">Qty</label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        name="quantity"
                        value={item.quantity}
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                        className={`form-control ${!repaireInstalation&&(errors.quantity && "is-invalid")}`}
                      />
                    </div>
                    <div className="col">
                    <label className="form-label fw-semibold required">Price</label>
                      <input
                        type="number"
                        placeholder="Enter Price"
                        className={`form-control ${!repaireInstalation&&(errors.initialPrice && "is-invalid")}`}
                        name="initialPrice"
                        value={item.initialPrice}
                        onKeyDown={handleEnterNextInput}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                    <label className="form-label fw-semibold required">Selling Price</label>
                       <input
                        type="number"
                        placeholder="Enter Selling Price"
                        className={`form-control ${!repaireInstalation&&(errors.sellingPrice && "is-invalid")}`}
                        name="sellingPrice"
                        value={item.sellingPrice}
                        onKeyDown={handleEnterNextInput}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  )}
                    <div className="row g-3 mt-1">
                    <div className="col">
                    <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={item.description}
                        placeholder="Enter Description"
                        rows={2}      // 👈 Textbox ki height badh jayegi
                        onChange={handleChange}
                        onKeyDown={handleEnterNextInput}
                      />
                    </div>
                  </div>

               {!repaireInstalation&&(
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
               )}
                {previewImage && (
                  <div className="text-center mb-3">
                    <img
                      src={previewImage}
                      alt="preview"
                      className="img-thumbnail shadow-sm"
                      style={{ maxHeight: "100px" }}
                    />
                  </div>
                )}

                <div className="d-grid mt-4">
                  <button className="pro-btn btn-lg rounded-3"
                   disabled={isSubmitted}>
        {isSubmitted ? "Submiting..." : "Submit"}
                    {/* 💾 Save Item */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SAVED ITEM */}
       {/* {savedItem && (
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
      )}  */}
    </div>
  );
};

export default ElectronicItem;
