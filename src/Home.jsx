import React from "react";
import { experienceIcons } from "./content";
import profileImg from "./profile.jpg";

function renderExperienceIcon(label, short) {
  if (label === "Firebase") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.2 18.8 11.2 2.6c.3-.6 1.2-.6 1.5 0l2.2 4.2-10.7 12z" fill="currentColor" />
        <path d="M9.6 11.2 14.7 6l3.7 7.2c.2.5-.1 1.1-.6 1.3L10 18.9l-.4-7.7z" fill="#ff9100" />
        <path d="M4.6 18.2 8.8 4.5c.2-.7 1.1-.8 1.5-.3l2.1 2.7-7.8 11.3z" fill="#ffca28" />
      </svg>
    );
  }

  if (label === "Figma") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="9" cy="5" r="4" fill="#f24e1e" />
        <circle cx="15" cy="5" r="4" fill="#ff7262" />
        <circle cx="9" cy="12" r="4" fill="#a259ff" />
        <circle cx="15" cy="12" r="4" fill="#1abcfe" />
        <circle cx="9" cy="19" r="4" fill="#0acf83" />
      </svg>
    );
  }

  if (label === "Database") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
        <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }

  if (label === "SQL") {
    return <span className="experience-icon-sql-mark">SQL</span>;
  }

  if (label === "Vue.js") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 4h4l6 10 6-10h4l-10 16L2 4z" fill="currentColor" />
        <path d="M6 4h3l3 5 3-5h3l-6 10L6 4z" fill="#0f172a" />
      </svg>
    );
  }

  if (label === "React") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
      </svg>
    );
  }

  return <span>{short}</span>;
}

function Home() {
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">Bawantha</span>
        </a>

        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="avatar-wrap">
          <div className="avatar-ring">
            <a
              className="avatar-link"
              href="https://github.com/bawantha1697"
              target="_blank"
              rel="noreferrer"
              aria-label="View GitHub profile"
            >
              <img src={profileImg} alt="Profile" className="avatar-face" />
              <span className="avatar-overlay">
                <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" />
              </span>
            </a>
          </div>
        </div>

        <div className="hero-copy">
          <h1>
            I do code and
            <br />
            make content <span className="gradient-text">about it!</span>
          </h1>

          <p className="hero-description">
            I am a passionate Software Engineering student with a strong focus on frontend development. I specialize in building modern, responsive, and user-friendly web applications using React, JavaScript, HTML, and CSS.

I enjoy creating clean UI designs, smooth user experiences, and real-world projects such as dashboards, landing pages, and web apps. I am continuously learning and improving my skills by working on practical projects and exploring new technologies.

I am highly motivated to deliver quality work, meet deadlines, and help clients bring their ideas to life.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Get In Touch
            </a>
            <a className="button button-secondary" href="#">
              Download CV
            </a>
          </div>

          <div className="experience-strip">
            <p className="experience-label">EXPERIENCE WITH</p>
            <div className="experience-icons">
              {experienceIcons.map((item) => (
                <div className="experience-item" key={item.label}>
                  <div
                    className={`experience-icon experience-icon-${item.label
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}`}
                    aria-label={item.label}
                    title={item.label}
                  >
                    {renderExperienceIcon(item.label, item.short)}
                  </div>
                  <span className="experience-icon-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}

export default Home;