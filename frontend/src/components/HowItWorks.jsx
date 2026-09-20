import React from "react";
import { FaUserCheck, FaFileUpload, FaRandom, FaTools, FaSearchLocation, FaCheckCircle, FaStar, FaChevronDown } from "react-icons/fa";
import "../styles/howItWorks.css";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Register",
      desc: "Create your citizen profile using mobile or Aadhaar.",
      icon: <FaUserCheck />,
    },
    {
      num: "02",
      title: "Submit Complaint",
      desc: "Upload photo, location & details of the issue.",
      icon: <FaFileUpload />,
    },
    {
      num: "03",
      title: "Auto Routing",
      desc: "AI-driven system assigns ticket to correct ward officer.",
      icon: <FaRandom />,
    },
    {
      num: "04",
      title: "Department Action",
      desc: "Municipal team inspects site and executes repairs.",
      icon: <FaTools />,
    },
    {
      num: "05",
      title: "Track Status",
      desc: "Monitor real-time progress updates via SMS & Portal.",
      icon: <FaSearchLocation />,
    },
    {
      num: "06",
      title: "Issue Resolved",
      desc: "Work completed & proof image uploaded by officer.",
      icon: <FaCheckCircle />,
    },
    {
      num: "07",
      title: "Citizen Feedback",
      desc: "Verify resolution & rate service quality.",
      icon: <FaStar />,
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Simple Process</div>
          <h2 className="section-title">
            How <span>CivicPulse</span> Works
          </h2>
          <p className="section-subtitle">
            A seamless 7-step digital lifecycle ensuring swift resolution and full transparency.
          </p>
        </div>

        <div className="timeline-wrapper">
          {/* Connecting line for desktop */}
          <div className="timeline-line"></div>

          <div className="timeline-grid">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="timeline-step">
                  <div className="step-circle">
                    {step.icon}
                    <span className="step-number">{step.num}</span>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="step-arrow-mobile">
                    <FaChevronDown />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
