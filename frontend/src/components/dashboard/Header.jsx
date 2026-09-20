import React from "react";
import { FaBars, FaSearch, FaSun, FaMoon, FaSyncAlt, FaUserCircle } from "react-icons/fa";
import NotificationBell from "./NotificationBell";

export default function Header({
  user,
  searchTerm,
  onSearchChange,
  theme,
  onToggleTheme,
  refreshing,
  onRefresh,
  onToggleMobileSidebar,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead
}) {
  return (
    <header className="dashboard-top-header">
      <div className="header-left">
        <button
          className="mobile-hamburger-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>
        <div className="header-welcome font-inter">
          <h2>Welcome back, {user?.name?.split(" ")[0] || "Citizen"} 👋</h2>
          <p className="font-xs text-muted">
            {user?.role === "admin"
              ? "Municipal Officer Console • Real-time resolution queue"
              : "Track your reports and civic resolutions in real-time"}
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search complaints by ID, title, category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sync Button */}
        <button
          className={`btn-header-icon ${refreshing ? "spinning" : ""}`}
          onClick={onRefresh}
          disabled={refreshing}
          title="Refresh Data"
        >
          <FaSyncAlt />
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-header-icon theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
        </button>

        {/* Notification Bell */}
        <NotificationBell
          notifications={notifications}
          onNotificationClick={onNotificationClick}
          onMarkAllRead={onMarkAllNotificationsRead}
        />

        {/* Profile Badge */}
        <div className="header-user-badge">
          <div className="avatar-icon">
            <FaUserCircle />
          </div>
          <span className="user-shortname">{user?.name || "User"}</span>
        </div>
      </div>
    </header>
  );
}
