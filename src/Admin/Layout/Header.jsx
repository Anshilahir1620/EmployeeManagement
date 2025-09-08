import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../assets/css/Header.css";

export default function Header({ scrolled = false, isMobile = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  const user_data = JSON.parse(localStorage.getItem("user"));
  const userName = user_data?.userName || "Admin";
  const UserID = user_data?.userId || "";

  // Fetch employee by UserID
  useEffect(() => {
    if (!UserID) return;

    axios
      .get(`https://localhost:7204/api/Employee/byUserId/${UserID}`)
      .then((res) => {
        setEmployee(res.data);
        console.log("✅ Employee dataPrfile:", res.data);
      })
      .catch((err) => {
        console.error("Error fetching employee:", err);
      });
  }, [UserID]);

  const handleProfileClick = () => {
    navigate("/change-profile");
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
  };

  const logoutFunction = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Helper for profile image
  const profileImageUrl = employee?.imagePath
    ? `https://localhost:7204/${employee.imagePath}`
    : "/default-profile.png";

  return (
    <header className={`modern-header ${scrolled ? "scrolled" : ""} ${isMobile ? "mobile" : ""}`}>
      <div className="header-container">
        {/* Right Section */}
        <div className="header-right">
          {/* Notification Button */}
          <button
            className="notification-btn"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button className="profile-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src={profileImageUrl} alt="Profile" className="profile-image" />
              <span className="profile-name">{userName}</span>
              <svg
                className={`dropdown-arrow ${isDropdownOpen ? "rotated" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleProfileClick}>My Profile</div>
                <div className="dropdown-item" onClick={handleChangePasswordClick}>Change Password</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={logoutFunction}>Logout</div>
              </div>
            )}

            {isNotificationOpen && (
              <div className="dropdown-menu notification-dropdown">
                <div className="notification-item">No notifications</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
