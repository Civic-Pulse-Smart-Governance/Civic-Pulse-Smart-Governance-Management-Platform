import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaCheckDouble, FaExclamationCircle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

export default function NotificationBell({ notifications = [], onNotificationClick, onMarkAllRead }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "critical":
        return <FaExclamationCircle className="priority-icon critical" />;
      case "high":
        return <FaExclamationCircle className="priority-icon high" />;
      case "resolved":
        return <FaCheckCircle className="priority-icon resolved" />;
      default:
        return <FaInfoCircle className="priority-icon normal" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className={`btn-header-icon bell-btn ${unreadCount > 0 ? "has-unread" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
        aria-label="Open notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="bell-badge-count">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-panel fade-in">
          <div className="panel-header">
            <h4>Notifications ({notifications.length})</h4>
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={onMarkAllRead}>
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>

          <div className="panel-body">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <FaBell className="empty-bell-icon" />
                <p>No notifications right now.</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-card-item ${!n.read ? "unread" : ""}`}
                    onClick={() => {
                      if (onNotificationClick) onNotificationClick(n);
                      setIsOpen(false);
                    }}
                  >
                    <div className="item-icon">{getPriorityIcon(n.priority)}</div>
                    <div className="item-content">
                      <p className="item-title">{n.title || n.message}</p>
                      {n.details && <p className="item-details">{n.details}</p>}
                      <span className="item-time">{formatTimeAgo(n.timestamp)}</span>
                    </div>
                    {!n.read && <span className="unread-dot" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
