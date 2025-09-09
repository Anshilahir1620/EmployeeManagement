// UserMainLayout.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '../Admin/assets/css/UserDashboard.css';
// Layout parts
import Header from './UserHeader.jsx';
import Sidebar from './UserSidebar.jsx';
// Pages
import UserDashboard from './Userside_Dashboard';
import HolidayPage from './HolidayPage';
import LeaveRequest from './LeaveRequest';
import LeaveDetails from './LeaveDetails.jsx';

const UserMainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div
        className={`main-layout__content ${
          sidebarOpen ? 'main-layout__content--shifted' : ''
        }`}
      >
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="main-layout__main">
          <Routes>
            {/* Default route shows dashboard */}
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="holidaypage" element={<HolidayPage />} />
            <Route path="leaverequest" element={<LeaveRequest />} />
            <Route path="leavedetails" element={<LeaveDetails />} />
            {/* Fallback for unmatched subroutes */}
            <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserMainLayout;