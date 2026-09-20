import React from "react";
import {
  FaTimes,
  FaPrint,
  FaCheckCircle,
  FaBuilding,
  FaShieldAlt,
  FaQrcode,
  FaFileInvoice,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaTag,
  FaDownload
} from "react-icons/fa";
import { generateComplaintReceiptPDF } from "../../lib/pdfGenerator";

export default function ReceiptModal({ complaint, user, onClose }) {
  if (!complaint) return null;

  const id = complaint.id || complaint._id || "CP-000000";
  const formattedId = `CP-2026-${id.toString().slice(-6).toUpperCase()}`;
  const createdDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay receipt-modal-overlay" onClick={onClose}>
      <div
        className="modal-container receipt-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Receipt Card */}
        <div className="printable-receipt-card" id="printable-receipt">
          {/* Official Watermark */}
          <div className="receipt-watermark">CIVIC PULSE</div>

          {/* Receipt Header */}
          <div className="receipt-header">
            <div className="receipt-header-branding">
              <div className="receipt-logo-icon">
                <FaBuilding />
              </div>
              <div>
                <h2 className="receipt-gov-title">CIVIC PULSE MUNICIPAL CORPORATION</h2>
                <p className="receipt-gov-sub">Public Grievance Redressal & Governance Portal</p>
              </div>
            </div>
            <div className="receipt-badge-top">
              <FaShieldAlt /> OFFICIAL ACKNOWLEDGMENT
            </div>
          </div>

          {/* Divider */}
          <div className="receipt-divider-line" />

          {/* Receipt Info Bar */}
          <div className="receipt-meta-grid">
            <div className="meta-box">
              <span className="meta-lbl">Grievance Tracking ID</span>
              <strong className="meta-val tracking-code">{formattedId}</strong>
            </div>

            <div className="meta-box">
              <span className="meta-lbl">Date &amp; Time Filed</span>
              <strong className="meta-val">
                <FaCalendarAlt style={{ marginRight: "4px", fontSize: "0.85rem" }} />
                {createdDate}
              </strong>
            </div>

            <div className="meta-box">
              <span className="meta-lbl">Current Status</span>
              <span className={`receipt-status-pill ${complaint.status || "pending"}`}>
                <FaCheckCircle style={{ marginRight: "4px" }} />
                {(complaint.status || "Pending").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Details Table */}
          <div className="receipt-details-section">
            <h4 className="receipt-sec-heading">Citizen &amp; Complaint Particulars</h4>

            <table className="receipt-table">
              <tbody>
                <tr>
                  <td className="tbl-label">
                    <FaUser className="tbl-icon" /> Citizen Name
                  </td>
                  <td className="tbl-value">{complaint.userName || user?.name || "Registered Citizen"}</td>
                </tr>
                <tr>
                  <td className="tbl-label">
                    <FaTag className="tbl-icon" /> Category / Sector
                  </td>
                  <td className="tbl-value" style={{ textTransform: "capitalize" }}>
                    {complaint.category || "General Municipal"}
                  </td>
                </tr>
                <tr>
                  <td className="tbl-label">
                    <FaMapMarkerAlt className="tbl-icon" /> Location / Ward
                  </td>
                  <td className="tbl-value">{complaint.location || "City Limits"}</td>
                </tr>
                <tr>
                  <td className="tbl-label">Urgency Priority</td>
                  <td className="tbl-value">
                    <span className={`receipt-urgency-tag ${complaint.urgency || "medium"}`}>
                      {(complaint.urgency || "Medium").toUpperCase()}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="tbl-label">Subject Title</td>
                  <td className="tbl-value" style={{ fontWeight: "700" }}>
                    {complaint.title || `${complaint.category || "Civic"} Issue`}
                  </td>
                </tr>
                <tr>
                  <td className="tbl-label">Detailed Description</td>
                  <td className="tbl-value desc-cell">
                    {complaint.description || "Grievance submitted for municipal inspection."}
                  </td>
                </tr>
                {(complaint.image || complaint.imageUrl) && (
                  <tr>
                    <td className="tbl-label">Photo Proof</td>
                    <td className="tbl-value">
                      <div style={{ marginTop: "0.25rem" }}>
                        <img
                          src={complaint.image || complaint.imageUrl}
                          alt="Photo Proof"
                          style={{ maxHeight: "120px", maxWidth: "240px", borderRadius: "6px", border: "1px solid #CBD5E1", objectFit: "contain" }}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* QR Code & Verification Stamp Row */}
          <div className="receipt-footer-row">
            <div className="receipt-qr-wrapper">
              {/* Dynamic SVG QR Code Simulation */}
              <svg
                width="84"
                height="84"
                viewBox="0 0 100 100"
                className="receipt-qr-svg"
              >
                <rect width="100" height="100" fill="#ffffff" />
                {/* Outer corners */}
                <rect x="5" y="5" width="30" height="30" fill="#1E3A8A" />
                <rect x="10" y="10" width="20" height="20" fill="#ffffff" />
                <rect x="15" y="15" width="10" height="10" fill="#1E3A8A" />

                <rect x="65" y="5" width="30" height="30" fill="#1E3A8A" />
                <rect x="70" y="10" width="20" height="20" fill="#ffffff" />
                <rect x="75" y="15" width="10" height="10" fill="#1E3A8A" />

                <rect x="5" y="65" width="30" height="30" fill="#1E3A8A" />
                <rect x="10" y="70" width="20" height="20" fill="#ffffff" />
                <rect x="15" y="75" width="10" height="10" fill="#1E3A8A" />

                {/* Random QR pattern blocks */}
                <rect x="42" y="10" width="10" height="10" fill="#1E3A8A" />
                <rect x="42" y="28" width="10" height="10" fill="#1E3A8A" />
                <rect x="10" y="42" width="10" height="10" fill="#1E3A8A" />
                <rect x="25" y="42" width="12" height="12" fill="#1E3A8A" />
                <rect x="45" y="45" width="14" height="14" fill="#2563EB" />
                <rect x="65" y="42" width="10" height="10" fill="#1E3A8A" />
                <rect x="80" y="42" width="12" height="12" fill="#1E3A8A" />
                <rect x="42" y="65" width="10" height="10" fill="#1E3A8A" />
                <rect x="65" y="65" width="12" height="12" fill="#1E3A8A" />
                <rect x="80" y="80" width="15" height="15" fill="#1E3A8A" />
              </svg>
              <div className="receipt-qr-text">
                <span>Scan to Verify</span>
                <small>civicpulse.gov/track</small>
              </div>
            </div>

            <div className="receipt-stamp-box">
              <div className="official-stamp-circle">
                <span className="stamp-top">CIVIC PULSE</span>
                <span className="stamp-center">VERIFIED</span>
                <span className="stamp-bottom">MUNICIPAL PORTAL</span>
              </div>
              <p className="stamp-note">Electronically Generated Record. Signature Not Required.</p>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="receipt-bottom-note">
            Municipal Corporation Toll-Free Helpline: 1800-234-CIVIC (2484) | Helpdesk: helpdesk@civicpulse.gov
          </div>
        </div>

        {/* Modal Actions Header Bar */}
        <div className="receipt-modal-actions non-printable">
          <button
            className="btn-print-receipt"
            style={{ backgroundColor: "#0284c7" }}
            onClick={() => generateComplaintReceiptPDF(complaint, user)}
          >
            <FaDownload /> Download PDF Receipt
          </button>
          <button className="btn-print-receipt" onClick={handlePrint}>
            <FaPrint /> Print / Save as PDF
          </button>
          <button className="btn-close-receipt" onClick={onClose}>
            <FaTimes /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
