import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import ConfirmModal from "./ConfirmModal";
// import { faCommentNodes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import API from "../redux/API";
import {success,fail,warning} from "../redux/WebTostar"
import Cookies from "js-cookie";

export default function PurchaseEntry() {
  const dispatch = useDispatch();
  const ownerId = Cookies.get("secretCode");
  const username = Cookies.get("username");
  const [showVendor, setShowVendor] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [vendors,setVendors] = useState([]);
  const [open, setOpen] = useState(false);


  const [showInput, setShowInput] = useState(false);
  const toggleInput = (showInput) => {
    setShowInput(showInput);
  };

  const [formData, setFormData] = useState({
    buyerName: null,
    mobileNumber: null,
    emailId: null,
    buyerAddress: null,
    supplierName: null,
    gstNumber: null,
    district: null,
    pinCode: null,
    companyAddress: null,
    noteComment: "",
    paymentModes:"Cash",
    ownerId:ownerId,
    items: [
      { itemCode: null, serialNumber: null, quantity: '', sellingPrice: 0,
          category: null,
          categoryType: null,
          measureType:null,
          brand: null,
          modelName: null,
          itemCondition: "new",
          itemSource: '',
          ram : null,
          storage : null,
          ramUnit : null,
          storageType : null,
          storageUnit : null,
          initialPrice:0,
          description : null,
          itemColor:null,
          image: null,
          processor: null,
          operatingSystem:null,
          screenSize:null,
          itemGen: null,
          gstRate: 0,
          soldPrice: '',
          ownerId:ownerId
     }
    ]
  });
  const [itemCode,setItemCode] = useState();
  const [reapireService,setReapireService] = useState(["Repair Installation"]);
  const [errors, setErrors] = useState({});
  const paymentModeMarked = (e) => {
    if(e.target.value==="Other"){
      toggleInput(true);
      setFormData(prev => ({
      ...prev,
      paymentModes: ""
     }));
    }else{
      toggleInput(false);
      // setPaymentModes(e.target.value);
      setFormData(prev => ({
        ...prev,
        paymentModes : e.target.value
      }))
    }
  };
  const validate = () => {
  const newErrors = {};
  
  formData.items.forEach((item, i) => {
    if (!item.itemCode || item.itemCode.trim() === '') {
      newErrors[`items-${i}-itemCode`] = "Item Code is required";
    }
    if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
      newErrors[`items-${i}-quantity`] = "Quantity must be greater than 0";
    }
    if (!item.soldPrice || isNaN(item.soldPrice) || Number(item.soldPrice) <= 0) {
      newErrors[`items-${i}-soldPrice`] = "Rate must be greater than 0";
    }
    // aap aur fields bhi yahan add kar sakte ho
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null
  });

  const [saveBill, setSaveBill] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null
  });

  const bodyRef = useRef(null);

  useEffect(() => {
      fetchSuppliers();
  if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [formData.items.length]);

    // 🔹 Fetch supplier list
  const fetchSuppliers = async (criteria = {status:"Active"}) => {
    try {
      const res = await API.searchSupplier(dispatch, criteria);
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
  // ================= SELECT STYLE =================

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

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    if(isDuplicateItemCode(value,index)){
      warning("This ItemCode already existing in the list");
      return;
    }
    const updated = [...formData.items];
    updated[index][name] = value;

    setFormData(prev => ({
      ...prev,
      items: updated
    }));

     // 2️⃣ Clear specific error on change
  const key = `items-${index}-${name}`;
  if (errors[key]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }
  return true;
  };

  const append = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { itemCode: "", serialNumber: "", description: "", quantity: "", soldPrice: "" }
      ]
    }));
  };

  const handleRemove = (i) => {
    if (formData.items.length > 1) {
      const updated = formData.items.filter((_, index) => index !== i);
      setFormData(prev => ({
        ...prev,
        items: updated
      }));
    }
  };

  // ================= VENDOR =================

  const vendorOptions = [
    { value: "", label: "Select Vendor" },
    ...vendors.map(v => ({ value: v.id, label: v.supplierName }))
  ];

  const handleVendorChange = (selected) => {
    if (!selected || selected.value === "") {
      setFormData(prev => ({
        ...prev,
        supplierName: "",
        gstNumber: "",
        district: "",
        pinCode: "",
        companyAddress: ""
      }));
      return;
    }

    const v = vendors.find(x => x.id === selected.value);
    if (v) {
      setFormData(prev => ({
        ...prev,
        supplierName: v.supplierName,
        gstNumber: v.gstNumber,
        district: v.district,
        pinCode: v.pinCode,
        companyAddress: v.address
      }));
    }
  };

  // ================= TOTAL =================

  const grandTotal = formData.items.reduce((sum, item) => {
    const q = Number(item.quantity || 0);
    const r = Number(item.soldPrice || 0);
    return sum + q * r;
  }, 0);

  const handleSubmit = (e) => {
      e.preventDefault();
      if (!validate()) {
        // Validation failed, return early
        return;
      }

      API.saveSales(dispatch,{userId:ownerId,sales:formData}).then(res => {
        // openPrintModal(res.payload.message);
        // alert();
        if(res.payload.code==="201"){
          success(res.payload.message);
          let buyer=res.payload.data.buyer.buyers[0];
          setInvoiceNumber(buyer.invoiceNumber);
          // 👉 open modal instead of direct submit
          setSaveBill({
            open: true,
            title: "Confirm Saved",
            message: "Do you want to print this bill?",
            onConfirm: null
          });
        }
      }).catch(err => {
        fail("Please contact to service provider.");
        console.log("Error:", err);
      });

      
  };

  const billPrint = () => {
   const billpayload={
        ownerId:ownerId,
        username:username,
        invoiceNumber:invoiceNumber
      };
      API.billPrint(dispatch,billpayload).then(res => {
        if(res.payload.code==="201"){
          setSaveBill({ open: false });
          success(res.payload.message);
        }
      }).catch(err => {
        fail("Please contact to service provider.");
        console.log("Error:", err);
      });
  };    

  const handleVendorToggle = (checked) => {
    setShowVendor(checked);
  };

  const quentitySearch = (i,e,itemCodeValue) => {
  let input=e.target.value;
  // console.log(e.target.value);
  API.inventryItemListAndSearch(dispatch, {userId:ownerId,itemCodes:[itemCodeValue],startIndex:0,maxRecords:10})
    .then(res => {
      let item = res?.payload?.data?.items?.[0];
      if(new Number(input)>item.quantity) {
        fail("Quantity exceeds available stock");
        return;
      }
     })
    .catch(err => {
      console.log("Error:", err);
    });
 };

 const isDuplicateItemCode = (value, index) => {
  return formData.items.some(
    (item, i) =>{
      console.log(value.trim(),item.itemCode)
      return (item.itemCode || "").trim() === value.trim();
    }
  );
};

