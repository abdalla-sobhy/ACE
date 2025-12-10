"use client";

import { useEffect } from "react";

export default function ExperiencePage() {
  useEffect(() => {
    // Redirect to the standalone HTML experience
    window.location.href = "/experience.html";
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5efe6",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Loading 3D Experience...</h1>
        <p style={{ color: "#666" }}>Please wait while we prepare your journey</p>
      </div>
    </div>
  );
}
