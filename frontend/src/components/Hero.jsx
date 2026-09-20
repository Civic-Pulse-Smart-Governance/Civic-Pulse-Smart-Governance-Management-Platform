import React from "react";
import { FaFileAlt, FaSearch, FaCheckCircle, FaShieldAlt, FaClock, FaChartLine } from "react-icons/fa";
import "../styles/hero.css";

export default function Hero({ onOpenFileModal, onOpenTrackModal }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-accent"></div>

      <div className="container hero-container">
        {/* Hero Left Content */}
        <div className="hero-left">
          <div className="hero-badge-container">
            <span className="hero-badge-dot"></span>
            Official Citizen Grievance Portal &bull; Smart City Initiative
          </div>

          <h1 className="hero-title">
            Smart Governance <br />
            <span className="gradient-text">Management Platform</span>
          </h1>

          <h2 className="hero-subtitle">
            Connecting Citizens to Government, One Complaint at a Time.
          </h2>

          <p className="hero-description">
            CivicPulse is an advanced digital platform enabling citizens to report urban infrastructural and public service issues directly to municipal departments. Transparent, automated, and real-time.
          </p>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <button
              className="hero-btn-primary"
              onClick={() => onOpenFileModal && onOpenFileModal()}
            >
              <FaFileAlt /> File Complaint
            </button>
            <button
              className="hero-btn-secondary"
              onClick={() => onOpenTrackModal && onOpenTrackModal()}
            >
              <FaSearch /> Track Complaint
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <FaCheckCircle className="trust-icon" /> 100% Transparent
            </div>
            <div className="trust-item">
              <FaShieldAlt className="trust-icon" /> Secure Data Encryption
            </div>
            <div className="trust-item">
              <FaClock className="trust-icon" /> 24/7 Redressal Cell
            </div>
          </div>
        </div>

        {/* Hero Right Graphic */}
        <div className="hero-right">
          <div className="hero-graphic-card">
            {/* SVG Smart Governance Vector Illustration */}
            <div className="graphic-svg-wrapper">
              <svg viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                {/* Background Grid Lines */}
                <path d="M50 300 H450 M50 250 H450 M50 200 H450" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Municipal/Govt Building Center */}
                <rect x="180" y="110" width="140" height="170" rx="8" fill="#1565C0" opacity="0.9" />
                <path d="M160 110 L250 50 L340 110 Z" fill="#0D47A1" />
                
                {/* Columns */}
                <rect x="195" y="130" width="18" height="130" rx="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="225" y="130" width="18" height="130" rx="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="257" y="130" width="18" height="130" rx="4" fill="#FFFFFF" opacity="0.9" />
                <rect x="287" y="130" width="18" height="130" rx="4" fill="#FFFFFF" opacity="0.9" />

                {/* Emblem Roof Circle */}
                <circle cx="250" cy="85" r="14" fill="#2E7D32" />
                <circle cx="250" cy="85" r="8" fill="#FFFFFF" />

                {/* City Skyline Elements */}
                <rect x="80" y="170" width="80" height="110" rx="6" fill="#64748B" opacity="0.4" />
                <rect x="340" y="150" width="75" height="130" rx="6" fill="#64748B" opacity="0.4" />
                <circle cx="100" cy="110" r="25" fill="#E3F2FD" />

                {/* Digital Pulse Waves */}
                <path d="M120 280 C180 240, 220 310, 280 260 C340 210, 380 270, 440 250" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
                <circle cx="280" cy="260" r="7" fill="#2E7D32" />
                <circle cx="440" cy="250" r="7" fill="#1565C0" />
                
                {/* Checkmark Notification Bubble */}
                <g transform="translate(360, 80)">
                  <rect width="90" height="40" rx="10" fill="#2E7D32" />
                  <text x="45" y="24" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">RESOLVED</text>
                </g>
              </svg>
            </div>

            {/* Floating Live Badges */}
            <div className="floating-badge badge-left">
              <div className="badge-icon-box blue">
                <FaClock />
              </div>
              <div>
                <div className="badge-text-title">24/7 Grievance Cell</div>
                <div className="badge-text-sub">Instant Auto Routing</div>
              </div>
            </div>

            <div className="floating-badge badge-right">
              <div className="badge-icon-box green">
                <FaChartLine />
              </div>
              <div>
                <div className="badge-text-title">98% Resolution Rate</div>
                <div className="badge-text-sub">Real-Time SLA Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}