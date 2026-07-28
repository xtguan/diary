import React, { useState } from 'react'

export default function About(){
  const [open, setOpen] = useState(false)

  return (
    <section id="about" className="card about-section">
      <div className="hero-intro">
        <div className="hero-copy">
          <p className="hero-eyebrow">Currently building</p>
          <h2>Thoughtful software, quiet stories, and everyday beauty.</h2>
          <p className="hero-text">
            I’m a software engineer who cares about calm interfaces, meaningful products, and the small moments that make life feel vivid.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="hero-link primary">See my work</a>
            <a href="#blog" className="hero-link secondary">Read the blog</a>
          </div>
        </div>

        <div className="hero-focus">
          <h3>Current focus</h3>
          <ul>
            <li>Building thoughtful digital experiences</li>
            <li>Writing more travel and reflection posts</li>
            <li>Capturing everyday light through photography</li>
          </ul>
        </div>
      </div>

      <div className="about-body">
        <h2>About Me</h2>
        <p className="about-intro">
          Hello. I'm <strong>Xiaotang Guan</strong> — a software engineer, photographer, and passionate home cook with a deep curiosity about the world and the people who inhabit it.
        </p>

        <p>
          By profession, I build thoughtful digital experiences and solve complex technical challenges. I'm genuinely drawn to the craft of software engineering — the logic, the elegance of a well-designed solution, and that particular satisfaction when something you've created actually works. But I've learned that intellectual pursuits alone don't fully nourish a life. I need creative outlets that ground me in the tangible world.
        </p>

        {/* Fade-out teaser when collapsed */}
        {!open && <div className="about-fade" />}

        {/* Expanded content */}
        <div className={`about-extra ${open ? 'about-extra-open' : 'about-extra-closed'}`}>
          <p>
            One of these outlets is <strong>photography</strong>. Through a lens, I've learned to see differently — to appreciate the particular quality of light at dusk, to notice how an expression changes in a fleeting moment, to find beauty in overlooked details. Whether I'm shooting with my phone or my DSLR, each tool teaches me something new about perspective and intention.
          </p>

          <p>
            Another is <strong>cooking</strong>, and this one runs particularly deep. The kitchen is my most honest creative space — a place where I can experiment freely, where failures teach as much as successes, and where I create something I can genuinely share with the people I care about. There's real alchemy in it: simple ingredients, treated with attention and care, becoming something that moves people. I draw heavily from the Asian cuisines of my heritage, but I'm endlessly curious about culinary traditions from everywhere. From homemade pasta to slow-cooked braises to weeknight stir-fries that somehow taste far better than they should — it's all part of the conversation.
          </p>

          <p>
            I created this site as a space to gather the things that matter to me — my <strong>travels</strong>, my <strong>photographs</strong>, my <strong>kitchen experiments</strong>, and reflections on what it means to live deliberately. It's not created for any particular audience; rather, it's my way of holding onto moments that feel significant. To document the small, meaningful experiences that don't always make it into mainstream narratives but somehow feel like the whole point.
          </p>

          <p>
            I believe that good food carries stories. Travel changes us in ways we don't fully understand until later. A photograph is a quiet promise to yourself that you were truly present, fully paying attention, genuinely engaged with the moment.
          </p>

          <p>
            This site is my attempt to honor all of that.
          </p>

          <p className="about-sign">— Xiaotang</p>
        </div>

        <button className="about-toggle" onClick={() => setOpen(o => !o)}>
          {open ? 'Show less ↑' : 'Read more ↓'}
        </button>
      </div>
    </section>
  )
}
