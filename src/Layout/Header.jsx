import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../assets/css/Header.css";
import { toast } from "react-toastify";
// import { BASEURL } from "../common/Global";

export default function Header({
  scrolled = false,
  isMobile = false,
  onToggleSidebar = () => {},
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const [useFixedPosition, setUseFixedPosition] = useState(false);
  const [notifications, setNotificattions] = useState([]);
  const dropdownRef = useRef(null);
  const profileBtnRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false);
  //       setIsNotificationDropdownOpen(false);
  //     }
  //   };

  //   getData();
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const getData = async () => {
    const StoredData = localStorage.getItem("authUser");
    if (!StoredData) {
      toast.error("Authentication required");
      return;
    }

    const Token = JSON.parse(StoredData);

    const payload = {
      per_page: 5,
      page: 1,
      with_pagination: 1,
      field_db: "",
      select_val: "",
      order_by: "Desc",
    };

    console.log("API Payload:", payload);

    try {
      const response = await fetch(`${BASEURL}/notificationlogsforadmin`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + Token.access_token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log("API Response:", responseJson);

      if (responseJson.result) {
        // Update dashboard data with API response
        setNotificattions(responseJson.data);
        // toast.success(responseJson.message);
      } else {
        // toast.warning(responseJson.message);Z
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to fetch dashboard data");
    } finally {
    }
  };

  const calculateDropdownPosition = () => {
    if (profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      setDropdownPosition({
        top: rect.bottom + scrollTop + 8,
        right: window.innerWidth - rect.right - scrollLeft,
      });
    }
  };

  const toggleDropdown = () => {
    console.log("Dropdown toggled, current state:", isDropdownOpen);

    if (!isDropdownOpen) {
      calculateDropdownPosition();
    }

    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleNotofocationDropdowm = () => {
    // console.log("Dropdown toggled, current state:", isNotificationDropdownOpen);

    if (!isNotificationDropdownOpen) {
      calculateDropdownPosition();
    }

    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate("/change-profile");
    setIsDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
    setIsNotificationDropdownOpen(false);
    setIsDropdownOpen(false);
  };

  const logoutFunction = () => {
    localStorage.clear();
    navigate("/login");
  };
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  let username = `${user_data?.first_name} ${user_data?.last_name}` || "Admin";
  let firstLetter = username.substring(0, 1) || "";
  if (localStorage.getItem("authUser")) {
    if (username === "true") {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      const uNm = obj.email.split("@")[0];
      username = uNm.charAt(0).toUpperCase() + uNm.slice(1);
    }
  }

  // Dynamic dropdown styles based on positioning method
  const getDropdownStyles = () => {
    if (useFixedPosition) {
      return {
        position: "fixed",
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
        zIndex: 999999,
      };
    }
    return {};
  };

  return (
    <div>
      <header
        className={`modern-header ${scrolled ? "scrolled" : ""} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <div className="header-container">
          <div className="header-contentss">
            {/* Left Section */}
            <div className="header-left">
              <button
                className="sidebar-toggle"
                onClick={onToggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <div className="hamburger">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </div>

            {/* Right Section */}
            <div className="header-right">
              <div className="action-buttons">
                <button
                  className="action-btn notification-btn"
                  aria-label="Notifications"
                  onClick={toggleNotofocationDropdowm}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                  {/* <span className="notification-badge">3</span> */}
                </button>

                <div className="profile-dropdown" ref={dropdownRef}>
                  <button
                    ref={profileBtnRef}
                    className="profile-btn"
                    aria-label="User Profile"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={user_data?.profile_image}
                      alt="Profile"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    <span className="profile-name desktop-text">
                      {username}
                    </span>

                    <svg
                      className={`dropdown-arrow desktop-text ${
                        isDropdownOpen ? "rotated" : ""
                      }`}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </button>

                  {/* Multiple dropdown rendering strategies */}
                  {isDropdownOpen && (
                    <>
                      {/* Strategy 1: Normal absolute positioning */}
                      <div className="dropdown-menu-alt">
                        <div
                          className="dropdown-item"
                          onClick={handleProfileClick}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="dropdown-icon"
                          >
                            <path d="M12,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S8,5.79,8,8S9.79,12,12,12z M12,14c-2.67,0-8,1.34-8,4v2h16v-2 C20,15.34,14.67,14,12,14z" />
                          </svg>
                          My Profile
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={handleChangePasswordClick}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="dropdown-icon"
                          >
                            <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10 C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1 s3.1,1.39,3.1,3.1V8z" />
                          </svg>
                          Change Password
                        </div>
                        <div className="dropdown-divider"></div>
                        <div
                          className="dropdown-item logout"
                          onClick={logoutFunction}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="dropdown-icon"
                          >
                            <path d="M17,7l-1.41,1.41L18.17,11H8v2h10.17l-2.58,2.58L17,17l5-5L17,7z M4,5h8V3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h8v-2H4V5z" />
                          </svg>
                          Logout
                        </div>
                      </div>

                      {/* Strategy 2: Fixed positioning (if enabled) */}
                      {useFixedPosition && (
                        <div
                          className="dropdown-menu"
                          style={getDropdownStyles()}
                        >
                          <div
                            className="dropdown-item"
                            onClick={handleProfileClick}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="dropdown-icon"
                            >
                              <path d="M12,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S8,5.79,8,8S9.79,12,12,12z M12,14c-2.67,0-8,1.34-8,4v2h16v-2 C20,15.34,14.67,14,12,14z" />
                            </svg>
                            My Profile (Fixed)
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={handleChangePasswordClick}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="dropdown-icon"
                            >
                              <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v2h12c1.1,0,2-0.9,2-2V10 C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1 s3.1,1.39-3.1,3.1V8z" />
                            </svg>
                            Change Password (Fixed)
                          </div>
                          <div className="dropdown-divider"></div>
                          <div
                            className="dropdown-item logout"
                            onClick={logoutFunction}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="dropdown-icon"
                            >
                              <path d="M17,7l-1.41,1.41L18.17,11H8v2h10.17l-2.58,2.58L17,17l5-5L17,7z M4,5h8V3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h8v-2H4V5z" />
                            </svg>
                            Logout (Fixed)
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {isNotificationDropdownOpen && (
                    <>
                      {/* Absolute Position Dropdown */}
                      <div className="dropdown-menu-alt notification-dropdown">
                        <div className="notification-scroll">
                          {notifications.map((notification, index) => (
                            <div
                              key={index}
                              className="dropdown-item notification-item"
                            >
                              <div className="notification-icon">
                                {notification.type === "meal" && (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="dropdown-icon"
                                  >
                                    <path d="M12,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S8,5.79,8,8S9.79,12,12,12z M12,14c-2.67,0-8,1.34-8,4v2h16v-2 C20,15.34,14.67,14,12,14z" />
                                  </svg>
                                )}
                                {/* Add more icons for other types if needed */}
                              </div>
                              <div className="notification-content">
                                <div className="notification-title">
                                  <strong>{notification.title}</strong>
                                </div>
                                <div className="notification-message">
                                  {notification.message}
                                </div>
                                <div className="notification-meta">
                                  <span>{notification.user_name}</span> ·{" "}
                                  <span>{notification.time_ago}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
