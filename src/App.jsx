// App.js
import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import MainLayout from "./Layout/MainLayout";
import EmployeeDetail from "./Pages/Employee/Employee";
import CreateEmployee from "./Pages/Employee/CreateEmployee";
import UpdateEmployee from "./Pages/Employee/UpdatedEmployee";
import DepartmentDetail from "./Pages/Department/Department";
import CreateDepartment from "./Pages/Department/CreateDepartment";
import UpdateDepartment from "./Pages/Department/UpdateDepartment";
import LeaveDetail from "./Pages/Leaves/LeavesDetails";
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


export default function App() {
  return (
    <BrowserRouter>
      <Routes >

        <Route
          path="/"
          element={<MainLayout />

          }
        />
        <Route
          path="/Pages/Employee"
          element={<EmployeeDetail />

          }
        />
        <Route path="/Pages/Employee/CreateEmployee" element={<CreateEmployee />} />
        <Route path="/Pages/UpdatedEmployee/:id" element={<UpdateEmployee />} />


        // DEPARTMENT ROUTE
        <Route
          path="/Pages/Department"
          element={< DepartmentDetail />
          }
        />
        // Update route
        <Route path="/Pages/Department/CreateDepartment" element={<CreateDepartment />} />
        <Route path="/Pages/Department/UpdatedDepartment/:id" element={<UpdateDepartment />} />



          // leave Route

        <Route
          path="/Pages/Leaves"
          element={<LeaveDetail />}

        />
        <Route path="/Pages/Leaves/CreateLeave" element={<CreateLeave />} />
        <Route path="/Pages/Leaves/UpdateLeave/:id" element={<UpdateLeave />} />




// holiday
        <Route
          path="/Pages/Holidays/"
          element={<HolidayDetail />}

        />

        <Route path="/Pages/Holidays/Insert" element={<CreateHoliday />} />
        <Route path="/Pages/Holidays/UpdateHoliday/:id" element={<UpdateHoliday />} />

// Attendance Log
        <Route
          path="/Pages/AttendanceLog"
          element={<AttendanceLogList />}
        />
        <Route path="/Pages/AttendanceLog/CreateAttendanceLog" element={<CreateAttendanceLog/>} />
        <Route path="/Pages/AttendanceLog/UpdateAttendanceLog/:id" element={<UpdateAttendanceLog />} />

       //Categories
        <Route
          path="/Pages/Categories"
          element={<CategoryList />}
        />
        <Route path="/Pages/Category/CreateCategory" element={<CreateCategory />} />
        <Route path="/Pages/Category/UpdateCategory/:id" element={<UpdateCategory />} />



      </Routes>




    </BrowserRouter>

  );
}

// Component to handle root route redirection

