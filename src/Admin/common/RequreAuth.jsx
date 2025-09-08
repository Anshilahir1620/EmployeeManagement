import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./Auth";

const RequireAuth = ({ role, children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  console.log("RequireAuth - isAuthenticated:", isAuthenticated());
  console.log("RequireAuth - userRole:", userRole);
  console.log("RequireAuth - requiredRole:", role);

  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && userRole?.toLowerCase() !== role.toLowerCase()) {
    console.log("Role mismatch, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Return children directly instead of Outlet since we're wrapping components
  return children;
};

export default RequireAuth;