const itemDetailsData = (i,e) => {
try {
 let input=e.target.value;
 if(input.length>10){
  let itemcode =e.target.value.trim().replace(/[^a-zA-Z0-9]/g, "");
  API.inventryItemListAndSearch(dispatch, {userId:ownerId,itemCodes:[itemcode] ,startIndex:0,maxRecords:10})
    .then(res => {
      setItemCode(input);
      let item = res?.payload?.data?.items?.[0];
      if (item.quantity===0) {
      try {
        setFormData(prev => {
        // clone the items array
        const updatedItems = [...prev.items];
        updatedItems[i] = { 
          itemCode: input,
          serialNumber: "", 
          quantity: '', 
          sellingPrice: '',
          category: null,
          categoryType: null,
          measureType:null,
          brand: null,
          modelName: null,
          itemCondition: "new",
          itemSource: '',
          ram : null,
          storage : null,
          ramUnit : null,
          storageType : null,
          storageUnit : null,
          initialPrice:0,
          description : null,
          itemColor:null,
          image: "",
          processor: null,
          operatingSystem:null,
          screenSize:null,
          itemGen: null,
          soldPrice:0.0,
          quantity:0,
          gstRate:0
        };
        fail("Quantity exceeds available stock");
        return {
          ...prev,
          items: updatedItems
        };
      });
    }catch(err){
        fail("Invalid Item code");    
    }
     return;
    }
    setFormData(prev => {
        // clone the items array
        const updatedItems = [...prev.items];
        // update index 1
        if (item&&input) { 
          updatedItems[i] = {
            category: item.category,
            itemCode: input,
            categoryType: item.categoryType,
            measureType: item.measureType,
            brand: item.brand,
            modelName: item.modelName,
            itemCondition: item.itemCondition,
            ram: item.ram,
            storage: item.storage,
            ramUnit: item.ramUnit,
            storageType: item.storageType,
            storageUnit: item.storageUnit,
            initialPrice: item.initialPrice,
            sellingPrice: item.sellingPrice,
            description: item.description,
            itemColor: item.itemColor,
            image: item.image,
            processor: item.processor,
            operatingSystem: item.operatingSystem,
            screenSize: item.screenSize,
            itemGen: item.itemGen,
            quantity:1,
            soldPrice:item.sellingPrice,
            gstRate:item.gstRate
          };
        }else{
          updatedItems[i] = { 
            itemCode: input,
            serialNumber: "", 
            quantity: '', 
            sellingPrice: '',
            category: null,
            categoryType: null,
            measureType:null,
            brand: null,
            modelName: null,
            itemCondition: "new",
            itemSource: '',
            ram : null,
            storage : null,
            ramUnit : null,
            storageType : null,
            storageUnit : null,
            initialPrice:0,
            description : null,
            itemColor:null,
            image: "",
            processor: null,
            operatingSystem:null,
            screenSize:null,
            itemGen: null,
            soldPrice:0.0,
            quantity:0,
            gstRate:0
          };
        } 
      

        // return updated formData object
        return {
          ...prev,
          items: updatedItems
        };
      
      });
    })
    .catch(err => {
      console.log("Error:", err);
    });
    }
    }catch(err) {
        fail("Invalid Item code");    
      };
    };

      const removeSpaces = (str) => {
        return (str || '').replace(/\s/g, '');
      };
    

  return (
    <div className="page scrollable-div" style={{padding:"0px 16px 16px 16px"}}>
      <form className="card" onSubmit={handleSubmit}>
        {/* <div className="card-header">
            <div className="dropdown-container">
              <select
                className="entry-dropdown"
                value={selected}
                name="entrydropdown"
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="Internal Entry">Internal Entry</option>
                <option value="Customer Entry">Customer Entry</option>
              </select>
            </div>
          </div> */}

        {/* <div className="card-header">
          <div className="sheet-title py-3 px-3">Purchase Entry</div>
        </div> */}
      <span onClick={() => setOpen(!open)} style={{
          background: open 
            ? "linear-gradient(135deg, #ef4444, #dc2626)" 
            : "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "#fff",
          border: "none",
          padding: "2px 2px",
          borderRadius: "2px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
        {open ? "Close" : "Open"}
      </span>
       {open&&(<div> 
        <div className="section">
          <div className="one-row gap-5">
            <label className="round-checkbox">
                <input 
                  type="checkbox"
                  className="checkmark"
                  checked={showVendor}
                  onChange={(e) => handleVendorToggle(e.target.checked)}
                />
                is Vendor?
            </label>
          </div>
        </div>
          {/* Vendor */}
        {showVendor&&( <div className="section">
            <div className="section-title">Buyer Information</div>
            <div className="grid">
            <Select
              styles={customStyles}
              options={vendorOptions}
              onChange={handleVendorChange}
              placeholder="Select / Search Vendor"
            />
            <input  autocomplete="off" className="input" type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} placeholder="Company Name" />
            <input  autocomplete="off" className="input" type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST No" />
            <input  autocomplete="off" className="input" type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Pin Code" />
            <input  autocomplete="off" className="input" type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" />
            <input  autocomplete="off" className="input" type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} placeholder="Address" />
          </div></div>)}
       
        {/* Buyer */}
         {!showVendor&&(<div className="section">
          <div className="section-title">Buyer Information</div>
          <div className="grid">
            <input  autocomplete="off" className="input" maxLength={25} type="text" name="buyerName" value={formData.buyerName} onChange={handleChange} placeholder="Buyer Name" />
            <input  autocomplete="off" className="input" maxLength={12} type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile" />
            <input  autocomplete="off" className="input" maxLength={25} type="text" name="emailId" value={formData.emailId} onChange={handleChange} placeholder="Email" />
            <input  autocomplete="off" className="input" maxLength={25} type="text" name="buyerAddress" value={formData.buyerAddress} onChange={handleChange} placeholder="Address" />
          </div>
        </div>)}
        <div className="section">
          <div>
            
           <div className="section-title">Payment Mode</div>
           <div className="one-row gap-5">
            <label className="round-checkbox gap-2">
              <input
                className="checkmark"
                type="radio"
                name="paymentMode"
                value="Cash"
                checked={formData.paymentModes==="Cash"}
                onChange={paymentModeMarked}
              />
              Cash
            </label>
            <label className="round-checkbox gap-2">
              <input
                className="checkmark"
                type="radio"
                name="paymentMode"
                value="Card"
                checked={formData.paymentModes==="Card"}
                onChange={paymentModeMarked}
              />
              Card
            </label>
            <label className="round-checkbox gap-2">
              <input
                className="checkmark"
                type="radio"
                name="paymentMode"
                value="UPI"
                checked={formData.paymentModes==="UPI"}
                onChange={paymentModeMarked}
              />
              UPI
            </label>
            <label className="round-checkbox gap-2">
              <input
                className="checkmark"
                type="radio"
                name="paymentMode"
                value="Net Banking"
                checked={formData.paymentModes==="Net Banking"}
                onChange={paymentModeMarked}
              />
              Net Banking
            </label>
            <label className="round-checkbox gap-2">
              <input
                className="checkmark"
                type="radio"
                name="paymentMode"
                value="EMI"
                checked={formData.paymentModes==="EMI"}
                onChange={paymentModeMarked}
              />
              EMI
            </label>
            <label className="round-checkbox gap-2">
              <input
                className="checkmark"
                type="radio"
                name="paymentMode"
                value="Other"
                onChange={paymentModeMarked}
              />
              Other
            </label>
            {showInput&&(<label className="gap-2">
              <input  autocomplete="off"
                type="text"
                value={formData.paymentModes}
                maxLength={25}
                placeholder="Enter Payment Mode"
                onChange={(e) =>setFormData(prev => ({
                                  ...prev,
                                  paymentModes: e.target.value
                                }))}
              />
            </label>
            )}
          </div>
        </div>

        </div>

       <div className="section">
          <div className="section-title">Comment</div>

          <div className="textarea-wrapper">
            <textarea
              className="textarea-professional"
              name="noteComment"
              value={formData.noteComment}
              onChange={handleChange}
              placeholder="Write additional notes here..."
              rows={3}
              maxLength={300}
            />
            <div className="char-count">
              {formData.noteComment.length}/300
            </div>
          </div>
        </div>
      </div>)}

        {/* Items */}
        <div className="section">
          <div className="section-title">Item Details</div>

          <div className="table-head">
            <table style={{ width: "100%", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: 120 }} />
                <col style={{ width: 150 }} />
                <col />
                <col style={{ width: 60 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 50 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Code</th>
                  <th>Serial / IMEI</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>✕</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="table-body" ref={bodyRef}>
            <table style={{ width: "100%", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: 120 }} />
                <col style={{ width: 150 }} />
                <col />
                <col style={{ width: 60 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 50 }} />
              </colgroup>
              <tbody>
  {formData.items.map((item, i) => {
    const amount = Number(item.quantity || 0) * Number(item.soldPrice || 0);
    return (
      <tr key={i}>
        <td className="center">{i + 1}</td>

        <td>
          <input
            autoComplete="off"
            className="cell-input center"
            type="text"
            name="itemCode"
            value={removeSpaces(item.itemCode)}
            onChange={(e) => { handleItemChange(i, e)&&(itemDetailsData(i, e)); }}
            style={{ borderColor: errors[`items-${i}-itemCode`] ? 'red' : undefined }}
          />
          {errors[`items-${i}-itemCode`] && <div style={{ color: 'red', fontSize: 12 }}>{errors[`items-${i}-itemCode`]}</div>}
        </td>

        <td>
          <input
            autoComplete="off"
            className="cell-input center"
            type="text"
            name="serialNumber"
            value={item.serialNumber}
            onChange={(e) => handleItemChange(i, e)}
          />
        </td>

        <td>
          <textarea
            className="textarea-desc"
            disabled={reapireService.includes(formData.items[i].category) ? false : true}
            name="description"
            placeholder="Enter Repair/Service Description"
            value={
              !reapireService.includes(formData.items[i].category)
                ? `${formData.items[i].brand || ''}, ${formData.items[i].modelName|| ''},
                  ${formData.items[i].ram|| ''}/
                  ${formData.items[i].storage|| ''}${formData.items[i].storageUnit|| ''},
                  ${formData.items[i].storageType|| ''},
                  ${formData.items[i].itemColor|| ''},
                  ${formData.items[i].processor|| ''},
                  ${formData.items[i].operatingSystem|| ''},
                  ${formData.items[i].screenSize|| ''},
                  ${formData.items[i].itemGen|| ''},
                  ${formData.items[i].description|| ''}`
                  .replace(/\n\s*/g, '')
                  .replace(/,,+/g, ',')
                  .replace(',/,', '')
                : formData.items[i].description
            }
            onChange={(e) => handleItemChange(i, e)}
          />
        </td>

        <td>
          <input
            autoComplete="off"
            className="cell-input center"
            type="text"
            name="quantity"
            value={item.quantity}
            onChange={(e) => { handleItemChange(i, e)&&(quentitySearch(i, e,item.itemCode));  }}
            style={{ borderColor: errors[`items-${i}-quantity`] ? 'red' : undefined }}
          />
          {errors[`items-${i}-quantity`] && <div style={{ color: 'red', fontSize: 12 }}>{errors[`items-${i}-quantity`]}</div>}
        </td>

        <td>
          <input
            autoComplete="off"
            className="cell-input center"
            type="text"
            name="soldPrice"
            value={item.soldPrice}
            onChange={(e) => handleItemChange(i, e)}
            style={{ borderColor: errors[`items-${i}-soldPrice`] ? 'red' : undefined }}
          />
          {errors[`items-${i}-soldPrice`] && <div style={{ color: 'red', fontSize: 12 }}>{errors[`items-${i}-soldPrice`]}</div>}
        </td>

        <td className="right">
          {amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>

        <td className="center">
          <button
            type="button"
            className="delete-btn"
            onClick={() =>{
              setModal({
                open: true,
                title: "Delete Item",
                message: "This item will be permanently removed. Continue?",
                onConfirm: () => {
                  handleRemove(i);
                  setModal({ open: false });
                }
              })
            }
            }
          >×</button>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          </div>

          <p className="px-2">
            <b className="left">Grand Total :</b>{" "}
            {grandTotal.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>

          <button type="button" className="pro-btn" onClick={append}>
            + Add Item
          </button>
        </div>

        <div className="footer">
          <button className="pro-btn-success">Save Bill</button>
        </div>
      </form>

      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmText="Yes, Delete"
        cancelText="No"
        type="danger"
        onCancel={() => setModal({ open: false })}
        onConfirm={modal.onConfirm}
      />

       <ConfirmModal
        open={saveBill.open}
        title={saveBill.title}
        message={saveBill.message}
        confirmText="Yes, Print"
        cancelText="No"
        type="danger"
        onCancel={() => setSaveBill({ open: false })}
        onConfirm={()=>{billPrint(true);
        }}
      />
    </div>
  );
}
// saveBill.onConfirm