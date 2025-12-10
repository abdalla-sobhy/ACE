"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ExperiencePage() {
  useEffect(() => {
    // Disable sound errors
    window.addEventListener('error', function(e: ErrorEvent) {
      if (e.message && (e.message.includes('sound') || e.message.includes('.mp3'))) {
        e.preventDefault();
        console.log('Sound file not found - continuing without audio');
      }
    }, true);

    // Override Howler to prevent sound errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Howler = (window as any).Howler || {
      mute: function() {},
      volume: function() {},
      ctx: { createGain: function() { return { connect: function() {}, gain: { value: 1 } }; } }
    };

    // Load the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/index.css';
    document.head.appendChild(link);

    // Wait for canvas to be in DOM, then load the Three.js experience script
    const canvas = document.getElementById('main-canvas');
    if (canvas) {
      const script = document.createElement('script');
      script.src = '/index.js';
      script.type = 'module';
      script.async = false;
      script.onload = () => {
        console.log('Three.js experience loaded');
      };
      script.onerror = (error) => {
        console.error('Failed to load Three.js experience:', error);
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Back to Home Button */}
      <Link href="/" style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1001,
        background: 'rgba(255, 146, 62, 0.9)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '25px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 15px rgba(255, 146, 62, 0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        ← Back to Home
      </Link>

      {/* Main Canvas */}
      <canvas id="main-canvas"></canvas>

      {/* Intro Container */}
      <div id="intro-container" className="center column" style={{ display: 'none' }}>
        <h1 style={{ opacity: 0 }}>Welcome</h1>
      </div>

      {/* Overlay Container */}
      <div id="overlay-container">
        {/* Header Container */}
        <div id="header-container" className="content-width row">
          <div id="logo-click-container"></div>
          <div id="sound-button" className="overlay-button center">
            <div id="sound-button-scale-container"></div>
          </div>
          <div id="menu-button" className="overlay-button center pointer">
            <div id="menu-button-scale-container">
              <div className="menu-button-bar"></div>
              <div className="menu-button-bar"></div>
              <div className="menu-button-bar"></div>
            </div>
          </div>
        </div>

        {/* Landing Page */}
        <div id="landing-page" className="content-container">
          <section id="landing-page-section" className="content-width"></section>
        </div>

        {/* About Section */}
        <section id="about-section" className="content-container">
          <div id="about-content-container" className="content-width column"></div>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="content-container column">
          <div id="contact-header-container" className="content-width">
            <div className="section-subheader-container">
              <hr />
              <h5>CONTACT</h5>
            </div>
            <h1>Get in touch.</h1>
          </div>
          <div id="contact-container" className="column"></div>
        </section>

        {/* Footer */}
        <footer className="content-width row">
          <span>© 2024 Edvance</span>
        </footer>

        {/* Scroll Icon */}
        <div className="scroll-container">
          <div id="scroll-icon"></div>
        </div>
      </div>

      {/* Menu Container */}
      <div id="menu-container" className="column"></div>

      {/* Hover Icon */}
      <div id="hover-icon"></div>

      {/* Transition Container */}
      <div id="transition-container"></div>
    </div>
  );
}
