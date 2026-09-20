import React, { useState } from "react";
import { FaTrophy, FaStar, FaMedal, FaLock, FaCheckCircle, FaFire, FaTimes } from "react-icons/fa";

export default function AchievementsTab({ complaints = [] }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const totalSubmitted = complaints.length;
  const totalResolved = complaints.filter((c) => c.status === "resolved").length;

  // Points & Level Calculation
  const points = totalSubmitted * 20 + totalResolved * 50 + 150; // base welcome bonus
  const level = Math.floor(points / 100) + 1;
  const pointsToNextLevel = 100 - (points % 100);
  const progressPct = (points % 100);

  const badgeCategories = [
    {
      id: "submission",
      title: "Complaint Submitter Badges",
      icon: "📝",
      badges: [
        { id: "sub1", name: "First Civic Report", icon: "🌟", desc: "Submitted your first municipal complaint.", condition: "1 report submitted", unlocked: totalSubmitted >= 1 },
        { id: "sub5", name: "Active Reporter", icon: "📋", desc: "Submitted 5 municipal reports.", condition: "5 reports submitted", unlocked: totalSubmitted >= 5 },
        { id: "sub10", name: "Community Pillar", icon: "🔥", desc: "Submitted 10 municipal reports.", condition: "10 reports submitted", unlocked: totalSubmitted >= 10 }
      ]
    },
    {
      id: "resolution",
      title: "Resolution Champion",
      icon: "✅",
      badges: [
        { id: "res1", name: "First Resolution", icon: "🎉", desc: "Got your first complaint resolved by officers.", condition: "1 issue resolved", unlocked: totalResolved >= 1 },
        { id: "res5", name: "Problem Solver", icon: "🏅", desc: "5 complaints resolved successfully.", condition: "5 issues resolved", unlocked: totalResolved >= 5 },
        { id: "res10", name: "Master Solver", icon: "👑", desc: "10 complaints resolved successfully.", condition: "10 issues resolved", unlocked: totalResolved >= 10 }
      ]
    },
    {
      id: "special",
      title: "Special & Speed Badges",
      icon: "🎯",
      badges: [
        { id: "speed", name: "Speed Demon", icon: "⚡", desc: "Had an issue resolved within 24 hours.", condition: "< 24h resolution time", unlocked: true },
        { id: "feedback", name: "Feedback Hero", icon: "💬", desc: "Provided feedback on a resolved complaint.", condition: "1 feedback provided", unlocked: true },
        { id: "early", name: "Early Bird", icon: "🌅", desc: "Submitted a report before 8:00 AM.", condition: "Submit before 8 AM", unlocked: false }
      ]
    }
  ];

  return (
    <div className="achievements-tab-wrapper fade-in">
      {/* Top Banner: Level & Points */}
      <div className="achievements-level-banner">
        <div className="level-circle-box">
          <div className="level-number font-inter">{level}</div>
          <span className="level-label">LEVEL</span>
        </div>

        <div className="points-info-box">
          <h3 className="font-inter">{points} Points Earned</h3>
          <p className="font-xs text-muted mb-2">Keep submitting & tracking grievances to earn citizen rank badges!</p>

          <div className="level-progress-bar-bg">
            <div className="level-progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="font-xs text-muted mt-1 block">{pointsToNextLevel} points to Level {level + 1}</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="badge-categories-container">
        {badgeCategories.map((cat) => (
          <div key={cat.id} className="badge-category-card">
            <h4 className="category-header">
              <span className="cat-icon">{cat.icon}</span> {cat.title}
            </h4>

            <div className="badges-grid font-inter">
              {cat.badges.map((b) => (
                <div
                  key={b.id}
                  className={`badge-item-card ${b.unlocked ? "unlocked" : "locked"}`}
                  onClick={() => setSelectedBadge(b)}
                >
                  <div className="badge-icon-wrap">
                    {b.unlocked ? b.icon : <FaLock className="lock-icon" />}
                  </div>
                  <h5 className="badge-name">{b.name}</h5>
                  <p className="badge-desc font-xs">{b.desc}</p>
                  {b.unlocked ? (
                    <span className="unlocked-pill"><FaCheckCircle /> Unlocked</span>
                  ) : (
                    <span className="locked-pill">{b.condition}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup for Selected Badge */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal-content fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="badge-modal-close" onClick={() => setSelectedBadge(null)}>
              <FaTimes />
            </button>
            <div className="modal-badge-icon">{selectedBadge.icon}</div>
            <h3>{selectedBadge.name}</h3>
            <p className="modal-badge-desc">{selectedBadge.desc}</p>
            <div className="modal-badge-status">
              {selectedBadge.unlocked ? (
                <span className="status-unlocked"><FaCheckCircle /> Badge Unlocked!</span>
              ) : (
                <span className="status-locked"><FaLock /> Unlock Condition: {selectedBadge.condition}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
