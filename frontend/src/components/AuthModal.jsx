import React, { useState } from "react";
import { FaTimes, FaSignInAlt, FaUserPlus, FaUser, FaUserShield, FaBuilding, FaInfoCircle } from "react-icons/fa";
import "../styles/modal.css";

export default function AuthModal({ initialMode = "login", onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // "login" or "register"
  const [activeRole, setActiveRole] = useState("user"); // "user" or "admin"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "Roads & Traffic Infrastructure",
    officerId: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const bodyObj = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: activeRole,
        };

        if (activeRole === "admin") {
          bodyObj.officerId = formData.officerId;
          bodyObj.department = formData.department;
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyObj)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMode("login");
        }, 1800);
      } else {
        const bodyObj = {
          role: activeRole,
          password: formData.password
        };
        if (activeRole === "admin") {
          bodyObj.officerId = formData.officerId;
          bodyObj.department = formData.department;
        } else {
          bodyObj.email = formData.email;
        }

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyObj)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess && onLoginSuccess(data.user, data.token);
          onClose();
        }, 1600);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-header-icon" style={{ color: activeRole === "admin" ? "#D97706" : "var(--primary-blue)" }}>
              {mode === "login" ? (activeRole === "admin" ? <FaUserShield /> : <FaSignInAlt />) : <FaUserPlus />}
            </div>
            <h3>
              {mode === "login"
                ? activeRole === "admin"
                  ? "Admin / Officer Login"
                  : "Citizen Login"
                : activeRole === "admin"
                  ? "Admin / Officer Registration"
                  : "Citizen Registration"}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {isSuccess ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--secondary-green)" }}>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                {mode === "login"
                  ? activeRole === "admin"
                    ? "Welcome Admin Officer!"
                    : "Citizen Login Successful!"
                  : activeRole === "admin"
                    ? "Admin Officer Registered & Saved to MongoDB!"
                    : "Citizen Account Registered & Saved to MongoDB!"}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                {mode === "login"
                  ? activeRole === "admin"
                    ? "Redirecting to Municipal Admin Control Center..."
                    : "Redirecting to Citizen Grievance Portal..."
                  : "Switching to login portal..."}
              </p>
            </div>
          ) : (
            <>
              {/* Role Selection Tabs for Login and Register Mode */}
              <div className="role-tabs-container">
                <button
                  type="button"
                  className={`role-tab-btn ${activeRole === "user" ? "active" : ""}`}
                  onClick={() => setActiveRole("user")}
                >
                  <FaUser /> {mode === "login" ? "Citizen Login" : "Citizen Register"}
                </button>
                <button
                  type="button"
                  className={`role-tab-btn ${activeRole === "admin" ? "active admin-active" : ""}`}
                  onClick={() => setActiveRole("admin")}
                >
                  <FaUserShield /> {mode === "login" ? "Admin Login" : "Admin Register"}
                </button>
              </div>

              {mode === "register" && activeRole === "admin" && (
                <div className="reg-info-notice" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B", color: "#92400E" }}>
                  <FaInfoCircle style={{ fontSize: "1.2rem", flexShrink: 0 }} />
                  <span>Municipal Admin Officer Registration. New officer accounts are persisted directly into MongoDB Atlas.</span>
                </div>
              )}

              <form className="modal-form" onSubmit={handleSubmit}>
                {errorMsg && (
                  <div style={{
                    backgroundColor: "#FEE2E2",
                    color: "#B91C1C",
                    padding: "0.75rem 1rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    border: "1px solid #FCA5A5"
                  }}>
                    <FaInfoCircle />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Form Fields Based on Mode & Active Role */}
                {mode === "register" ? (
                  /* REGISTRATION FORM FIELDS */
                  activeRole === "admin" ? (
                    /* Admin Registration Fields */
                    <>
                      <div className="form-group">
                        <label>Officer Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Officer Rajesh Verma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Officer Employee ID *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. OFFICER-1042"
                          value={formData.officerId}
                          onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Govt Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="e.g. rajesh.verma@civicpulse.gov.in"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Mobile Number *</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="e.g. 9876543210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Assigned Department *</label>
                        <select
                          className="form-control"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                          <option value="Roads & Traffic Infrastructure">Roads &amp; Traffic Infrastructure</option>
                          <option value="Water Supply & Sanitation Department">Water Supply &amp; Drainage</option>
                          <option value="Electrical Works Department">Electricity &amp; Power Grid</option>
                          <option value="Municipal Solid Waste Division">Sanitation &amp; Waste Management</option>
                          <option value="General Municipal Command Center">General Municipal Command Center</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Admin Security Password / PIN *</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    /* Citizen Registration Fields */
                    <>
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="e.g. citizen@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Mobile Number *</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="e.g. 9876543210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )
                ) : (
                  /* LOGIN FORM FIELDS */
                  activeRole === "admin" ? (
                    /* Admin Login Fields */
                    <>
                      <div className="form-group">
                        <label>Officer Employee ID / Govt Email *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. OFFICER-1042 or rajesh.verma@civicpulse.gov.in"
                          value={formData.officerId}
                          onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Municipal Department *</label>
                        <select
                          className="form-control"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                          <option value="Roads & Traffic Infrastructure">Roads &amp; Traffic Infrastructure</option>
                          <option value="Water Supply & Sanitation Department">Water Supply &amp; Drainage</option>
                          <option value="Electrical Works Department">Electricity &amp; Power Grid</option>
                          <option value="Municipal Solid Waste Division">Sanitation &amp; Waste Management</option>
                          <option value="General Municipal Command Center">General Municipal Command Center</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Admin Security PIN / Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    /* Citizen Login Fields */
                    <>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="e.g. citizen@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`modal-btn-submit ${activeRole === "admin" ? "admin-btn" : ""}`}
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : mode === "login" ? (
                    activeRole === "admin" ? (
                      "Sign In to Admin Portal"
                    ) : (
                      "Sign In as Citizen"
                    )
                  ) : activeRole === "admin" ? (
                    "Register Admin Account"
                  ) : (
                    "Create Citizen Account"
                  )}
                </button>

                {/* Bottom Toggle Footer */}
                <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <span
                        style={{ color: "var(--primary-blue)", fontWeight: "700", cursor: "pointer" }}
                        onClick={() => setMode("register")}
                      >
                        Register Now
                      </span>
                    </>
                  ) : (
                    <>
                      Already registered?{" "}
                      <span
                        style={{ color: "var(--primary-blue)", fontWeight: "700", cursor: "pointer" }}
                        onClick={() => setMode("login")}
                      >
                        Login Here
                      </span>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

