import React from "react";
import { projects } from "../content";

// SVG illustrations for each project type
function renderProjectImage(index, title) {
  if (title.includes("Factory") || title.includes("Monitoring")) {
    return (
      <svg className="project-image-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="80" r="18" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <circle cx="60" cy="80" r="12" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
        <g opacity="0.6">
          <line x1="45" y1="80" x2="30" y2="80" stroke="white" strokeWidth="2" />
          <line x1="75" y1="80" x2="90" y2="80" stroke="white" strokeWidth="2" />
        </g>
        <rect x="100" y="60" width="40" height="40" fill="none" stroke="white" strokeWidth="2" opacity="0.9" rx="4" />
        <line x1="105" y1="70" x2="135" y2="70" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="105" y1="78" x2="135" y2="78" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <line x1="105" y1="86" x2="135" y2="86" stroke="white" strokeWidth="1.5" opacity="0.7" />
        <g opacity="0.8">
          <rect x="50" y="140" width="8" height="30" fill="white" rx="2" />
          <rect x="70" y="125" width="8" height="45" fill="white" rx="2" />
          <rect x="90" y="110" width="8" height="60" fill="white" rx="2" />
          <rect x="110" y="120" width="8" height="50" fill="white" rx="2" />
          <rect x="130" y="135" width="8" height="35" fill="white" rx="2" />
        </g>
      </svg>
    );
  } else if (title.includes("Expense") || title.includes("Tracker")) {
    return (
      <svg className="project-image-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="60" width="120" height="70" fill="none" stroke="white" strokeWidth="3" opacity="0.9" rx="6" />
        <path d="M 40 80 Q 160 80 160 80" stroke="white" strokeWidth="2" opacity="0.6" />
        <g opacity="0.8">
          <circle cx="100" cy="100" r="12" fill="none" stroke="white" strokeWidth="2" />
        </g>
        <g opacity="0.7">
          <polyline points="45,140 65,120 85,135 105,100 125,130 155,90" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="45" cy="140" r="3" fill="white" />
          <circle cx="65" cy="120" r="3" fill="white" />
          <circle cx="85" cy="135" r="3" fill="white" />
          <circle cx="105" cy="100" r="3" fill="white" />
          <circle cx="125" cy="130" r="3" fill="white" />
          <circle cx="155" cy="90" r="3" fill="white" />
        </g>
      </svg>
    );
  } else if (title.includes("Weather")) {
    return (
      <svg className="project-image-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="135" cy="65" r="18" fill="white" opacity="0.9" />
        <g opacity="0.7" stroke="white" strokeWidth="4" strokeLinecap="round">
          <line x1="135" y1="30" x2="135" y2="18" />
          <line x1="135" y1="112" x2="135" y2="124" />
          <line x1="100" y1="65" x2="88" y2="65" />
          <line x1="170" y1="65" x2="182" y2="65" />
          <line x1="111" y1="41" x2="103" y2="33" />
          <line x1="159" y1="41" x2="167" y2="33" />
          <line x1="111" y1="89" x2="103" y2="97" />
          <line x1="159" y1="89" x2="167" y2="97" />
        </g>
        <path d="M 55 120 C 65 95, 95 92, 106 110 C 115 90, 143 86, 154 104 C 170 108, 174 132, 160 140 L 70 140 C 58 140, 48 131, 48 120 C 48 112, 51 107, 55 120 Z" fill="white" opacity="0.85" />
        <g opacity="0.9">
          <line x1="78" y1="150" x2="78" y2="168" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="102" y1="150" x2="102" y2="172" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1="126" y1="150" x2="126" y2="166" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    );
  } else if (title.includes("Flutter") || title.includes("Sandbox")) {
    return (
      <svg className="project-image-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="52" y="28" width="96" height="144" rx="16" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <rect x="66" y="48" width="68" height="16" rx="4" fill="white" opacity="0.85" />
        <rect x="66" y="78" width="46" height="12" rx="3" fill="white" opacity="0.65" />
        <rect x="66" y="98" width="58" height="12" rx="3" fill="white" opacity="0.65" />
        <rect x="66" y="118" width="38" height="12" rx="3" fill="white" opacity="0.65" />
        <circle cx="116" cy="100" r="18" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
        <circle cx="116" cy="100" r="8" fill="white" opacity="0.8" />
        <g opacity="0.8">
          <path d="M145 62 L160 78 L145 94" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M145 106 L160 122 L145 138" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    );
  } else {
    return (
      <svg className="project-image-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 70 L 50 100 L 60 130" fill="none" stroke="white" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
        <path d="M 140 70 L 150 100 L 140 130" fill="none" stroke="white" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
        <circle cx="100" cy="90" r="4" fill="white" opacity="0.7" />
        <circle cx="100" cy="110" r="4" fill="white" opacity="0.7" />
        <line x1="70" y1="100" x2="90" y2="100" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="110" y1="100" x2="130" y2="100" stroke="white" strokeWidth="2" opacity="0.5" />
      </svg>
    );
  }
}

function ProjectsSection() {
  return (
    <section className="content-section projects-section" id="projects">
      <div className="section-title">
        <p className="section-kicker section-kicker-orange">PROJECTS</p>
      </div>
      <div className="project-grid-new">
        {projects.map((project, index) => (
          <a
            key={index}
            className="project-card-new project-card-link"
            href={project.link}
            target="_blank"
            rel="noreferrer"
          >
            <div 
              className="project-image-placeholder"
              style={{
                background: index === 0 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : index === 1
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              }}
            >
              <div className="project-image-bg">
                {renderProjectImage(index, project.title)}
              </div>
              <span className="project-category">{project.category || 'PROJECT'}</span>
            </div>
            <div className="project-info-new">
              <h3 className="project-title-new">{project.title}</h3>
              <p className="project-description-new">{project.description}</p>
              <div className="project-stack-tags">
                {project.stack && project.stack.map((tech, i) => (
                  <span key={i} className="project-tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-visit-cta">
                <span className="visit-text">View on GitHub</span>
                <span className="arrow-icon">↗</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;

