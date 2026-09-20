import React, { useState, useEffect, useRef } from "react";
import { FaFileInvoice, FaCheckDouble, FaBuilding, FaSmile } from "react-icons/fa";
import "../styles/statistics.css";

export default function Statistics() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    complaints: 0,
    resolved: 0,
    departments: 0,
    satisfaction: 0,
  });

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;

    const targets = {
      complaints: 5000,
      resolved: 4700,
      departments: 40,
      satisfaction: 98,
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        complaints: Math.min(Math.floor(targets.complaints * progress), targets.complaints),
        resolved: Math.min(Math.floor(targets.resolved * progress), targets.resolved),
        departments: Math.min(Math.floor(targets.departments * progress), targets.departments),
        satisfaction: Math.min(Math.floor(targets.satisfaction * progress), targets.satisfaction),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
  };

  return (
    <section ref={sectionRef} className="statistics-section section-padding">
      <div className="stats-bg-pattern"></div>
      
      <div className="container" style={{ position: "relative", zindex: 2 }}>
        <div className="section-header">
          <div className="section-badge">Impact & Metrics</div>
          <h2 className="section-title">
            CivicPulse <span>By The Numbers</span>
          </h2>
          <p className="section-subtitle">
            Delivering measurable governance efficiency across municipal administrative zones.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaFileInvoice />
            </div>
            <div className="stat-number">{counts.complaints}+</div>
            <div className="stat-label">Complaints Submitted</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaCheckDouble />
            </div>
            <div className="stat-number">{counts.resolved}+</div>
            <div className="stat-label">Issues Resolved</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaBuilding />
            </div>
            <div className="stat-number">{counts.departments}+</div>
            <div className="stat-label">Integrated Depts</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaSmile />
            </div>
            <div className="stat-number">{counts.satisfaction}%</div>
            <div className="stat-label">Citizen Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
