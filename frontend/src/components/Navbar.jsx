import React, { useState, useEffect } from "react";
import { FaBuilding, FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaChevronRight } from "react-icons/fa";
import "../styles/navbar.css";

export default function Navbar({ onOpenAuth, onOpenFileModal, onOpenTrackModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#home" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-badge">
            <FaBuilding />
          </div>
          <div className="logo-text">
            <span className="logo-title">CivicPulse</span>
            <span className="logo-subtitle">Smart Governance Portal</span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className={`nav-menu ${mobileMenuOpen ? "open" : ""}`}>
          <a
            href="#home"
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            onClick={() => { setActiveSection("home"); closeMenu(); }}
          >
            Home
          </a>
          <a
            href="#about"
            className={`nav-link ${activeSection === "about" ? "active" : ""}`}
            onClick={() => { setActiveSection("about"); closeMenu(); }}
          >
            About
          </a>
          <a
            href="#how-it-works"
            className={`nav-link ${activeSection === "how-it-works" ? "active" : ""}`}
            onClick={() => { setActiveSection("how-it-works"); closeMenu(); }}
          >
            How It Works
          </a>
          <a
            href="#features"
            className={`nav-link ${activeSection === "features" ? "active" : ""}`}
            onClick={() => { setActiveSection("features"); closeMenu(); }}
          >
            Features
          </a>

          {/* Mobile CTA Buttons */}
          <div className="mobile-actions">
            <button
              className="btn-nav-login"
              onClick={() => { onOpenAuth && onOpenAuth("login"); closeMenu(); }}
            >
              <FaSignInAlt /> Login
            </button>
            <button
              className="btn-nav-register"
              onClick={() => { onOpenAuth && onOpenAuth("register"); closeMenu(); }}
            >
              <FaUserPlus /> Register
            </button>
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="navbar-actions">
          <button
            className="btn-nav-login"
            onClick={() => onOpenAuth && onOpenAuth("login")}
          >
            <FaSignInAlt /> Login
          </button>
          <button
            className="btn-nav-register"
            onClick={() => onOpenAuth && onOpenAuth("register")}
          >
            <FaUserPlus /> Register
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}