// MainLayout.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import PusherNotification from "../common/PusherNotification";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size changes - Updated to use 1024px breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024; // Changed from 992 to 1024
      setIsMobile(mobile);

      // On desktop (>1024px), sidebar should be always visible/open
      if (!mobile) {
        setSidebarOpen(true); // Always open on desktop
      }
      // On mobile/tablet (<=1024px), sidebar should be closed by default
      else {
        setSidebarOpen(false); // Always closed by default on mobile/tablet
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar when clicking outside on mobile/tablet
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        !event.target.closest(".admin-modern-sidebar") &&
        !event.target.closest(".sidebar-toggle") &&
        !event.target.closest("[data-sidebar-toggle]")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Handle ESC key to close sidebar on mobile/tablet
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isMobile, sidebarOpen]);

  return (
    <>
      {/* <PusherNotification /> */}
      <div
        className="d-flex"
        style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
      >
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div
          className="flex-grow-1 main-content"
          style={{
            // On desktop: always account for sidebar width
            // On mobile/tablet: no margin, sidebar overlays
            marginLeft: isMobile ? "0" : "280px",
            transition: "margin-left 0.3s ease",
            width: isMobile ? "100%" : "calc(100% - 280px)",
          }}
        >
          {/* Header */}
          <Header
            scrolled={scrolled}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Dynamic Content passed as children */}
          <main className="p-3 p-md-4">{children}</main>
        </div>
      </div>
    </>
  );
}
