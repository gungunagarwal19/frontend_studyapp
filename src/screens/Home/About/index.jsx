import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">About Me</h2>

      <div className="about-photo-bio">
        <p className="about-bio">
          Hi! I'm Gungun Agarwal, a passionate Computer Science student at IIIT
          Vadodara. I enjoy solving problems, building web applications, and
          participating in coding contests.
        </p>
      </div>

      <div className="about-section">
        <div className="about-row">
          <span className="about-label">Email:</span>
          <a
            className="about-link"
            href="mailto:gungun.agarwalnmk@gmail.com"
          >
            gungun.agarwalnmk@gmail.com
          </a>
        </div>

        <div className="about-row">
          <span className="about-label">LinkedIn:</span>
          <a
            className="about-link"
            href="https://www.linkedin.com/in/gungun21/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/gungun21
          </a>
        </div>

        <div className="about-row">
          <span className="about-label">GitHub:</span>
          <a
            className="about-link"
            href="https://github.com/gungunagarwal19"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/gungunagarwal19
          </a>
        </div>

        <div className="about-row">
          <span className="about-label">LeetCode:</span>
          <a
            className="about-link"
            href="https://leetcode.com/u/GUNGUN_AGARWAL/"
            target="_blank"
            rel="noopener noreferrer"
          >
            leetcode.com/u/GUNGUN_AGARWAL
          </a>
        </div>
      </div>

      <div className="about-section">
        <h3 className="about-subtitle">Education</h3>

        <div className="about-row">
          <span className="about-label">Institute:</span>
          <span className="about-value">
            Indian Institute of Information Technology Vadodara
          </span>
        </div>

        <div className="about-row">
          <span className="about-label">Degree:</span>
          <span className="about-value">
            Bachelor of Technology in Computer Science Engineering
          </span>
        </div>

        <div className="about-row">
          <span className="about-label">Graduating Year:</span>
          <span className="about-value">2027</span>
        </div>
      </div>
    </div>
  );
};

export default About;