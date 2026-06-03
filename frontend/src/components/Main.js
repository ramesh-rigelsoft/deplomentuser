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
        
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path="/viewProfile" element={<ViewProfile/>}/>
        <Route path="/resetPassword" element={<ResetPassword/>}/>

        <Route path="/rolesPermission" element={<RolePermissionManager/>}/>
        <Route path="/addSubUser" element={<AddSubUser/>}/>
       
        {/* <Route path="/warehouse/add-location" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/warehouse/list" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/vendor/list" element={<ProtectedRoute><AccountSettings/></ProtectedRoute>} />
        <Route path="/account/setting" element={<ProtectedRoute><AccountSettings/></ProtectedRoute>} /> */}
      </Routes>
    // </Router>
  );
}
