import React from "react";
import Home from "./Home";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";

function App() {
  return (
    <main className="home-page">
      <Home />

      <ProjectsSection />

      <ExperienceSection />

      <section className="content-section contact-card" id="contact">
        <div className="contact-header">
          <p className="contact-label">CONTACT</p>
          <h2 className="contact-name">Let’s build something new <span className="gradient-text">.</span></h2>
        </div>

        <div className="contact-grid">
          <a
            className="contact-item"
            href="mailto:bawanthadilshan38@gmail.com"
            aria-label="Email: bawanthadilshan38@gmail.com"
            onClick={(e) => {
              // fallback to force mail client if default link handling fails
              try {
                window.location.href = "mailto:bawanthadilshan38@gmail.com";
              } catch (err) {
                /* ignore */
              }
            }}
          >
            <span className="contact-icon">
              <img src="https://cdn.simpleicons.org/gmail/ffffff" alt="Gmail" />
            </span>
          </a>

          <a
            className="contact-item"
            href="https://github.com/bawantha1697"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub: bawantha1697"
          >
            <span className="contact-icon">
              <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" />
            </span>
          </a>

          <a
            className="contact-item"
            href="https://www.linkedin.com/in/bawantha-dilshan-504619342/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn: bawantha-dilshan"
          >
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.036-1.852-3.036-1.853 0-2.136 1.445-2.136 2.939v5.666H9.352V9h3.414v1.562h.049c.476-.9 1.637-1.852 3.372-1.852 3.607 0 4.272 2.373 4.272 5.458v6.283zM5.337 7.433a2.062 2.062 0 11.001-4.124 2.062 2.062 0 010 4.124zM6.814 20.452H3.861V9h2.953v11.452z" />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;
