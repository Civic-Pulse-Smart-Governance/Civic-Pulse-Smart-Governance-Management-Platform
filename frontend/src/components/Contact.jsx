import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaHeadset } from "react-icons/fa";
import "../styles/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulated Spring Boot REST API Integration Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Get In Touch</div>
          <h2 className="section-title">
            Helpdesk & <span>Support Center</span>
          </h2>
          <p className="section-subtitle">
            Have questions or need assistance? Reach out to our 24/7 Citizen Governance Cell.
          </p>
        </div>

        <div className="contact-layout">
          {/* Left Side Info Card */}
          <div className="contact-info-card">
            <div className="info-card-header">
              <h3 className="info-card-title">Contact Information</h3>
              <p className="info-card-subtitle">
                Official grievance escalation office for municipal ward inquiries and administrative support.
              </p>
            </div>

            <div className="contact-details-list">
              <div className="contact-item">
                <div className="contact-icon-box">
                  <FaEnvelope />
                </div>
                <div className="contact-text-box">
                  <h4>Official Email</h4>
                  <p>support@civicpulse.gov.in</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">
                  <FaPhoneAlt />
                </div>
                <div className="contact-text-box">
                  <h4>Toll-Free Helpline</h4>
                  <p>1800-112-CIVIC (24842)</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-text-box">
                  <h4>Headquarters Address</h4>
                  <p>Municipal Corporation HQ, Smart Governance Complex, Block-C, City Center</p>
                </div>
              </div>
            </div>

            {/* Helpline Badge */}
            <div className="contact-helpline-box">
              <FaHeadset className="helpline-badge-icon" />
              <div className="helpline-text">
                <strong>Emergency Civic Line: 1077</strong>
                <span>Available 24/7 for severe water leaks & power line hazards</span>
              </div>
            </div>
          </div>

          {/* Right Side Form Card */}
          <div className="contact-form-card">
            <div className="form-header">
              <h3 className="form-title">Send Us a Message</h3>
              <p className="form-subtitle">Fill out the form below and an administrative officer will respond within 24 hours.</p>
            </div>

            {submitted ? (
              <div className="form-alert-success">
                <FaCheckCircle style={{ fontSize: "1.2rem" }} />
                <span>Thank you! Your inquiry has been received. Ticket ID: #CP-INQ-9482</span>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message / Inquiry *</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="Describe your query or feedback..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}