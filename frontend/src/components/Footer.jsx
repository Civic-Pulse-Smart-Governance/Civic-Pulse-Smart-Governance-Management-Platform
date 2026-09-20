import React from "react";
import { FaBuilding, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaChevronRight } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FaBuilding />
              </div>
              <span className="footer-logo-text">CivicPulse</span>
            </div>

            <p className="footer-tagline">
              Connecting Citizens to Government, One Complaint at a Time. Transparent, automated, and responsive municipal governance.
            </p>

            <div className="footer-gov-tag">
              Final Year Project &bull; Smart Governance System
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#home" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Home
                </a>
              </li>
              <li>
                <a href="#about" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> About Us
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Categories
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Key Features
                </a>
              </li>
            </ul>
          </div>

          {/* Governance Portals */}
          <div>
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#services" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Road Repairs
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Water Supply Leaks
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Streetlight Outages
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Garbage Clearance
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  <FaChevronRight style={{ fontSize: "0.7rem" }} /> Emergency Helpline
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div>
            <h4 className="footer-col-title">Connect With Us</h4>
            <p style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              Follow civic updates and official municipal announcements.
            </p>
            <div className="social-icons-wrapper">
              <a href="#social" className="social-icon-btn" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#social" className="social-icon-btn" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#social" className="social-icon-btn" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#social" className="social-icon-btn" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} CivicPulse Smart Governance Portal. All Rights Reserved.
          </div>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms &amp; Conditions</a>
            <a href="#accessibility">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}