import React from 'react'

const skillGroups = [
  {
    title: 'Software Engineering',
    items: ['Java', 'Spring Boot', 'REST APIs', 'System design', 'Agile delivery']
  },
  {
    title: 'Data & Platforms',
    items: ['Spark', 'Hadoop', 'SQL', 'ETL pipelines', 'Cloud platforms']
  },
  {
    title: 'Creative & Product',
    items: ['Photography', 'Storytelling', 'Visual editing', 'Writing', 'User-centered thinking']
  },
  {
    title: 'Tools I Use',
    items: ['React', 'Vite', 'VS Code', 'Git', 'Figma', 'Notion']
  }
]

export default function Skills() {
  return (
    <section id="skills" className="card skills-section">
      <h2>Skills & Tools</h2>
      <p className="muted">
        A quick snapshot of the technical systems, delivery habits, and creative practices I work with most.
      </p>

      <div className="skills-grid">
        {skillGroups.map((group) => (
          <div key={group.title} className="skill-card">
            <h3>{group.title}</h3>
            <div className="skill-list">
              {group.items.map((item) => (
                <span key={item} className="skill-chip">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
