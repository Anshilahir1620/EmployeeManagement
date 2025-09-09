import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../Admin/Pages/Dashboard.jsx";
import EmployeeDetailContent from "../Admin/Pages/Employee/Employee.jsx";
import CreateEmployee from "../Admin/Pages/Employee/CreateEmployee.jsx";
import UpdateEmployee from "../Admin/Pages/Employee/UpdatedEmployee.jsx";
import DepartmentDetail from "../Admin/Pages/Department/Department.jsx";
import CreateDepartment from "../Admin/Pages/Department/CreateDepartment.jsx";
import UpdateDepartment from "../Admin/Pages/Department/UpdateDepartment.jsx";
import LeaveDetailContent from "../Admin/Pages/Leaves/LeavesDetails.jsx";
import CreateLeave from "../Admin/Pages/Leaves/CreateLeave.jsx";
import UpdateLeave from "../Admin/Pages/Leaves/UpdateLeave.jsx";
import HolidayDetail from "../Admin/Pages/Holidays/Holiday.jsx";
import CreateHoliday from "../Admin/Pages/Holidays/CreateHoliday.jsx";
import UpdateHoliday from "../Admin/Pages/Holidays/UpdateHoliday.jsx";
import AttendanceLogList from "../Admin/Pages/AttendanceLog/AttendanceLog.jsx";
import CreateAttendanceLog from "../Admin/Pages/AttendanceLog/CreateAttendanceLog.jsx";
import UpdateAttendanceLog from "../Admin/Pages/AttendanceLog/UpdateAttendanceLog.jsx";
import CategoryList from "../Admin/Pages/Category/Category.jsx";
import CreateCategory from "../Admin/Pages/Category/CreateCategory.jsx";
import UpdateCategory from "../Admin/Pages/Category/UpdateCategory.jsx";
import ProfileEditForm from "../Admin/Layout/ChangeProfile.jsx";

import MainLayout from "../Admin/Layout/MainLayout.jsx";

export default function AdminLayout() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        
        {/* Employee routes */}
        <Route path="employees" element={<EmployeeDetailContent />} />
        <Route path="create-employees" element={<CreateEmployee />} />
        <Route path="update-employees/:id" element={<UpdateEmployee />} />

        {/* Department routes */}
        <Route path="departments" element={<DepartmentDetail />} />
        <Route path="create-departments" element={<CreateDepartment />} />
        <Route path="update-departments/:id" element={<UpdateDepartment />} />

        {/* Leave routes */}
        <Route path="leaves" element={<LeaveDetailContent />} />
        <Route path="create-leaves" element={<CreateLeave />} />
        <Route path="update-leaves/:id" element={<UpdateLeave />} />

        {/* Holiday routes */}
        <Route path="holidays" element={<HolidayDetail />} />
        <Route path="create-holidays" element={<CreateHoliday />} />
        <Route path="update-holidays/:id" element={<UpdateHoliday />} />

        {/* Attendance Log routes */}
        <Route path="attendance-log" element={<AttendanceLogList />} />
        <Route path="create-attendance-log" element={<CreateAttendanceLog />} />
        <Route path="update-attendance-log/:id" element={<UpdateAttendanceLog />} />

        {/* Category routes */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="create-categories" element={<CreateCategory />} />
        <Route path="update-categories/:id" element={<UpdateCategory />} />

        {/* Profile route */}
        <Route path="change-profile" element={<ProfileEditForm />} />

        {/* Fallback for unmatched admin routes */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </MainLayout>
  );
}