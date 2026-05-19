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
          <h2 className="contact-name">BAWANTHA DILSHAN</h2>
        </div>

        <div className="contact-grid">
          <a className="contact-item contact-email" href="mailto:bawanthadilshan38@gmail.com">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>bawanthadilshan38@gmail.com</span>
          </a>

          <a className="contact-item contact-phone" href="tel:+94760825774">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.97.38 1.92.77 2.82a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.39 1.85.65 2.82.77A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>+94 76 0825774</span>
          </a>

          <div className="contact-item contact-location">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="2.5" fill="currentColor"/>
              </svg>
            </span>
            <span>Galgamuwa, Ehetuwewa</span>
          </div>

          <a
            className="contact-item contact-link"
            href="https://github.com/bawantha1697"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-icon">
              <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" />
            </span>
            <span>github.com/bawantha1697</span>
          </a>

          <a
            className="contact-item contact-link"
            href="https://www.linkedin.com/in/bawantha-dilshan-504619342/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-icon">
              <img src="https://cdn.simpleicons.org/linkedin/ffffff" alt="LinkedIn" />
            </span>
            <span>linkedin.com/in/bawantha-dilshan-504619342/</span>
          </a>
        </div>
      </section>
    </main>
  );
}

export default App;
