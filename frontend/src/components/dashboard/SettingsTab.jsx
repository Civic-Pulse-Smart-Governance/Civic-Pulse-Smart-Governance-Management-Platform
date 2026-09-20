import React, { useState } from "react";
import {
  FaUser,
  FaBell,
  FaPalette,
  FaLock,
  FaShieldAlt,
  FaCamera,
  FaSave,
  FaMoon,
  FaSun,
  FaCheckCircle
} from "react-icons/fa";

export default function SettingsTab({ user, theme, onToggleTheme, onUpdateUser }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "+1 (555) 234-5678"
  });

  // Notification Preferences State
  const [notifState, setNotifState] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifs: true,
    weeklyReport: false
  });

  // Display Settings
  const [fontSize, setFontSize] = useState("medium");
  const [density, setDensity] = useState("comfortable");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    if (onUpdateUser) {
      onUpdateUser({ ...user, name: profileForm.name, phone: profileForm.phone });
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const sections = [
    { id: "profile", label: "Profile Details", icon: <FaUser /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "display", label: "Theme & Display", icon: <FaPalette /> },
    { id: "security", label: "Password & Security", icon: <FaLock /> },
    { id: "privacy", label: "Privacy & Data", icon: <FaShieldAlt /> }
  ];

  return (
    <div className="settings-tab-wrapper fade-in">
      <div className="settings-header">
        <h3>Account & System Settings</h3>
        <p className="section-subtitle">Manage your profile, notification preferences, and display themes</p>
      </div>

      <div className="settings-layout-grid">
        {/* Settings Navigation Sidebar */}
        <div className="settings-nav-panel">
          {sections.map((sec) => (
            <button
              key={sec.id}
              className={`settings-nav-btn ${activeSection === sec.id ? "active" : ""}`}
              onClick={() => setActiveSection(sec.id)}
            >
              <span className="sec-icon">{sec.icon}</span>
              <span className="sec-label">{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Main Content Area */}
        <div className="settings-content-panel">
          {saveSuccess && (
            <div className="alert-success-banner fade-in">
              <FaCheckCircle /> Preferences saved successfully!
            </div>
          )}

          {/* 1. Profile Section */}
          {activeSection === "profile" && (
            <div className="settings-section-card">
              <h4>Profile Settings</h4>
              <p className="font-xs text-muted mb-4">Update your contact information and municipal profile.</p>

              <div className="avatar-upload-block">
                <div className="avatar-preview-circle">
                  <span className="avatar-initials">{profileForm.name.charAt(0) || "U"}</span>
                  <label htmlFor="avatar-file-input" className="btn-upload-overlay" title="Upload new photo">
                    <FaCamera />
                  </label>
                  <input id="avatar-file-input" type="file" accept="image/*" style={{ display: "none" }} />
                </div>
                <div className="avatar-hints">
                  <strong>Profile Avatar</strong>
                  <p className="font-xs text-muted">Supports JPG, PNG or WEBP up to 5MB.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form-grid">
                <div className="form-group-item">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label>Email Address</label>
                  <input type="email" value={profileForm.email} disabled className="input-disabled" />
                  <span className="font-xs text-muted">Email is locked for account verification.</span>
                </div>

                <div className="form-group-item">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group-item full-width">
                  <button type="submit" className="btn-save-settings">
                    <FaSave /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. Notifications Section */}
          {activeSection === "notifications" && (
            <div className="settings-section-card">
              <h4>Notification Preferences</h4>
              <p className="font-xs text-muted mb-4">Choose how you receive grievance progress alerts.</p>

              <div className="toggle-list-group">
                <div className="toggle-item-row">
                  <div>
                    <strong>Email Status Alerts</strong>
                    <p className="font-xs text-muted">Receive email updates when status changes to In-Progress or Resolved.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.emailAlerts}
                    onChange={(e) => setNotifState({ ...notifState, emailAlerts: e.target.checked })}
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-item-row">
                  <div>
                    <strong>SMS Urgent Alerts</strong>
                    <p className="font-xs text-muted">Get text message alerts for high-priority municipal dispatches.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.smsAlerts}
                    onChange={(e) => setNotifState({ ...notifState, smsAlerts: e.target.checked })}
                    className="toggle-checkbox"
                  />
                </div>

                <div className="toggle-item-row">
                  <div>
                    <strong>Browser Push Notifications</strong>
                    <p className="font-xs text-muted">Show real-time desktop popups while logged in.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.pushNotifs}
                    onChange={(e) => setNotifState({ ...notifState, pushNotifs: e.target.checked })}
                    className="toggle-checkbox"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Display Section */}
          {activeSection === "display" && (
            <div className="settings-section-card">
              <h4>Theme & Interface Options</h4>
              <p className="font-xs text-muted mb-4">Customize visual theme and interface text sizing.</p>

              <div className="theme-select-grid mb-6">
                <div
                  className={`theme-card-option ${theme === "light" ? "selected" : ""}`}
                  onClick={() => theme !== "light" && onToggleTheme()}
                >
                  <FaSun className="theme-icon sun" />
                  <strong>Light Theme</strong>
                  <p className="font-xs text-muted">Clean high-contrast theme</p>
                </div>

                <div
                  className={`theme-card-option ${theme === "dark" ? "selected" : ""}`}
                  onClick={() => theme !== "dark" && onToggleTheme()}
                >
                  <FaMoon className="theme-icon moon" />
                  <strong>Dark Theme</strong>
                  <p className="font-xs text-muted">Sleek dark mode theme</p>
                </div>
              </div>

              <div className="form-group-item">
                <label>Interface Font Sizing</label>
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="filter-select">
                  <option value="small">Compact Sizing</option>
                  <option value="medium">Medium Standard</option>
                  <option value="large">Large Accessibility</option>
                </select>
              </div>
            </div>
          )}

          {/* 4. Security Section */}
          {activeSection === "security" && (
            <div className="settings-section-card">
              <h4>Password & Authentication</h4>
              <form onSubmit={(e) => { e.preventDefault(); alert("Password updated!"); }} className="settings-form-grid">
                <div className="form-group-item full-width">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className="form-group-item">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className="form-group-item">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className="form-group-item full-width">
                  <button type="submit" className="btn-save-settings">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. Privacy Section */}
          {activeSection === "privacy" && (
            <div className="settings-section-card">
              <h4>Privacy & Data Rights</h4>
              <p className="font-xs text-muted">Export your account history or request dataset archive under GDPR/CCPA regulations.</p>
              <button
                className="btn-export-csv mt-4"
                onClick={() => alert("Preparing data download zip archive...")}
              >
                Request Data Export (.ZIP)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
