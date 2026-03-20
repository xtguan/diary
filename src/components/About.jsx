import React, { useState } from 'react'

export default function About(){
  const [open, setOpen] = useState(false)

  return (
    <section id="about" className="card about-section">
      <h2>About Me</h2>

      <div className="about-body">
        <p className="about-intro">
          Hi, I'm <strong>Xiaotang Guan</strong> — a software engineer, photographer, and home cook who is endlessly curious about the world and the people in it.
        </p>

        <p>
          By day, I work in tech, building modern web experiences and solving problems that occasionally make me want to throw my laptop out a window (I haven't yet). I love the craft of software — the logic, the creativity, the satisfaction of making something that actually works. But I've always needed an outlet beyond the screen.
        </p>

        {/* Fade-out teaser when collapsed */}
        {!open && <div className="about-fade" />}

        {/* Expanded content */}
        <div className={`about-extra ${open ? 'about-extra-open' : 'about-extra-closed'}`}>
          <p>
            That outlet comes in a few forms. One of them is <strong>photography</strong>. There's something about the act of framing the world through a lens that teaches you to see differently — to notice the quality of light at 5pm, the way a stranger's expression shifts for just a second, the texture of a wall you'd otherwise walk past without thinking. I shoot both on my phone and on a DSLR, and I love both for completely different reasons.
          </p>

          <p>
            Another is <strong>cooking</strong>. This one runs deep. The kitchen has always been my most honest creative space — somewhere I can experiment freely, make mistakes without consequence (well, mostly), and produce something tangible that I can share with people I care about. I love the alchemy of it: how a few simple ingredients, treated with the right attention, can become something genuinely moving. I cook a lot of Asian food, especially dishes rooted in the flavours I grew up with, but I'm always exploring. Homemade pasta, slow braises, weeknight stir-fries that somehow taste better than they have any right to — it's all fair game.
          </p>

          <p>
            I started this site as a way to gather the things I love in one place — my <strong>travel stories</strong>, my <strong>photography</strong>, my <strong>kitchen experiments</strong>, and the occasional reflection on life in general. Not for any particular audience, really. More as a way of remembering. Of documenting the small, meaningful things that don't make the highlight reel but are somehow the whole point.
          </p>

          <p>
            I believe good food tells a story. A trip you take changes you in ways you don't fully understand until you're back home eating something that reminds you of it. A photograph is a promise to yourself that you were really there, really present, really paying attention.
          </p>

          <p>
            This is my attempt to hold onto all of that.
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
