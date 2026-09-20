import React from "react";
import { FaRoad, FaTint, FaBolt, FaBroom, FaExclamationTriangle, FaRoute, FaSearchLocation, FaCheckDouble } from "react-icons/fa";
import "../styles/about.css";

export default function About() {
  const coveredIssues = [
    { name: "Road Damage & Potholes", icon: <FaRoad /> },
    { name: "Water Leakage & Supply", icon: <FaTint /> },
    { name: "Electricity & Streetlights", icon: <FaBolt /> },
    { name: "Sanitation & Garbage Clear", icon: <FaBroom /> },
    { name: "Other Public Complaints", icon: <FaExclamationTriangle /> },
  ];

  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        <div className="about-grid">
          {/* Left Column Text */}
          <div className="about-content-left">
            <div className="section-badge">About CivicPulse</div>
            
            <h2 className="about-heading">
              Empowering Citizens for <span>Cleaner, Safer & Smarter</span> Cities.
            </h2>

            <p className="about-lead">
              CivicPulse is a unified digital governance framework designed to eliminate bureaucracy in public issue resolution. We bridge the gap between citizens and municipal authorities through intelligent automation and transparent tracking.
            </p>

            <div className="issues-highlight-title">Reportable Civic Issues Include:</div>
            
            <div className="issues-tags-grid">
              {coveredIssues.map((issue, idx) => (
                <div className="issue-tag" key={idx}>
                  <span className="issue-tag-icon">{issue.icon}</span>
                  <span>{issue.name}</span>
                </div>
              ))}
            </div>

            <div className="about-banner-card">
              <FaCheckDouble className="about-banner-icon" />
              <div className="about-banner-text">
                <p>Guaranteed Department Accountability</p>
                <span>Every submitted complaint generates a unique tracking ID and is assigned strict resolution SLAs.</span>
              </div>
            </div>
          </div>

          {/* Right Column Feature Box Stack */}
          <div className="about-cards-right">
            <div className="about-feature-box">
              <div className="feature-box-icon">
                <FaRoute />
              </div>
              <div>
                <h3 className="feature-box-title">Automated Department Routing</h3>
                <p className="feature-box-desc">
                  Advanced category classification automatically routes your complaint directly to the responsible municipal engineer or department officer without manual intervention.
                </p>
              </div>
            </div>

            <div className="about-feature-box">
              <div className="feature-box-icon green-icon">
                <FaSearchLocation />
              </div>
              <div>
                <h3 className="feature-box-title">Real-Time Geo & SLA Tracking</h3>
                <p className="feature-box-desc">
                  Monitor every stage of your ticket—from acknowledgment and site inspection to resolution verification with photo proof.
                </p>
              </div>
            </div>

            <div className="about-feature-box">
              <div className="feature-box-icon">
                <FaCheckDouble />
              </div>
              <div>
                <h3 className="feature-box-title">Citizen-Centric Feedback</h3>
                <p className="feature-box-desc">
                  Complaints are only closed when you confirm satisfaction with the work done. Rate officer responsiveness directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}