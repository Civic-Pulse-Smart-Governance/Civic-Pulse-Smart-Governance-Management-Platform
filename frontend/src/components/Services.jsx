import React from "react";
import { FaRoad, FaTint, FaBolt, FaBroom, FaEllipsisH, FaArrowRight } from "react-icons/fa";
import "../styles/services.css";

export default function Services({ onOpenFileModal }) {
  const categories = [
    {
      id: "roads",
      title: "Roads & Traffic",
      description: "Report potholes, broken pavements, illegal blockages, and traffic light outages.",
      icon: <FaRoad />,
      colorClass: "",
    },
    {
      id: "water",
      title: "Water Supply",
      description: "Report pipeline leaks, low water pressure, contaminated water, or missing meters.",
      icon: <FaTint />,
      colorClass: "green-accent",
    },
    {
      id: "electricity",
      title: "Electricity",
      description: "Report street light failures, hazardous open wire transformers, and power fluctuations.",
      icon: <FaBolt />,
      colorClass: "",
    },
    {
      id: "sanitation",
      title: "Sanitation",
      description: "Report uncollected garbage, overflowing public dustbins, and blocked drainages.",
      icon: <FaBroom />,
      colorClass: "green-accent",
    },
    {
      id: "others",
      title: "Others",
      description: "Report public park maintenance, stray animals, noise pollution, and civic issues.",
      icon: <FaEllipsisH />,
      colorClass: "",
    },
  ];

  return (
    <section id="services" className="services-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Grievance Categories</div>
          <h2 className="section-title">
            Select Issue <span>Category</span>
          </h2>
          <p className="section-subtitle">
            Choose from five major civic service divisions to initiate immediate automated routing.
          </p>
        </div>

        <div className="services-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`service-card ${cat.colorClass}`}
              onClick={() => onOpenFileModal && onOpenFileModal(cat.id)}
            >
              <div className="service-icon-wrapper">{cat.icon}</div>
              <h3 className="service-title">{cat.title}</h3>
              <p className="service-description">{cat.description}</p>
              <button className="service-action-btn">
                Report Issue <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
