import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import ComplaintsSection from "../components/dashboard/ComplaintsSection";
import AnalyticsTab from "../components/dashboard/AnalyticsTab";
import NotificationBell from "../components/dashboard/NotificationBell";
import QuickActions from "../components/dashboard/QuickActions";
import SettingsTab from "../components/dashboard/SettingsTab";
import AchievementsTab from "../components/dashboard/AchievementsTab";
import NewComplaintTab from "../components/dashboard/NewComplaintTab";
import Services from "../components/Services";
import Contact from "../components/Contact";
import { FaHeadset, FaEnvelope, FaPhoneAlt, FaComments } from "react-icons/fa";
import "../styles/dashboard.css";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Mock Notification State
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Grievance #5901 Assigned",
      details: "Municipal Inspector assigned to inspect potholes on Main Street.",
      priority: "high",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: "n2",
      title: "Water Leakage Resolved",
      details: "Sector 4 Pipe repair work marked completed by Water Works dept.",
      priority: "resolved",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 120)
    },
    {
      id: "n3",
      title: "System Update Complete",
      details: "CivicPulse v2.4 portal features enabled.",
      priority: "normal",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 600)
    }
  ]);

  // Fetch Complaints from Backend
  const fetchComplaints = useCallback(async (showRefresher = false) => {
    if (showRefresher) setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Handle Admin Status Update
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update local state
      setComplaints((prev) =>
        prev.map((c) => {
          const idToCompare = c.id || c._id;
          if (idToCompare === complaintId) {
            return { ...c, status: newStatus };
          }
          return c;
        })
      );

      // Add Notification
      setNotifications((prev) => [
        {
          id: "n_" + Date.now(),
          title: `Status Updated to ${newStatus.toUpperCase()}`,
          details: `Complaint #${complaintId.toString().slice(-6)} updated.`,
          priority: newStatus === "resolved" ? "resolved" : "high",
          read: false,
          timestamp: new Date()
        },
        ...prev
      ]);
    } catch (err) {
      alert("Error updating complaint status: " + err.message);
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setActiveTab("complaints");
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="dashboard-container">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
        unreadCount={unreadNotifCount}
      />

      {/* 2. Main Content Area */}
      <main className="dashboard-main-content">
        {/* Top Header */}
        <Header
          user={user}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          theme={theme}
          onToggleTheme={toggleTheme}
          refreshing={refreshing}
          onRefresh={() => fetchComplaints(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        />

        {/* Tab Content Router */}
        {activeTab === "overview" && (
          <div className="tab-pane-content fade-in">
            {/* Animated Metrics Cards */}
            <MetricsGrid
              complaints={complaints}
              loading={loading}
              onFilterByStatus={() => setActiveTab("complaints")}
            />

            {/* Complaints Management Section */}
            <ComplaintsSection
              complaints={complaints}
              loading={loading}
              user={user}
              onStatusChange={handleStatusChange}
              onFileNewComplaint={() => setActiveTab("new")}
            />

            {/* Analytics Overview */}
            <AnalyticsTab complaints={complaints} />
          </div>
        )}

        {activeTab === "complaints" && (
          <div className="tab-pane-content fade-in">
            <ComplaintsSection
              complaints={complaints}
              loading={loading}
              user={user}
              onStatusChange={handleStatusChange}
              onFileNewComplaint={() => setActiveTab("new")}
            />
          </div>
        )}

        {activeTab === "new" && (
          <div className="tab-pane-content fade-in">
            <NewComplaintTab
              onSubmitSuccess={() => {
                fetchComplaints();
                setActiveTab("complaints");
              }}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="tab-pane-content fade-in">
            <AnalyticsTab complaints={complaints} />
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="tab-pane-content fade-in">
            <AchievementsTab complaints={complaints} />
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="tab-pane-content fade-in">
            <div className="settings-section-card">
              <h3>Notification Center</h3>
              <p className="font-xs text-muted mb-4">View your full notification history and updates.</p>
              <div className="notification-list-full">
                {notifications.map((n) => (
                  <div key={n.id} className="notification-card-item">
                    <div className="item-content">
                      <strong className="item-title">{n.title}</strong>
                      <p className="item-details">{n.details}</p>
                      <span className="item-time">{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-pane-content fade-in">
            <SettingsTab
              user={user}
              theme={theme}
              onToggleTheme={toggleTheme}
              onUpdateUser={(updated) => {
                localStorage.setItem("user", JSON.stringify(updated));
              }}
            />
          </div>
        )}

        {activeTab === "support" && (
          <div className="tab-pane-content fade-in space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
              <Contact />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
              <Services onOpenFileModal={() => setActiveTab("new")} />
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button & Speed Dial */}
      <QuickActions onAction={(actionId) => setActiveTab(actionId)} />
    </div>
  );
}
