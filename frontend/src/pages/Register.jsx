import React from "react";
import AuthModal from "../components/AuthModal";

export default function Register() {
  return (
    <div style={{ backgroundColor: "#F5F7FA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AuthModal initialMode="register" onClose={() => window.location.href = "/"} />
    </div>
  );
}
