import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaThList,
  FaThLarge,
  FaDownload,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaCommentDots,
  FaArrowUp,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaSlidersH,
  FaFilter,
  FaExclamationCircle,
  FaFilePdf,
  FaFileInvoice,
  FaGlobeAmericas,
  FaRobot
} from "react-icons/fa";
import ReceiptModal from "./ReceiptModal";
import AiActionAdvisor from "../shared/AiActionAdvisor";
import { analyzeLocationProximity, sortComplaintsByProximity } from "../../services/geoProximityService";

export default function ComplaintsSection({
  complaints = [],
  loading = false,
  user = {},
  onStatusChange,
  onFileNewComplaint
}) {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    urgency: "all"
  });
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedReceiptComplaint, setSelectedReceiptComplaint] = useState(null);
  const [sortByProximity, setSortByProximity] = useState(false);
  const [proximityFilter, setProximityFilter] = useState("all");

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    let list = complaints.filter((item) => {
      const title = item.title || "";
      const cat = item.category || "";
      const loc = item.location || "";
      const id = item.id || item._id || "";
      const searchMatch =
        filters.search === "" ||
        title.toLowerCase().includes(filters.search.toLowerCase()) ||
        cat.toLowerCase().includes(filters.search.toLowerCase()) ||
        loc.toLowerCase().includes(filters.search.toLowerCase()) ||
        id.toString().toLowerCase().includes(filters.search.toLowerCase());

      const statusMatch =
        filters.status === "all" ||
        item.status === filters.status ||
        (filters.status === "in-progress" && item.status === "in progress");

      const categoryMatch =
        filters.category === "all" ||
        cat.toLowerCase() === filters.category.toLowerCase();

      const urgencyMatch =
        filters.urgency === "all" ||
        (item.urgency || "medium").toLowerCase() === filters.urgency.toLowerCase();

      const geo = analyzeLocationProximity(loc);
      let proxMatch = true;
      if (proximityFilter === "local") proxMatch = geo.zone === "local";
      else if (proximityFilter === "maharashtra") proxMatch = geo.isMaharashtra;
      else if (proximityFilter === "interstate") proxMatch = geo.zone === "interstate";
      else if (proximityFilter === "international") proxMatch = geo.isOutsideIndia;

      return searchMatch && statusMatch && categoryMatch && urgencyMatch && proxMatch;
    });

    if (sortByProximity) {
      list = sortComplaintsByProximity(list, true);
    }

    return list;
  }, [complaints, filters, proximityFilter, sortByProximity]);

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      category: "all",
      urgency: "all"
    });
    setProximityFilter("all");
    setSortByProximity(false);
  };

  // Status Badge Colors & Labels
  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return <span className="status-badge resolved"><FaCheckCircle /> Resolved</span>;
      case "in-progress":
      case "in progress":
        return <span className="status-badge in-progress"><FaSlidersH /> In Progress</span>;
      default:
        return <span className="status-badge pending"><FaClock /> Pending</span>;
    }
  };

  // Urgency Icons & Colors
  const getUrgencyBadge = (urgency = "Medium") => {
    const u = urgency.toLowerCase();
    let className = "urgency-pill medium";
    let icon = "🟡";

    if (u === "high" || u === "critical") {
      className = "urgency-pill high";
      icon = "🔴";
    } else if (u === "low") {
      className = "urgency-pill low";
      icon = "🟢";
    }

    return (
      <span className={className}>
        {icon} {urgency} Priority
      </span>
    );
  };

  // Format Relative Days
  const getDaysAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredComplaints.length === 0) {
      alert("No complaints available to export.");
      return;
    }
    const headers = ["ID", "Title", "Category", "Location", "Urgency", "Status", "Date"];
    const rows = filteredComplaints.map((c) => [
      `"${c.id || c._id}"`,
      `"${(c.title || "").replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${(c.location || "").replace(/"/g, '""')}"`,
      `"${c.urgency || "Medium"}"`,
      `"${c.status}"`,
      `"${new Date(c.createdAt || Date.now()).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CivicPulse_Complaints_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredComplaints.map((c) => c.id || c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="complaints-section-wrapper">
      {/* Section Header */}
      <div className="section-title-bar">
        <div>
          <h3>{user.role === "admin" ? "All System Complaints" : "My Complaint Tracking"}</h3>
          <p className="section-subtitle">
            Showing {filteredComplaints.length} of {complaints.length} reports
          </p>
        </div>

        <div className="section-controls-group">
          {/* View Mode Toggle */}
          <div className="view-mode-switch">
            <button
              className={`btn-mode ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <FaThList />
            </button>
            <button
              className={`btn-mode ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <FaThLarge />
            </button>
          </div>

          {/* Export CSV */}
          <button className="btn-export-csv" onClick={handleExportCSV}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="complaints-filter-bar">
        <div className="filter-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, location, category..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-selects-row">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="roads">Roads & Potholes</option>
            <option value="water">Water Supply</option>
            <option value="electricity">Electricity & Lighting</option>
            <option value="garbage">Garbage & Sanitation</option>
            <option value="drainage">Drainage System</option>
          </select>

          <select
            value={filters.urgency}
            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Proximity Filter relative to Maharashtra Admin HQ */}
          <select
            value={proximityFilter}
            onChange={(e) => setProximityFilter(e.target.value)}
            className="filter-select"
            title="Filter by Proximity to Admin in Maharashtra"
          >
            <option value="all">All Distances</option>
            <option value="local">Local Metro (&lt; 50 km)</option>
            <option value="maharashtra">Maharashtra State (&lt; 350 km)</option>
            <option value="interstate">Inter-State India</option>
            <option value="international">🚫 Non-India (Cannot Solve)</option>
          </select>

          {/* Proximity Sort Button */}
          <button
            type="button"
            onClick={() => setSortByProximity((prev) => !prev)}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "8px",
              fontSize: "0.78rem",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: sortByProximity ? "#0284c7" : "#F8FAFC",
              color: sortByProximity ? "#FFF" : "#334155",
              border: sortByProximity ? "1px solid #0284c7" : "1px solid #CBD5E1",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            title="Prioritize nearest complaints relative to Maharashtra Admin HQ"
          >
            <FaMapMarkerAlt /> {sortByProximity ? "Prioritized: Nearest First" : "Prioritize Nearby (Maharashtra)"}
          </button>

          {(filters.search || filters.status !== "all" || filters.category !== "all" || filters.urgency !== "all" || proximityFilter !== "all" || sortByProximity) && (
            <button className="btn-clear-filters" onClick={handleClearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredComplaints.length === 0 && (
        <div className="empty-complaints-card">
          <FaExclamationCircle className="empty-icon" />
          <h4>No complaints found matching your criteria</h4>
          <p>Try adjusting your search query or reset your filters.</p>
          {user.role !== "admin" && (
            <button className="btn-file-new-empty" onClick={onFileNewComplaint}>
              + File a New Complaint
            </button>
          )}
        </div>
      )}

      {/* Complaints List or Grid */}
      <div className={`complaints-cards-container ${viewMode}`}>
        {filteredComplaints.map((c) => {
          const id = c.id || c._id;
          const isExpanded = expandedId === id;
          const isSelected = selectedIds.includes(id);
          const geo = analyzeLocationProximity(c.location);

          return (
            <div
              key={id}
              className={`complaint-item-card ${c.status} ${isExpanded ? "expanded" : ""}`}
            >
              <div className="card-top-row">
                <div className="card-top-left">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOne(id)}
                    className="item-checkbox"
                  />
                  {getStatusBadge(c.status)}
                  {getUrgencyBadge(c.urgency)}
                </div>

                <div className="card-top-right font-xs text-muted">
                  <FaCalendarAlt /> {getDaysAgo(c.createdAt)}
                </div>
              </div>

              <div className="card-main-info">
                <h4 className="complaint-title-text">{c.title || `${c.category?.toUpperCase()} Issue`}</h4>

                <div className="meta-tags-row">
                  <span className="meta-tag">
                    <FaTag /> {c.category}
                  </span>
                  <span className="meta-tag">
                    <FaMapMarkerAlt /> {c.location || "Location not specified"}
                  </span>
                  {geo.isOutsideIndia ? (
                    <span className="meta-tag" style={{ backgroundColor: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", fontWeight: "700" }}>
                      🚫 Non-India (Cannot Solve)
                    </span>
                  ) : (
                    <span className="meta-tag" style={{ backgroundColor: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", fontWeight: "700" }}>
                      📍 {geo.formattedDistance} ({geo.zone === 'local' ? 'Local' : geo.isMaharashtra ? 'MH State' : 'Inter-State'})
                    </span>
                  )}
                  <span className="meta-tag id-tag">#{id.toString().slice(-6)}</span>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="expanded-details-pane fade-in">
                  {/* Non-India Warning Banner */}
                  {geo.isOutsideIndia && (
                    <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #F87171", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "0.75rem", color: "#991B1B" }}>
                      <strong style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                        ⚠️ Outside Indian Municipal Jurisdiction — Cannot Be Solved by Admin
                      </strong>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.78rem", lineHeight: 1.4 }}>
                        This complaint is reported from outside India ("{c.location}"). Indian civic administrative authority does not extend to foreign locations. Local officers cannot resolve this issue.
                      </p>
                    </div>
                  )}

                  <div className="details-section">
                    <h5>Description</h5>
                    <p>{c.description || "No additional description provided."}</p>
                  </div>

                  {(c.image || c.imageUrl) && (
                    <div className="details-section" style={{ marginTop: "0.75rem" }}>
                      <h5 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        📷 Attached Photo Proof
                      </h5>
                      <div style={{ marginTop: "0.4rem", maxWidth: "320px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-light)", backgroundColor: "#FFF" }}>
                        <img
                          src={c.image || c.imageUrl}
                          alt="Complaint Photo Proof"
                          style={{ width: "100%", maxHeight: "200px", objectFit: "contain", cursor: "pointer", display: "block" }}
                          onClick={() => window.open(c.image || c.imageUrl, '_blank')}
                          title="Click to view full size image"
                        />
                      </div>
                    </div>
                  )}

                  <div className="timeline-section">
                    <h5>Resolution Timeline</h5>
                    <ul className="timeline-steps">
                      <li className="step-completed">
                        <span className="step-dot" />
                        <div className="step-info">
                          <strong>Report Submitted</strong>
                          <span>By {c.userName || "Citizen"} on {new Date(c.createdAt || Date.now()).toLocaleString()}</span>
                        </div>
                      </li>

                      <li className={c.status === "in-progress" || c.status === "resolved" ? "step-completed" : "step-pending"}>
                        <span className="step-dot" />
                        <div className="step-info">
                          <strong>Municipal Officer Assigned</strong>
                          <span>Assigned to Department Inspector</span>
                        </div>
                      </li>

                      <li className={c.status === "resolved" ? "step-completed" : "step-pending"}>
                        <span className="step-dot" />
                        <div className="step-info">
                          <strong>Work Completed & Resolved</strong>
                          <span>Grievance verified and closed</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {(c.officerNote || c.resolutionNote) && (
                    <div className="details-section" style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", padding: "0.75rem 1rem", borderRadius: "8px", marginTop: "0.75rem" }}>
                      <h5 style={{ color: "#065F46", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: "700" }}>
                        <FaCheckCircle /> Official Officer Response / Resolution Message
                      </h5>
                      <p style={{ color: "#047857", margin: 0, fontWeight: 500, fontSize: "0.875rem" }}>"{c.officerNote || c.resolutionNote}"</p>
                    </div>
                  )}

                  {/* AI Grievance Action Advisor (Puter.js: 4 Options + Custom Solution) */}
                  <div style={{ marginTop: "1rem" }}>
                    <AiActionAdvisor
                      complaint={c}
                      onApplySolution={async (plan) => {
                        if (onStatusChange) {
                          setUpdatingId(id);
                          await onStatusChange(id, plan.status.toLowerCase(), plan.note);
                          setUpdatingId(null);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Card Actions Footer */}
              <div className="card-action-footer">
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn-toggle-expand"
                    onClick={() => setExpandedId(isExpanded ? null : id)}
                  >
                    {isExpanded ? <>Show Less <FaChevronUp /></> : <>Show Details <FaChevronDown /></>}
                  </button>

                  <button
                    className="btn-action-small receipt-btn"
                    onClick={() => setSelectedReceiptComplaint(c)}
                    title="View Official Receipt & QR Code"
                  >
                    <FaFilePdf /> Official Receipt
                  </button>
                </div>

                {/* Admin Status Dropdown & Receipt Button */}
                <div className="flex items-center gap-2">
                  <button
                    className="btn-action-small receipt cursor-pointer"
                    style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    onClick={() => setSelectedReceiptComplaint(c)}
                  >
                    <FaFilePdf /> Receipt PDF
                  </button>

                  {user.role === "admin" ? (
                    <div className="admin-status-updater">
                      <label className="font-xs">Status: </label>
                      <select
                        value={c.status}
                        disabled={updatingId === id}
                        onChange={async (e) => {
                          setUpdatingId(id);
                          await onStatusChange(id, e.target.value);
                          setUpdatingId(null);
                        }}
                        className="admin-select-status"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  ) : (
                    <div className="user-action-buttons">
                      {c.status !== "resolved" && (
                        <>
                          <button
                            className="btn-action-small follow-up"
                            onClick={() => alert(`Follow-up sent for complaint #${id}`)}
                          >
                            <FaCommentDots /> Follow Up
                          </button>
                          <button
                            className="btn-action-small escalate"
                            onClick={() => alert(`Escalated complaint #${id} to Senior Inspector`)}
                          >
                            <FaArrowUp /> Escalate
                          </button>
                        </>
                      )}
                      {c.status === "resolved" && (
                        <button
                          className="btn-action-small feedback"
                          onClick={() => alert("Thank you! Opening feedback modal...")}
                        >
                          <FaStar /> Give Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Grievance Receipt Modal */}
      {selectedReceiptComplaint && (
        <ReceiptModal
          complaint={selectedReceiptComplaint}
          user={user}
          onClose={() => setSelectedReceiptComplaint(null)}
        />
      )}
    </div>
  );
}

