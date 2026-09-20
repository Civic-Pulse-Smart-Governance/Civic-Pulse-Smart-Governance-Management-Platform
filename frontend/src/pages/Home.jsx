import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Statistics from "../components/Statistics";
import Footer from "../components/Footer";

import ComplaintModal from "../components/ComplaintModal";
import AuthModal from "../components/AuthModal";

export default function Home({ onLoginSuccess }) {
  const navigate = useNavigate();
  // Modal states
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintMode, setComplaintMode] = useState("file"); // "file" or "track"
  const [selectedCategory, setSelectedCategory] = useState("roads");

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  const handleOpenFileModal = (category = "roads") => {
    setComplaintMode("file");
    setSelectedCategory(category);
    setComplaintModalOpen(true);
  };

  const handleOpenTrackModal = () => {
    setComplaintMode("track");
    setComplaintModalOpen(true);
  };

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleDefaultLoginSuccess = (user, token) => {
    if (token) {
      localStorage.setItem('civicpulse_token', token);
      localStorage.setItem('token', token);
    }
    if (user) {
      localStorage.setItem('civicpulse_user', JSON.stringify(user));
    }
    
    if (onLoginSuccess) {
      onLoginSuccess(user, token);
    } else {
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    }
  };


  return (
    <div className="home-page-wrapper">
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenFileModal={handleOpenFileModal}
        onOpenTrackModal={handleOpenTrackModal}
      />

      {/* 2. Hero Section */}
      <Hero
        onOpenFileModal={handleOpenFileModal}
        onOpenTrackModal={handleOpenTrackModal}
      />

      {/* 3. About CivicPulse */}
      <About />

      {/* 4. How CivicPulse Works */}
      <HowItWorks />

      {/* 5. Key Features */}
      <Features />

      {/* 6. Statistics Section */}
      <Statistics />

      {/* 7. Footer */}
      <Footer />

      {/* Modals */}
      {complaintModalOpen && (
        <ComplaintModal
          mode={complaintMode}
          initialCategory={selectedCategory}
          onClose={() => setComplaintModalOpen(false)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleDefaultLoginSuccess}
        />
      )}

    </div>
  );
}