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
import AppLayout from '../layout/AppLayout';
import SubscriptionPlanList from './SubscriptionList';
import Home from './Home';

// Super Admin Module
import SuperAdminProtectedRoute from '../superadmin/security/SuperAdminProtectedRoute';
import SuperAdminLogin from '../superadmin/pages/SuperAdminLogin';
import SuperAdminDashboard from '../superadmin/pages/SuperAdminDashboard';
import SuperAdminPlans from '../superadmin/pages/SuperAdminPlans';
import SuperAdminAdmins from '../superadmin/pages/SuperAdminAdmins';
import SuperAdminAdminDetail from '../superadmin/pages/SuperAdminAdminDetail';
import SuperAdminUsers from '../superadmin/pages/SuperAdminUsers';
import SuperAdminSubscriptions from '../superadmin/pages/SuperAdminSubscriptions';
import SuperAdminReports from '../superadmin/pages/SuperAdminReports';
import SuperAdminAuditLogs from '../superadmin/pages/SuperAdminAuditLogs';

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
        <Route path="/resetPassword" element={<ResetPassword/>}/>

        <Route path="/rolesPermission" element={<RolePermissionManager/>}/>
        <Route path="/addSubUser" element={<AddSubUser/>}/>
        <Route path="/officeLocation" element={<OfficeBranch/>}/>
        <Route path="/branchs" element={<BranchDashboard/>}/>
        <Route path="/subscriptionPlanList" element={<SubscriptionPlanList/>}/>
       
        {/* branch route */}
        <Route path="/branchDashboard" element={<BranchSalesDashboar />}/>
        <Route path="/branchInventory" element={<ItemsInventory/>}/>
        <Route path="/branchSalesReport" element={<SalesReport/>}/>
        <Route path="/branchEntryReport" element={<EntryReport/>}/>
        {/* <Route path="/branchEntryReport" element={<OfficeBranch/>}/> */}
        <Route path="/branchExpense" element={<BranchExpense />}/>
        <Route path="/branchGarbage" element={<GarbageItem />}/>
        {/* </Route> */}

        {/* Super Admin Routes */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route
          path="/super-admin/dashboard"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboard />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/subscription-plans"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminPlans />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/admins"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminAdmins />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/admins/:id"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminAdminDetail />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/users"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminUsers />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/subscriptions"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminSubscriptions />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/reports"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminReports />
            </SuperAdminProtectedRoute>
          }
        />
        <Route
          path="/super-admin/audit-logs"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminAuditLogs />
            </SuperAdminProtectedRoute>
          }
        />
      </Routes>
  );
}
