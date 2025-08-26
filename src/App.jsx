// App.js
import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import MainLayout from "./Layout/MainLayout";
import CreateEmployee from "./Pages/Employee/CreateEmployee";
import UpdateEmployee from "./Pages/Employee/UpdatedEmployee";
import DepartmentDetail from "./Pages/Department/Department";
import CreateDepartment from "./Pages/Department/CreateDepartment";
import UpdateDepartment from "./Pages/Department/UpdateDepartment";
import CreateLeave from "./Pages/Leaves/CreateLeave";
import UpdateLeave from "./Pages/Leaves/UpdateLeave";
import HolidayDetail from "./Pages/Holidays/Holiday";
import CreateHoliday from "./Pages/Holidays/CreateHoliday";
import UpdateHoliday from "./Pages/Holidays/UpdateHoliday";
import AttendanceLogList from "./Pages/AttendanceLog/AttendanceLog";
import CreateAttendanceLog from "./Pages/AttendanceLog/CreateAttendanceLog";
import UpdateAttendanceLog from "./Pages/AttendanceLog/UpdateAttendanceLog";
import CreateCategory from "./Pages/Category/CreateCategory";
import UpdateCategory from "./Pages/Category/UpdateCategory";
import CategoryList from "./Pages/Category/Category";
import Login from './Pages/Auth/Login';
import RequireAuth from './common/RequireAuth.jsx';
import EmployeeDetailContent from "./Pages/Employee/Employee";
import LeaveDetailContent from "./Pages/Leaves/LeavesDetails";


export default function App() {
  return (
    <BrowserRouter>
      <Routes >

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/"
          element={<RequireAuth><MainLayout /></RequireAuth>
      
          }
        />
         <Route
          path="/Pages/Employee"
          element={<RequireAuth><EmployeeDetailContent /></RequireAuth>

          }
        />
        <Route path="/Pages/Employee/CreateEmployee" element={<RequireAuth><CreateEmployee /></RequireAuth>} />
        <Route path="/Pages/UpdatedEmployee/:id" element={<RequireAuth><UpdateEmployee /></RequireAuth>} />


        // DEPARTMENT ROUTE
        <Route
          path="/Pages/Department"
          element={<RequireAuth>< DepartmentDetail /></RequireAuth>
          }
        />
        // Update route
        <Route path="/Pages/Department/CreateDepartment" element={<RequireAuth><CreateDepartment /></RequireAuth>} />
        <Route path="/Pages/Department/UpdateDepartment/:id" element={<RequireAuth><UpdateDepartment /></RequireAuth>} />



          // leave Route

        <Route
          path="/Pages/Leaves"
          element={<RequireAuth><LeaveDetailContent /></RequireAuth>}

        />
        <Route path="/Pages/Leaves/CreateLeave" element={<RequireAuth><CreateLeave /></RequireAuth>} />
        <Route path="/Pages/Leaves/UpdateLeave/:id" element={<RequireAuth><UpdateLeave /></RequireAuth>} />




// holiday
        <Route
          path="/Pages/Holidays/"
          element={<RequireAuth><HolidayDetail /></RequireAuth>}

        />

        <Route path="/Pages/Holidays/Insert" element={<RequireAuth><CreateHoliday /></RequireAuth>} />
        <Route path="/Pages/Holidays/UpdateHoliday/:id" element={<RequireAuth><UpdateHoliday /></RequireAuth>} />

// Attendance Log
        <Route
          path="/Pages/AttendanceLog"
          element={<RequireAuth><AttendanceLogList /></RequireAuth>}
        />
        <Route path="/Pages/AttendanceLog/CreateAttendanceLog" element={<RequireAuth><CreateAttendanceLog/></RequireAuth>} />
        <Route path="/Pages/AttendanceLog/UpdateAttendanceLog/:id" element={<RequireAuth><UpdateAttendanceLog /></RequireAuth>} />

       //Categories
        <Route
          path="/Pages/Categories"
          element={<RequireAuth><CategoryList /></RequireAuth>}
        />
        <Route path="/Pages/Category/CreateCategory" element={<RequireAuth><CreateCategory /></RequireAuth>} />
        <Route path="/Pages/Category/UpdateCategory/:id" element={<RequireAuth><UpdateCategory /></RequireAuth>} />



      </Routes>
 



    </BrowserRouter>

  );
}

// Component to handle root route redirection

