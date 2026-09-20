import React from "react";
import AuthModal from "../components/AuthModal";

export default function Login() {
  return (
    <div style={{ backgroundColor: "#F5F7FA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AuthModal initialMode="login" onClose={() => window.location.href = "/"} />
    </div>
  );
}
