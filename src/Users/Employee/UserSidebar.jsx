// Simplified Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Admin/assets/css/UserSidebar.css';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: 'dashboard' },
    { id: 'HolidayPage', label: 'HolidayPage', icon: '👥', path: '/employee/holidaypage' },
    { id: 'LeaveDetails', label: 'LeaveDetails', icon: '📦', path: '/employee/leavedetails', },
    { id: 'LeaveApply', label: 'ApplyLeave', icon: '📦', path: '/employee/leaverequest', },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar__logo">
        <span className="sidebar__logo-icon">🚀</span>
        {isOpen && <span className="sidebar__logo-text">MyApp</span>}
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar__nav-item ${location.pathname === item.path ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleItemClick(item.path)}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {isOpen && <span className="sidebar__nav-text">{item.label}</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;