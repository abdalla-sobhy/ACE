"use client";

import { useEffect } from "react";

export default function ExperiencePage() {
  useEffect(() => {
    // Redirect to the static HTML experience page
    window.location.href = "/experience.html";
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5efe6'
    }}>
      <p>Redirecting to experience...</p>
    </div>
  );
}
