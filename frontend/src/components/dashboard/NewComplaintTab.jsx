import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaPaperPlane, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaTag, FaSlidersH, FaFileAlt, FaCamera, FaUpload, FaTrash, FaSpinner, FaBan, FaSparkles } from "react-icons/fa";
import { compressImageFile } from "../../lib/imageCompressor";
import { analyzeLocationProximity, verifyLocationWithPuterAI } from "../../services/geoProximityService";

export default function NewComplaintTab({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "roads",
    location: "",
    urgency: "Medium",
    description: "",
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [geoAnalysis, setGeoAnalysis] = useState(null);
  const [isAnalyzingGeo, setIsAnalyzingGeo] = useState(false);

  // Puter.js AI Location Verification Hook
  useEffect(() => {
    const loc = formData.location.trim();
    if (!loc) {
      setGeoAnalysis(null);
      setIsAnalyzingGeo(false);
      return;
    }

    const instant = analyzeLocationProximity(loc);
    setGeoAnalysis(instant);

    setIsAnalyzingGeo(true);
    const timer = setTimeout(async () => {
      try {
        const verified = await verifyLocationWithPuterAI(loc);
        if (verified) {
          setGeoAnalysis(verified);
        }
      } catch (err) {
        console.warn("Puter AI location error:", err);
      } finally {
        setIsAnalyzingGeo(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.location]);

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCompressing(true);
    try {
      const dataUrl = await compressImageFile(file);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      setError("Failed to process image: " + err.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (geoAnalysis?.pendingVerification || isAnalyzingGeo) {
      setError("Please wait a moment while the location is being verified on the map.");
      return;
    }

    if (geoAnalysis?.exists === false) {
      setError(
        `Cannot submit complaint: Location "${formData.location}" does not exist on the map. Please verify spelling or enter a valid city or place.`
      );
      return;
    }

    if (geoAnalysis?.isOutsideIndia || geoAnalysis?.canBeSolved === false) {
      setError(
        `Cannot submit complaint: Location "${formData.location}" is identified as outside India (${geoAnalysis.detectedCountry || "International"}). Indian municipal and Maharashtra state administration hold no legal or operational jurisdiction abroad.`
      );
      return;
    }

    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to file complaint.");
      }

      setSuccess(true);
      setFormData({
        title: "",
        category: "roads",
        location: "",
        urgency: "Medium",
        description: "",
        image: null
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-complaint-tab-wrapper fade-in">
      <div className="tab-header-block">
        <h3><FaPlusCircle /> File a New Civic Complaint</h3>
        <p className="section-subtitle">Submit details regarding potholes, water leakage, waste management, or electrical issues.</p>
      </div>

      <div className="new-complaint-card">
        {success && (
          <div className="alert-success-banner mb-4 fade-in">
            <FaCheckCircle /> Complaint submitted successfully! It has been added to the municipal review queue.
          </div>
        )}

        {error && (
          <div className="alert-error-banner mb-4 fade-in">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="complaint-form-grid">
          <div className="form-group-item full-width">
            <label><FaFileAlt /> Issue Title / Summary</label>
            <input
              type="text"
              placeholder="e.g. Broken streetlight on Main Street corner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group-item">
            <label><FaTag /> Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="filter-select"
            >
              <option value="roads">Roads & Potholes</option>
              <option value="water">Water Supply & Leakage</option>
              <option value="electricity">Electricity & Lighting</option>
              <option value="garbage">Garbage & Waste Collection</option>
              <option value="drainage">Drainage & Sewage</option>
              <option value="other">Other Civic Issue</option>
            </select>
          </div>

          <div className="form-group-item">
            <label><FaSlidersH /> Urgency Level</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="filter-select"
            >
              <option value="Low">Low - Minor Inconvenience</option>
              <option value="Medium">Medium - Standard Repair</option>
              <option value="High">High - Urgent Hazard</option>
              <option value="Critical">Critical - Emergency Risk</option>
            </select>
          </div>

          <div className="form-group-item full-width">
            <label><FaMapMarkerAlt /> Specific Location / Address</label>
            <input
              type="text"
              placeholder="e.g. Pune, Mumbai, Dadar, Thane, New Jersey, etc."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            {formData.location && geoAnalysis && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
                {geoAnalysis.pendingVerification || (isAnalyzingGeo && geoAnalysis.exists === null) ? (
                  <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1E40AF", padding: "0.6rem 0.75rem", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FaSpinner className="animate-spin" style={{ color: "#2563EB" }} />
                      <span>Checking if place exists on map and verifying Indian jurisdiction...</span>
                    </div>
                    <span style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8", padding: "0.15rem 0.45rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600" }}>
                      API Verifying
                    </span>
                  </div>
                ) : geoAnalysis.exists === false ? (
                  <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", color: "#92400E", padding: "0.75rem", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <FaExclamationTriangle style={{ marginTop: "0.2rem", flexShrink: 0, fontSize: "1rem", color: "#D97706" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontWeight: "700" }}>
                        <span>⚠️ Place Does Not Exist on Map</span>
                        <span style={{ backgroundColor: "#FEF3C7", color: "#92400E", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.7rem", border: "1px solid #FDE68A" }}>
                          Unrecognized Place
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#78350F", lineHeight: 1.4 }}>
                        Location <strong>"{formData.location}"</strong> could not be verified on the geographic map. Please check the spelling or enter a recognized city or locality.
                      </span>
                    </div>
                  </div>
                ) : geoAnalysis.isOutsideIndia ? (
                  <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "0.75rem", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <FaBan style={{ marginTop: "0.2rem", flexShrink: 0, fontSize: "1rem" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontWeight: "700" }}>
                        <span>🚫 Outside Indian Jurisdiction — Cannot Be Solved by Admin</span>
                        {geoAnalysis.detectedCountry && (
                          <span style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.7rem", border: "1px solid #FCA5A5" }}>
                            {geoAnalysis.detectedCountry}
                          </span>
                        )}
                        <span style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600" }}>
                          API Verified
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#7F1D1D", lineHeight: 1.4 }}>
                        Location <strong>"{formData.location}"</strong> is in {geoAnalysis.detectedCountry || "a foreign country"}. Indian municipal administration holds no jurisdiction abroad and cannot solve international grievances.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", padding: "0.5rem 0.75rem", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ color: "var(--text-main, #334155)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FaMapMarkerAlt style={{ color: "#0284c7" }} />
                      <span>Distance from Maharashtra Admin HQ: <strong>{geoAnalysis.formattedDistance}</strong> ({geoAnalysis.zoneLabel})</span>
                    </div>
                    <span style={{ backgroundColor: "#ECFDF5", color: "#065F46", padding: "0.15rem 0.45rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FaCheckCircle />
                      Verified in India
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group-item full-width">
            <label>Detailed Description</label>
            <textarea
              rows={4}
              placeholder="Provide context, duration of issue, landmark references..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group-item full-width">
            <label><FaCamera /> Upload Photo Proof (Optional)</label>
            {formData.image ? (
              <div style={{ position: "relative", display: "inline-block", width: "100%", textAlign: "center", backgroundColor: "var(--bg-main)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                <img
                  src={formData.image}
                  alt="Photo Proof Preview"
                  style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "8px", objectFit: "contain", margin: "0 auto" }}
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    backgroundColor: "#EF4444",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
                  }}
                  title="Remove Photo"
                >
                  <FaTrash style={{ fontSize: "0.85rem" }} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: "block",
                  border: "2px dashed var(--border-light)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  textAlign: "center",
                  backgroundColor: "#F8FAFC",
                  cursor: "pointer"
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                {compressing ? (
                  <div style={{ fontSize: "0.9rem", color: "var(--primary-blue)" }}>
                    <FaSpinner className="animate-spin" style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }} />
                    Processing image...
                  </div>
                ) : (
                  <>
                    <FaUpload style={{ fontSize: "1.6rem", color: "#0284C7", marginBottom: "0.4rem" }} />
                    <div style={{ fontSize: "0.9rem", color: "#1E293B", fontWeight: "600" }}>
                      Click to upload photo proof of issue
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.2rem" }}>
                      Supports JPEG, PNG, WebP (Max 5MB)
                    </div>
                  </>
                )}
              </label>
            )}
          </div>

          <div className="form-group-item full-width">
            <button type="submit" className="btn-submit-complaint-main" disabled={loading || compressing}>
              {loading ? "Submitting..." : <><FaPaperPlane /> Submit Complaint</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
