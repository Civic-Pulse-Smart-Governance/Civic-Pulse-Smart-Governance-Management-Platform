import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaClock,
  FaSlidersH,
  FaCheckCircle,
  FaHourglassHalf,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle
} from "react-icons/fa";

function AnimatedCount({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const incrementTime = Math.max(10, Math.floor(duration / (end || 1)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{typeof value === "number" && !Number.isInteger(value) ? value.toFixed(1) : count}</>;
}

export default function MetricsGrid({ complaints = [], loading = false, onFilterByStatus }) {
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "in-progress" || c.status === "in progress"
  ).length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
  const isHighPending = pending > 5;

  const metrics = [
    {
      id: "total",
      title: "Total Complaints",
      value: total,
      icon: <FaFileAlt />,
      color: "#6C63FF",
      bgColor: "rgba(108, 99, 255, 0.1)",
      trend: "+12%",
      trendUp: true,
      filter: "all"
    },
    {
      id: "pending",
      title: "Pending Review",
      value: pending,
      icon: <FaClock className={isHighPending ? "pulse-icon" : ""} />,
      color: "#FFB74D",
      bgColor: "rgba(255, 183, 77, 0.1)",
      trend: isHighPending ? "High" : "-5%",
      trendUp: false,
      urgent: isHighPending,
      filter: "pending"
    },
    {
      id: "inProgress",
      title: "In Progress",
      value: inProgress,
      icon: <FaSlidersH />,
      color: "#4FC3F7",
      bgColor: "rgba(79, 195, 247, 0.1)",
      trend: "+8%",
      trendUp: true,
      filter: "in-progress"
    },
    {
      id: "resolved",
      title: "Resolved Issues",
      value: resolved,
      icon: <FaCheckCircle />,
      color: "#81C784",
      bgColor: "rgba(129, 199, 132, 0.1)",
      trend: `+${resolutionRate}%`,
      trendUp: true,
      progress: parseFloat(resolutionRate),
      filter: "resolved"
    },
    {
      id: "avgTime",
      title: "Avg Resolution Time",
      value: 18.5,
      suffix: " hrs",
      icon: <FaHourglassHalf />,
      color: "#FF8A65",
      bgColor: "rgba(255, 138, 101, 0.1)",
      trend: "-2.4h",
      trendUp: true
    },
    {
      id: "satisfaction",
      title: "Satisfaction Rate",
      value: 4.8,
      suffix: " / 5.0",
      icon: <FaStar />,
      color: "#FFD54F",
      bgColor: "rgba(255, 213, 79, 0.1)",
      trend: "↑ 96%",
      trendUp: true
    }
  ];

  if (loading) {
    return (
      <div className="metrics-cards-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="metric-card skeleton-card">
            <div className="skeleton-line circle" />
            <div className="skeleton-line title" />
            <div className="skeleton-line value" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="metrics-cards-grid">
      {metrics.map((m) => (
        <div
          key={m.id}
          className={`metric-card ${m.urgent ? "urgent-card" : ""}`}
          style={{ "--card-accent": m.color }}
          onClick={() => m.filter && onFilterByStatus && onFilterByStatus(m.filter)}
          role="button"
          tabIndex={0}
        >
          <div className="metric-card-header">
            <div className="metric-icon-box" style={{ background: m.bgColor, color: m.color }}>
              {m.icon}
            </div>
            {m.trend && (
              <span className={`trend-pill ${m.trendUp ? "positive" : "warning"}`}>
                {m.trendUp ? <FaArrowUp /> : <FaArrowDown />} {m.trend}
              </span>
            )}
          </div>

          <div className="metric-card-body">
            <h3 className="metric-value font-inter">
              <AnimatedCount value={m.value} />
              {m.suffix || ""}
            </h3>
            <p className="metric-title">{m.title}</p>

            {typeof m.progress === "number" && (
              <div className="metric-progress-wrapper">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${m.progress}%`, background: m.color }}
                  />
                </div>
                <span className="progress-label">{m.progress}% resolved</span>
              </div>
            )}

            {m.urgent && (
              <div className="urgent-badge-pill">
                <FaExclamationTriangle /> High Priority Queue
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
