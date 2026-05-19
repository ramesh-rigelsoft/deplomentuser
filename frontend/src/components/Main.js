import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate  }
 from 'react-router-dom';
import { setNavigate } from './navigationService';
// import { useSelector } from 'react-redux';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Dashboard from './InventoryDashboard';
// import Home from './Home';
import ProtectedRoute from "../security/ProtectedRoute";
import AccountSettings from './AccountSetting';
import AddSupplierForm from "./AddSupplierForm";
import SupplierList from "./SupplierList";
import OutBound from "./OutBound";
import AccountSetting from './AccountSetting';
import InventoryDashboardAdvanced from './InventoryDashboardAdvanced';
import Dashboards from './Dashboards';
import InventoryDashboard from './InventoryDashboard';
import MobileInfoD from './MobileInfoD';
import SummaryReport from './SummaryReport';
import SummaryReportD from './SummeryReportD';
import ShopExpenseD from './ShopExpenseD';
import EmployeeManagementD from './empManagementD';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';
import ResetPassword from './ResetPassword';
// import {Redirect, BrowserRouter, Switch, Route } from 'react-router-dom'



export default function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // अब globally store हो गया
  }, [navigate]);


// basename="/eMedical"
  return (
    // <Router basename="/eMedical"> 
      <Routes basename="/eMedical">
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboards/></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryDashboard/></ProtectedRoute>}/>
        {/* <Route path="/inbound" element={<ProtectedRoute><Home/></ProtectedRoute>} /> */}
        <Route path="/outbound" element={<ProtectedRoute><OutBound/></ProtectedRoute>}/>
        {/* <Route path="/internalbound" element={<ProtectedRoute><InternalBound/></ProtectedRoute>}/> */}
      
        <Route path="/addVender" element={<ProtectedRoute><AddSupplierForm/></ProtectedRoute>} />
        <Route path="/listVender" element={<ProtectedRoute><SupplierList/></ProtectedRoute>} />
        <Route path="/addMobile" element={<ProtectedRoute><MobileInfoD/></ProtectedRoute>} />
        <Route path="/shopExpense" element={<ProtectedRoute><ShopExpenseD/></ProtectedRoute>}/>
        <Route path="/accountSetting" element={<ProtectedRoute><AccountSetting/></ProtectedRoute>}/>
        {/* <Route path="/empManagement" element={<ProtectedRoute><EmployeeManagementD/></ProtectedRoute>}/> */}
        <Route path="/summaryReport" element={<ProtectedRoute><SummaryReportD/></ProtectedRoute>}/>
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path="/viewProfile" element={<ViewProfile/>}/>
        <Route path="/resetPassword" element={<ResetPassword/>}/>

        {/* <Route path="/warehouse/add-location" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/warehouse/list" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/vendor/list" element={<ProtectedRoute><AccountSettings/></ProtectedRoute>} />
        <Route path="/account/setting" element={<ProtectedRoute><AccountSettings/></ProtectedRoute>} /> */}
      </Routes>
    // </Router>
  );
}
