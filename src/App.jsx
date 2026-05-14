import React from "react";
import { projects, skills, experienceIcons } from "./content";
import Home from "./Home";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";

function App() {
  return (
    <main className="home-page">
      <Home />

      <ProjectsSection />

      <section className="content-section">
        <div className="section-title">
          <p className="section-kicker">SKILLS</p>
        </div>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <span className="skill" key={index}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      <ExperienceSection />

      <section className="content-section contact-card" id="contact">
        <h2>Contact</h2>
        <p>
          Interested in working together? Feel free to reach out and I’ll get back to you
          quickly.
        </p>
        <a href="mailto:youremail@example.com">youremail@example.com</a>
      </section>
    </main>
  );
}

export default App;