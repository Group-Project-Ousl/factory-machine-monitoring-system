import React from "react";

function HomeSection({ experienceIcons }) {
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">Jh</span>
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
            <div className="avatar-face">👨🏻‍💻</div>
          </div>
        </div>

        <div className="hero-copy">
          <h1>
            I build modern
            <br />
            web apps <span>& UI</span>
          </h1>

          <p className="hero-description">
            I am a passionate software engineering student focused on building modern,
            responsive, and user-friendly web applications using React and modern frontend tools.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Get In Touch
            </a>
            <a className="button button-secondary" href={`${import.meta.env.BASE_URL}resume.pdf`} download>
              Download CV
            </a>
          </div>
        </div>

        <div className="experience-strip" id="experience">
          <p>EXPERIENCE WITH</p>
          <div className="experience-icons">
            {experienceIcons.map((item) => (
              <div className="experience-icon" key={item.label}>
                {item.short}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeSection;