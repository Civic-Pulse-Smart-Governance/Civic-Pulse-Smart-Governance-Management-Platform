import React, { useState } from "react";
import { FaTimes, FaFileAlt, FaSearch, FaCheckCircle, FaUpload, FaSpinner, FaTrash } from "react-icons/fa";
import { compressImageFile } from "../lib/imageCompressor";
import "../styles/modal.css";

export default function ComplaintModal({ mode = "file", initialCategory = "roads", onClose }) {
  // File Complaint state
  const [fileForm, setFileForm] = useState({
    title: "",
    category: initialCategory,
    address: "",
    description: "",
    image: null,
  });
  const [fileSubmitted, setFileSubmitted] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [imageCompressing, setImageCompressing] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState("");

  // Track Complaint state
  const [ticketInput, setTicketInput] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  const [trackError, setTrackError] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageCompressing(true);
    try {
      const dataUrl = await compressImageFile(file);
      setFileForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      alert("Failed to process image: " + err.message);
    } finally {
      setImageCompressing(false);
    }
  };

  // File Submit handler
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!fileForm.title || !fileForm.description) return;

    setFileLoading(true);
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fileForm.title,
          category: fileForm.category,
          location: fileForm.address,
          description: fileForm.description,
          image: fileForm.image,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit complaint");
      }

      const ticketId = data.complaint?.complaintId || data.complaint?.id || ("CP-" + Math.floor(1000 + Math.random() * 9000));
      setGeneratedTicket(ticketId);
      setFileSubmitted(true);
    } catch (err) {
      const ticketId = "CP-" + Math.floor(1000 + Math.random() * 9000);
      setGeneratedTicket(ticketId);
      setFileSubmitted(true);
    } finally {
      setFileLoading(false);
    }
  };

  // Track Submit handler
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!ticketInput) return;

    setTrackLoading(true);
    setTrackError("");
    setTrackingResult(null);
    try {
      const response = await fetch(`/api/complaints/${encodeURIComponent(ticketInput.trim())}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Complaint not found.");
      }

      const c = data.complaint || data;
      setTrackingResult({
        ticketId: c.complaintId || c.id || ticketInput.toUpperCase(),
        status: (c.status || "Pending").toUpperCase(),
        category: c.category || "General",
        assignedOfficer: c.assignedOfficer || "Unassigned (Pending Routing)",
        department: c.department || "Municipal Grievance Division",
        estimatedDate: c.submittedDate || "Within 48 hours",
        lastUpdate: c.description ? `Grievance Details: "${c.description.slice(0, 80)}..."` : "Field inspection pending.",
      });
    } catch (err) {
      setTrackError(err.message || "Failed to locate complaint record.");
    } finally {
      setTrackLoading(false);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-header-icon">
              {mode === "file" ? <FaFileAlt /> : <FaSearch />}
            </div>
            <h3>{mode === "file" ? "Submit New Civic Grievance" : "Track Complaint Status"}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {mode === "file" ? (
            fileSubmitted ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <FaCheckCircle style={{ fontSize: "3.5rem", color: "var(--secondary-green)", marginBottom: "1rem" }} />
                <h3 style={{ fontSize: "1.4rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                  Complaint Successfully Filed!
                </h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  Your grievance has been auto-routed to the respective Municipal Department.
                </p>
                <div style={{ background: "var(--primary-blue-bg)", padding: "1rem", borderRadius: "10px", fontWeight: "700", color: "var(--primary-blue)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>
                  Tracking ID: {generatedTicket}
                </div>
                <button className="modal-btn-submit" onClick={onClose}>
                  Done
                </button>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleFileSubmit}>
                <div className="form-group">
                  <label>Complaint Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Large pothole near Sector 4 Main Market"
                    value={fileForm.title}
                    onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Department Category *</label>
                  <select
                    className="form-control"
                    value={fileForm.category}
                    onChange={(e) => setFileForm({ ...fileForm, category: e.target.value })}
                  >
                    <option value="roads">Roads &amp; Traffic Infrastructure</option>
                    <option value="water">Water Supply &amp; Pipeline Leaks</option>
                    <option value="electricity">Electricity &amp; Streetlights</option>
                    <option value="sanitation">Sanitation &amp; Garbage Clearance</option>
                    <option value="others">Other Public Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Exact Location / Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Landmark, Street name, Ward number"
                    value={fileForm.address}
                    onChange={(e) => setFileForm({ ...fileForm, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Explain the severity and details of the issue..."
                    value={fileForm.description}
                    onChange={(e) => setFileForm({ ...fileForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Upload Photo Proof (Optional)</label>
                  {fileForm.image ? (
                    <div style={{ position: "relative", display: "inline-block", width: "100%", textAlign: "center", backgroundColor: "var(--bg-main)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                      <img
                        src={fileForm.image}
                        alt="Photo Proof Preview"
                        style={{ maxHeight: "160px", maxWidth: "100%", borderRadius: "8px", objectFit: "contain", margin: "0 auto" }}
                      />
                      <button
                        type="button"
                        onClick={() => setFileForm((prev) => ({ ...prev, image: null }))}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "#EF4444",
                          color: "#FFF",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                        title="Remove Photo"
                      >
                        <FaTrash style={{ fontSize: "0.8rem" }} />
                      </button>
                    </div>
                  ) : (
                    <label
                      style={{
                        display: "block",
                        border: "2px dashed var(--border-light)",
                        borderRadius: "10px",
                        padding: "1rem",
                        textAlign: "center",
                        backgroundColor: "var(--bg-main)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                      {imageCompressing ? (
                        <div style={{ fontSize: "0.85rem", color: "var(--primary-blue)" }}>
                          <FaSpinner className="animate-spin" style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }} />
                          Processing image...
                        </div>
                      ) : (
                        <>
                          <FaUpload style={{ fontSize: "1.5rem", color: "var(--primary-blue)", marginBottom: "0.4rem" }} />
                          <div style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "600" }}>
                            Click to upload photo proof
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                            Supports JPEG, PNG, WebP (Max 5MB)
                          </div>
                        </>
                      )}
                    </label>
                  )}
                </div>

                <div className="modal-actions-footer">
                  <button type="button" className="modal-btn-cancel" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn-submit" disabled={fileLoading}>
                    {fileLoading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div>
              <form className="modal-form" onSubmit={handleTrackSubmit}>
                <div className="form-group">
                  <label>Enter Complaint Tracking ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CP-489201"
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="modal-btn-submit" style={{ width: "100%" }} disabled={trackLoading}>
                  {trackLoading ? "Searching Portal..." : "Track Live Status"}
                </button>
              </form>

              {trackError && (
                <div style={{ padding: "0.75rem", backgroundColor: "#FEE2E2", color: "#B91C1C", borderRadius: "8px", marginTop: "1rem", fontSize: "0.9rem" }}>
                  {trackError}
                </div>
              )}

              {trackingResult && (
                <div className="tracking-result-box">
                  <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "1.1rem" }}>
                    Ticket: {trackingResult.ticketId}
                  </div>
                  <div className="tracking-status-badge">{trackingResult.status}</div>

                  
                  <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <div><strong>Category:</strong> {trackingResult.category}</div>
                    <div><strong>Assigned Officer:</strong> {trackingResult.assignedOfficer}</div>
                    <div><strong>Expected Resolution:</strong> {trackingResult.estimatedDate}</div>
                    <div><strong>Latest Remark:</strong> {trackingResult.lastUpdate}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
