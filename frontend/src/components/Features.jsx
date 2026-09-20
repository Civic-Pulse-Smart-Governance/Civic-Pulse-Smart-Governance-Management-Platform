import React from "react";
import { FaLock, FaCamera, FaSearchPlus, FaProjectDiagram, FaBell, FaComments, FaCheck } from "react-icons/fa";
import "../styles/features.css";

export default function Features() {
  const featureList = [
    {
      id: 1,
      title: "Secure Login",
      description: "Encrypted authentication supporting OTP login, biometric access, and role-based citizen dashboard.",
      icon: <FaLock />,
      accent: "",
    },
    {
      id: 2,
      title: "Image & Geo Upload",
      description: "Attach geo-tagged high-res photos to pinpoint exact grievance locations on municipal GIS maps.",
      icon: <FaCamera />,
      accent: "green-accent",
    },
    {
      id: 3,
      title: "Complaint Tracking",
      description: "Live status timelines with unique tracking IDs, officer assignments, and estimated resolution dates.",
      icon: <FaSearchPlus />,
      accent: "",
    },
    {
      id: 4,
      title: "Auto Department Routing",
      description: "Intelligent rule-engine that assigns tickets instantly to relevant engineers based on location & category.",
      icon: <FaProjectDiagram />,
      accent: "green-accent",
    },
    {
      id: 5,
      title: "Email & SMS Notifications",
      description: "Automated real-time alert triggers at every status change from submission to final resolution.",
      icon: <FaBell />,
      accent: "",
    },
    {
      id: 6,
      title: "Citizen Feedback System",
      description: "Rate municipal officer responsiveness, upload audit photos, or request re-investigation if unsatisfied.",
      icon: <FaComments />,
      accent: "green-accent",
    },
  ];

  return (
    <section id="features" className="features-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">System Capabilities</div>
          <h2 className="section-title">
            Key <span>Platform Features</span>
          </h2>
          <p className="section-subtitle">
            Engineered with modern web architecture ready for enterprise Spring Boot REST API integration.
          </p>
        </div>

        <div className="features-grid">
          {featureList.map((feat) => (
            <div key={feat.id} className={`feature-card ${feat.accent}`}>
              <div className="feature-header">
                <div className="feature-icon-box">{feat.icon}</div>
                <h3 className="feature-card-title">{feat.title}</h3>
              </div>
              <p className="feature-card-desc">{feat.description}</p>
              <div className="feature-badge-subtle">
                <FaCheck /> Enterprise Ready
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}