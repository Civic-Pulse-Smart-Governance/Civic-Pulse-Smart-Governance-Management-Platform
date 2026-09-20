import React from "react";
import {
  FaBuilding,
  FaChartLine,
  FaListUl,
  FaPlusCircle,
  FaChartBar,
  FaTrophy,
  FaBell,
  FaSlidersH,
  FaHeadset,
  FaUser,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";

export default function Sidebar({
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  user,
  onLogout,
  unreadCount = 0
}) {
  const navItems = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "complaints", label: user.role === "admin" ? "Manage Complaints" : "My Complaints", icon: <FaListUl /> },
    ...(user.role !== "admin" ? [{ id: "new", label: "New Complaint", icon: <FaPlusCircle /> }] : []),
    { id: "analytics", label: "Analytics & Trends", icon: <FaChartBar /> },
    { id: "achievements", label: "Achievements", icon: <FaTrophy /> },
    { id: "notifications", label: "Notifications", icon: <FaBell />, badge: unreadCount },
    { id: "settings", label: "Settings", icon: <FaSlidersH /> },
    { id: "support", label: "Support & Help", icon: <FaHeadset /> }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="sidebar-mobile-overlay" onClick={onCloseMobile} />
      )}

      <aside className={`dashboard-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <FaBuilding />
          </div>
          <div className="brand-text">
            <span className="brand-title">CivicPulse</span>
            <span className="brand-subtitle">Municipal Portal</span>
          </div>
          <button className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close sidebar">
            <FaTimes />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout Footer */}
        <div className="sidebar-user-footer">
          <div className="user-avatar-circle">
            <FaUser />
          </div>
          <div className="user-details font-inter">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role font-xs">
              {user?.role === "admin" ? `Officer (${user?.department || "General"})` : "Citizen"}
            </span>
          </div>
          <button className="sidebar-logout-btn" onClick={onLogout} title="Log Out">
            <FaSignOutAlt />
          </button>
        </div>
      </aside>
    </>
  );
}
