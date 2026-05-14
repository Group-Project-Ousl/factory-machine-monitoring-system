import React from "react";
import { projects } from "../content";

function ProjectsSection() {
  return (
    <section className="content-section projects-section" id="projects">
      <div className="section-title">
        <p className="section-kicker section-kicker-orange">PROJECTS</p>
      </div>

      <div className="project-grid-new">
        {projects.map((project, index) => (
          <div key={index} className="project-card-new">
            <div className="project-image-placeholder">
              {/* Image would go here */}
              <div className="placeholder-content">
                <span className="project-category">{project.category || 'PRO'}</span>
                <div className="project-visual-tag">
                   {project.title.split(' ')[0]}
                </div>
              </div>
            </div>
            <div className="project-info-new">
              <div className="project-header-new">
                <p className="visit-label">CLICK HERE TO VISIT</p>
                <div className="project-title-row">
                  <h3 className="project-title-new">{project.title.toUpperCase()}</h3>
                  <span className="arrow-icon">↗</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;
