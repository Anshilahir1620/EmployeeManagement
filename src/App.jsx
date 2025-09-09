import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Users/login/Login";
import AdminLayout from "./Users/Admin/AdminLayout";
import UserMainLayout from "./Users/Employee/UserMainLayout";
import RequireAuth from "./Users/Admin/common/RequreAuth";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }
      />
      
      {/* Employee routes - using /employee as main path */}
      <Route
        path="/employee/*"
        element={
          <RequireAuth role="employee">
            <UserMainLayout />
          </RequireAuth>
        }
      />
      
      {/* Backward compatibility for /dashboard-2 */}
      <Route
        path="/dashboard-2/*"
        element={<Navigate to="/employee" replace />}
      />
      
      {/* Other routes */}
      <Route path="/unauthorized" element={<h1>🚫 Unauthorized Access</h1>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;