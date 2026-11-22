import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate  }
 from 'react-router-dom';
import { setNavigate } from './navigationService';
// import { useSelector } from 'react-redux';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
// import Home from './Home';
import ProtectedRoute from "../security/ProtectedRoute";
import Dashboards from './Dashboards';
import EditProfile from './EditProfile';
import ResetPassword from './ResetPassword';
import RolePermissionManager from './RolePermissionManager';
import AddSubUser from './AddSubUser';
import OfficeBranch from './OfficeBranch';
import ItemsInventory from '../pages/ItemsInventory';
import BranchExpense from '../pages/BranchExpense';
import BranchSalesDashboar from '../pages/BranchSalesDashboard';
import SalesReport from '../pages/SalesReport';
import EntryReport from '../pages/EntryReport';
import GarbageItem from '../pages/GarbageItem';
import BranchDashboard from '../pages/BranchDashboard';
import LowStockAlert from '../pages/LowStockAlert';
import BranchCategoryManager from '../pages/BranchCategoryManager';
import AppLayout from '../layout/AppLayout';
import SubscriptionPlanList from './SubscriptionList';
import Home from './Home';

// Super Admin Module
import SuperAdminLogin from '../superadmin/SuperAdminLogin';
import SuperAdminProtectedRoute from '../superadmin/SuperAdminProtectedRoute';
import SuperAdminDashboard from '../superadmin/SuperAdminDashboard';
import SubscriptionPlans from '../superadmin/SubscriptionPlans';
import SubscriptionSalesReport from '../superadmin/SubscriptionSalesReport';
import OwnersManagement from '../superadmin/OwnersManagement';
import SuperAdminSubscriptions from '../superadmin/SuperAdminSubscriptions';
import SuperAdminPayments from '../superadmin/SuperAdminPayments';
import SuperAdminLanguages from '../superadmin/SuperAdminLanguages';

export default function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // अब globally store हो गया
  }, [navigate]);

  return (
      <Routes>
         {/* <Route element={<AppLayout />}> */}
        {/* <Route exact path="/" element={<Navigate to="" />} /> */}
        
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboards/></ProtectedRoute>} />
        
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path="/profile" element={<EditProfile/>}/>
        <Route path="/resetPassword" element={<ResetPassword/>}/>

        <Route path="/rolesPermission" element={<RolePermissionManager/>}/>
        <Route path="/addSubUser" element={<AddSubUser/>}/>
        <Route path="/officeLocation" element={<OfficeBranch/>}/>
        <Route path="/branchs" element={<BranchDashboard/>}/>
        <Route path="/subscriptionPlanList" element={<SubscriptionPlanList/>}/>
        <Route path="/lowStockAlert" element={<ProtectedRoute><LowStockAlert/></ProtectedRoute>}/>
        <Route path="/branchCategory" element={<ProtectedRoute><BranchCategoryManager/></ProtectedRoute>}/>
       
        {/* branch route */}
        <Route path="/branchDashboard" element={<BranchSalesDashboar />}/>
        <Route path="/branchInventory" element={<ItemsInventory/>}/>
        <Route path="/branchSalesReport" element={<SalesReport/>}/>
        <Route path="/branchEntryReport" element={<EntryReport/>}/>
        {/* <Route path="/branchEntryReport" element={<OfficeBranch/>}/> */}
        <Route path="/branchExpense" element={<BranchExpense />}/>
        <Route path="/branchGarbage" element={<GarbageItem />}/>

        {/* ================================================= */}
        {/* SUPER ADMIN MODULE ROUTES (SEPARATE & SECURE)    */}
        {/* ================================================= */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminProtectedRoute><SuperAdminDashboard /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/subscription-plans" element={<SuperAdminProtectedRoute><SubscriptionPlans /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/reports" element={<SuperAdminProtectedRoute><SubscriptionSalesReport /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/owners" element={<SuperAdminProtectedRoute><OwnersManagement /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/languages" element={<SuperAdminProtectedRoute><SuperAdminLanguages /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/subscriptions" element={<SuperAdminProtectedRoute><SuperAdminSubscriptions /></SuperAdminProtectedRoute>} />
        <Route path="/superadmin/payments" element={<SuperAdminProtectedRoute><SuperAdminPayments /></SuperAdminProtectedRoute>} />
        {/* </Route> */}
      </Routes>
  );
}
