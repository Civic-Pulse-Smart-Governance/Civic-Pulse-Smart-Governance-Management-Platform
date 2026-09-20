import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaChartBar, FaHeadset, FaTimes, FaFileAlt } from "react-icons/fa";

export default function QuickActions({ onAction }) {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+N -> New Complaint
      if (e.ctrlKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        if (onAction) onAction("new");
      }
      // Ctrl+F -> Search
      if (e.ctrlKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        const searchInput = document.querySelector(".header-search-bar input");
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Escape -> Close FAB or Modals
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onAction]);

  const actions = [
    { id: "new", label: "File New Complaint", icon: <FaFileAlt />, shortcut: "Ctrl+N", color: "#6C63FF" },
    { id: "complaints", label: "Track My Reports", icon: <FaSearch />, shortcut: "Ctrl+F", color: "#4FC3F7" },
    { id: "analytics", label: "Analytics & Trends", icon: <FaChartBar />, color: "#81C784" },
    { id: "support", label: "Support & Help", icon: <FaHeadset />, color: "#FFB74D" }
  ];

  return (
    <div className="quick-actions-fab-container">
      {/* Expanded Speed Dial Menu */}
      {isOpen && (
        <div className="fab-menu-popover fade-in">
          {actions.map((act) => (
            <button
              key={act.id}
              className="fab-menu-item"
              style={{ "--fab-accent": act.color }}
              onClick={() => {
                if (onAction) onAction(act.id);
                setIsOpen(false);
              }}
            >
              <span className="fab-item-icon">{act.icon}</span>
              <span className="fab-item-label">{act.label}</span>
              {act.shortcut && <span className="fab-item-shortcut">{act.shortcut}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Trigger Button */}
      <button
        className={`main-fab-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Actions"
        aria-label="Quick Actions"
      >
        {isOpen ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
}
