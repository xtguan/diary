import React from 'react'

export default function Contact(){
  return (
    <section id="contact" className="card contact-section">
      <h2>Contact & Availability</h2>
      <p className="muted">
        I’m always interested in thoughtful conversations, collaborations, and new ideas — especially around software, storytelling, and creative projects.
      </p>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Reach out</h3>
          <p>
            Email me at <a href="mailto:eva.xiaotang.guan@gmail.com">eva.xiaotang.guan@gmail.com</a> for projects, ideas, or a quick hello.
          </p>
        </div>

        <div className="contact-card">
          <h3>Currently open to</h3>
          <ul>
            <li>Software engineering conversations</li>
            <li>Collaborative creative projects</li>
            <li>Photography and travel-related exchanges</li>
            <li>Friendly coffee-chat style introductions</li>
          </ul>
        </div>
      </div>

      <div className="social-links">
        <a href="https://github.com/xtguan" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/eva-xiaotang-guan/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://www.instagram.com/xtguan.arts" target="_blank" rel="noopener">Instagram</a>
      </div>
    </section>
  )
}
