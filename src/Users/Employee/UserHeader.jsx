import React from "react";
import "../Admin/assets/css/Header.css";

const Header = ({ toggleSidebar, sidebarOpen, onLogout }) => {
  return (
    <header className="header">
      <button
        className="header__toggle-button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        
      </button>

      <h4 className="header__title">Dashboard</h4>

      <div className="header__actions">
        <div className="header__user-section">
          <span className="header__user-icon">👤</span>
          <span className="header__user-name">User</span>
        </div>

        {/* ✅ Separate Logout Button */}
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
