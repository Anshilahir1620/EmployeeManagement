import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Admin/Pages/Dashboard.jsx";
import EmployeeDetailContent from "./Admin/Pages/Employee/Employee.jsx";
import CreateEmployee from "./Admin/Pages/Employee/CreateEmployee.jsx";
import UpdateEmployee from "./Admin/Pages/Employee/UpdatedEmployee";
import DepartmentDetail from "./Admin/Pages/Department/Department";
import CreateDepartment from "./Admin/Pages/Department/CreateDepartment";
import UpdateDepartment from "./Admin/Pages/Department/UpdateDepartment";
import LeaveDetailContent from "./Admin/Pages/Leaves/LeavesDetails.jsx";
import CreateLeave from "./Admin/Pages/Leaves/CreateLeave";
import UpdateLeave from "./Admin/Pages/Leaves/UpdateLeave";
import HolidayDetail from "./Admin/Pages/Holidays/Holiday";
import CreateHoliday from "./Admin/Pages/Holidays/CreateHoliday";
import UpdateHoliday from "./Admin/Pages/Holidays/UpdateHoliday";
import AttendanceLogList from "./Admin/Pages/AttendanceLog/AttendanceLog";
import CreateAttendanceLog from "./Admin/Pages/AttendanceLog/CreateAttendanceLog";
import UpdateAttendanceLog from "./Admin/Pages/AttendanceLog/UpdateAttendanceLog";
import CategoryList from "./Admin/Pages/Category/Category";
import CreateCategory from "./Admin/Pages/Category/CreateCategory";
import UpdateCategory from "./Admin/Pages/Category/UpdateCategory";
import ProfileEditForm from "./Admin/Layout/ChangeProfile.jsx";
import Login from "./login/Login.jsx";
import RequireAuth from "./Admin/common/RequreAuth.jsx";
import MainLayout from "./Admin/Layout/MainLayout.jsx"; // You need this component
import { isAuthenticated } from "./Admin/common/Auth";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      {/* Default redirect based on role */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            user?.role?.toLowerCase() === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/employee" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login page - outside of layout */}
      <Route path="/login" element={<Login />} />

      {/* Admin routes with MainLayout wrapper */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth role="admin">
            <MainLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                
                {/* Employee routes */}
                <Route path="employees" element={<EmployeeDetailContent />} />
                <Route path="employees/create" element={<CreateEmployee />} />
                <Route path="employees/:id" element={<UpdateEmployee />} />

                {/* Department routes */}
                <Route path="departments" element={<DepartmentDetail />} />
                <Route path="departments/create" element={<CreateDepartment />} />
                <Route path="departments/:id" element={<UpdateDepartment />} />

                {/* Leave routes */}
                <Route path="leaves" element={<LeaveDetailContent />} />
                <Route path="leaves/create" element={<CreateLeave />} />
                <Route path="leaves/:id" element={<UpdateLeave />} />

                {/* Holiday routes */}
                <Route path="holidays" element={<HolidayDetail />} />
                <Route path="holidays/create" element={<CreateHoliday />} />
                <Route path="holidays/:id" element={<UpdateHoliday />} />

                {/* Attendance Log routes */}
                <Route path="attendance-log" element={<AttendanceLogList />} />
                <Route path="attendance-log/create" element={<CreateAttendanceLog />} />
                <Route path="attendance-log/:id" element={<UpdateAttendanceLog />} />

                {/* Category routes */}
                <Route path="categories" element={<CategoryList />} />
                <Route path="categories/create" element={<CreateCategory />} />
                <Route path="categories/:id" element={<UpdateCategory />} />
              </Routes>
            </MainLayout>
          </RequireAuth>
        }
      />

      {/* Profile route - separate as it might need different layout */}
      <Route
        path="/change-profile"
        element={
          <RequireAuth role="admin">
            <MainLayout>
              <ProfileEditForm />
            </MainLayout>
          </RequireAuth>
        }
      />

      {/* Employee routes - uncomment when ready */}
      {/* 
      <Route
        path="/employee/*"
        element={
          <RequireAuth role="employee">
            <EmployeeLayout>
              <Routes>
                <Route index element={<UserDashboard />} />
              </Routes>
            </EmployeeLayout>
          </RequireAuth>
        }
      />
      */}

      {/* Fallback for unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}