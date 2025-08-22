import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../assets/css/Sidebar.css";
import logo from "../assets/images/fitrace.png";

export default function Sidebar({ isOpen, isMobile, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  // Check screen size and update state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTabletOrMobile(window.innerWidth <= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const logoutFunction = () => {
    localStorage.clear();
    navigate("/login");
  };

  let user_data = JSON.parse(localStorage.getItem("user_data"));
  let role_name = user_data?.role_name || "Administrator";
  let username = `${user_data?.first_name} ${user_data?.last_name}` || "Admin";
  let firstLetter = username.substring(0, 1) || "";
  if (localStorage.getItem("authUser")) {
    if (username === "true") {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      const uNm = obj.email.split("@")[0];
      username = uNm.charAt(0).toUpperCase() + uNm.slice(1);
    }
  }

  const sidebarItems = [
    {
      icon: "dashboard",
      label: "Home",
      path: "/",
      iconType: "material",
      color: "#3B82F6",
    },
  
    {
      icon: "dashboard",
      label: "Employee Details",
      path: "/Pages/Employee",
      iconType: "material",
      color: "#8B5CF6",
      hasSubmenu: true,
      submenu: [
        {
          icon: "dashboard",
          label: "Employee Details",
          path: "/Pages/Employee/",
          color: "#6366F1",
        },
         {
          icon: "dashboard",
          label: "Add User",
          path: "/Pages/Employee/CreateEmployee",
          color: "#6366F1",
        }
    
       
      ]
      
      },


       {
      icon: "dashboard",
      label: "Department",
      path: "/Pages/Department",
      iconType: "material",
      color: "#8B5CF6",
      hasSubmenu: true,
      submenu: [
        {
          icon: "dashboard",
          label: "Departments",
          path: "/Pages/Department/",
          color: "#6366F1",
        },
         {
          icon: "dashboard",
          label: "Add Department",
          path: "/Pages/Department/CreateDepartment",
          color: "#6366F1",
        }
       
      ]
      
      },
      {
      icon: "dashboard",
      label: "Leaves",
      path: "/Pages/Leave",
      iconType: "material",
      color: "#8B5CF6",
      hasSubmenu: true,
      submenu: [
        {
          icon: "dashboard",
          label: "Details",
          path: "/Pages/Leaves/",
          color: "#6366F1",
        },
         {
          icon: "dashboard",
          label: "Add Department",
          path: "/Pages/Leaves/CreateLeave",
          color: "#6366F1",
        }
       
      ]
      
      },
      {
      icon: "dashboard",
      label: "Holidays",
      path: "/Pages/Holidays",
      iconType: "material",
      color: "#8B5CF6",
      hasSubmenu: true,
      submenu: [
        {
          icon: "dashboard",
          label: "Details",
          path: "/Pages/Holidays/",
          color: "#6366F1",
        },
         {
          icon: "dashboard",
          label: "Add Holiday",
          path: "/Pages/Holidays/Insert",
          color: "#6366F1",
        }
       
      ]
      },
      {
      icon: "dashboard",
      label: "Attendance Log",
      path: "/Pages/AttendanceLog",
      iconType: "material",
      color: "#8B5CF6",
      hasSubmenu: true,
      submenu: [
        {
          icon: "dashboard",
          label: "Details",
          path: "/Pages/AttendanceLog",
          color: "#6366F1",
        },
         {
          icon: "dashboard",
          label: "Add Attendance",
          path: "/Pages/AttendanceLog/CreateAttendanceLog",
          color: "#6366F1",
        }
       
      ]
      
      },
      {
      icon: "dashboard",
      label: "Categories",
      path: "/Pages/Categories",
      iconType: "material",
      color: "#8B5CF6",
      hasSubmenu: true,
      submenu: [
        {
          icon: "dashboard",
          label: "Details",
          path: "/Pages/Categories/",
          color: "#6366F1",
        },
         {
          icon: "dashboard",
          label: "Add Category",
          path: "/Pages/Category/CreateCategory",
          color: "#6366F1",
        }
       
      ]
      
      }  
  
  
 

 
  
  ];

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  const isSubmenuActive = (submenu) => {
    return submenu?.some((subItem) => isActivePath(subItem.path));
  };

  const toggleSubmenu = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmenuClick = () => {
    if (isTabletOrMobile) {
      onClose();
    }
  };

  const handleNavClick = () => {
    if (isTabletOrMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for tablet and mobile */}
      {isTabletOrMobile && isOpen && (
        <div className="admin-sidebar-overlay" onClick={onClose}></div>
      )}

      <div
        className={`admin-modern-sidebar ${isTabletOrMobile ? "admin-mobile" : ""} ${
          isOpen ? "admin-open" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          <div className="admin-brand-container">
            <div className="admin-brand-text">
              <img style={{ height: "52px" }} src={logo} />
            </div>
          </div>
          {isTabletOrMobile && (
            <button className="admin-close-btn" onClick={onClose}>
              <span className="material-icons">close</span>
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="admin-sidebar-nav">
          <ul className="admin-nav-list">
            {sidebarItems.map((item, index) => (
              <li key={index} className="admin-nav-item">
                {item.hasSubmenu ? (
                  <>
                    {/* Parent item with submenu */}
                    <div
                      className={`admin-nav-link ${
                        isActivePath(item.path) || isSubmenuActive(item.submenu)
                          ? "admin-active"
                          : ""
                      } ${expandedItems[index] ? "admin-expanded" : ""}`}
                      onClick={() => toggleSubmenu(index)}
                      data-has-submenu="true"
                      style={{ "--item-color": item.color }}
                    >
                      <div className="admin-nav-icon">
                        <span className="material-icons">{item.icon}</span>
                      </div>
                      <span className="admin-nav-label">{item.label}</span>
                      <div className="admin-nav-arrow">
                        <span className="material-icons">
                          {expandedItems[index] ? "expand_less" : "expand_more"}
                        </span>
                      </div>
                      <div className="admin-nav-ripple"></div>
                    </div>

                    {/* Submenu */}
                    <ul
                      className={`admin-submenu ${
                        expandedItems[index] ? "admin-expanded" : ""
                      }`}
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex} className="admin-submenu-item">
                          <Link
                            to={subItem.path}
                            className={`admin-submenu-link ${
                              isActivePath(subItem.path) ? "admin-active" : ""
                            }`}
                            onClick={handleSubmenuClick}
                            style={{ "--item-color": subItem.color }}
                          >
                            <div className="admin-submenu-icon">
                              <span className="material-icons">
                                {subItem.icon}
                              </span>
                            </div>
                            <span className="admin-submenu-label">
                              {subItem.label}
                            </span>
                            <div className="admin-submenu-indicator"></div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  /* Regular nav item without submenu */
                  <Link
                    to={item.path}
                    className={`admin-nav-link ${
                      isActivePath(item.path) ? "admin-active" : ""
                    }`}
                    onClick={handleNavClick}
                    style={{ "--item-color": item.color }}
                  >
                    <div className="admin-nav-icon">
                      <span className="material-icons">{item.icon}</span>
                    </div>
                    <span className="admin-nav-label">{item.label}</span>
                    <div className="admin-nav-ripple"></div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer section */}
         <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
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
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{username}</span>
              <span className="admin-user-role">{role_name}</span>
            </div>
            <button className="admin-logout-btn" onClick={logoutFunction}>
              <span className="material-icons">logout</span>
            </button>
          </div>
        </div> 
      </div>
    </>
  );
}