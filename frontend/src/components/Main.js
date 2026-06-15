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
import ViewProfile from './ViewProfile';
import ResetPassword from './ResetPassword';
import RolePermissionManager from './RolePermissionManager';
import AddSubUser from './AddSubUser';
import OfficeBranch from './OfficeBranch';

export default function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // अब globally store हो गया
  }, [navigate]);

  return (
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboards/></ProtectedRoute>} />
        
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path="/viewProfile" element={<ViewProfile/>}/>
        <Route path="/resetPassword" element={<ResetPassword/>}/>

        <Route path="/rolesPermission" element={<RolePermissionManager/>}/>
        <Route path="/addSubUser" element={<AddSubUser/>}/>
        <Route path="/branchs" element={<OfficeBranch/>}/>
      </Routes>
  );
}
