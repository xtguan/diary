import React, { useState } from 'react'
import thumb1 from '../assets/photos/sample1.svg'
import thumb2 from '../assets/photos/sample2.svg'
import frtbDetail from '../assets/photos/frtb-detail.png'
import fraudDetail from '../assets/photos/fraud-detail.png'

const projects = [
  {
    title: 'FRTB — Market Risk Tools',
    thumbnail: frtbDetail,
    subtitle: 'Built a cutting-edge platform for market risk calculations and regulatory compliance.',
    tech: ['Java', 'Spring Boot', 'Spark', 'Hadoop', 'SQL', 'Unix'],
    detailImage: frtbDetail,
    details: [
      {
        title: 'Project Overview',
        paragraphs: [
          'Imagine building a platform that helps banks prepare for the next big financial storm—sounds intense, right? That’s exactly what the Fundamental Review of the Trading Book (FRTB) project was all about. We created a system to calculate market risk, meet strict regulatory standards, and ensure financial stability.'
        ]
      },
      {
        title: 'My Role',
        bullets: [
          'Led an agile team to design and deliver backend services and ETL pipelines for processing massive amounts of trading data.',
          'Ensured the platform passed the toughest regulatory tests for Expected Shortfall (ES) and Standardized Approach (SA).',
          'Kept the team motivated, productive, and always ready to tackle the next challenge.'
        ]
      },
      {
        title: 'Key Contributions',
        bullets: [
          'Built Java/Spring Boot services and Spark pipelines that handled data like a pro.',
          'Optimized SQL queries and managed Hadoop workflows to keep things running smoothly.',
          'Automated repetitive tasks with Unix scripting—because who doesn’t love saving time?',
          'Worked closely with stakeholders to ensure our solutions hit the mark for both business and regulatory needs.'
        ]
      },
      {
        title: 'Unique Challenges',
        bullets: [
          'Navigated the complexity of FRTB’s regulatory requirements, ensuring our platform adhered to strict compliance standards.',
          'Tackled the challenge of processing high-volume, high-velocity trading data while maintaining accuracy and performance.',
          'Designed solutions to handle edge cases, such as rare market events and liquidity stress scenarios, ensuring robustness under all conditions.'
        ]
      },
      {
        title: 'Team Dynamics',
        bullets: [
          'Fostered a collaborative environment where team members felt empowered to share ideas and innovate.',
          'Introduced weekly brainstorming sessions that led to a 15% improvement in team efficiency and creative problem-solving.',
          'Mentored junior developers, helping them grow into confident contributors to the project’s success.'
        ]
      },
      {
        title: 'Why It Matters',
        bullets: [
          'Made market risk calculations more transparent and accurate.',
          'Helped the bank stay ahead of regulatory audits (and sleep better at night).',
          'Proved that teamwork and a sprinkle of creativity can solve even the toughest problems.'
        ]
      },
      {
        title: 'Skills & Technologies',
        paragraphs: [
          'Tech Stack: Java, Spring Boot, Spark, Hadoop, SQL, Unix.',
          'Superpowers: Leadership, agile coaching, stakeholder management, and turning complex problems into elegant solutions.'
        ]
      }
    ]
  },
  {
    title: 'Fraud IT — Systems Integration',
    thumbnail: fraudDetail,
    subtitle: 'Served as Integration Lead bridging architecture and development teams for scalable fraud systems.',
    tech: ['Java', 'Spring Boot', 'APIs', 'Azure Service Bus', 'Kafka', 'OpenShift', 'REST', 'SOAP'],
    detailImage: fraudDetail,
    details: [
      {
        title: 'The Challenge',
        paragraphs: [
          'In a complex financial environment, siloed systems and vendor integrations posed significant risks to fraud detection and operational efficiency. The need was for a unified integration layer connecting diverse payment channels, anomaly detection engines, and vendor platforms while ensuring regulatory compliance and zero downtime.'
        ]
      },
      {
        title: 'My Role as Integration Lead',
        bullets: [
          'Application Design: Led design and implementation of integrations between internal applications and vendor platforms, defining standards and best practices.',
          'Technical Leadership: Mentored integration engineers, conducted code reviews, and managed API lifecycles including security (OAuth 2.0, JWT, mutual TLS).',
          'Vendor Platform Integration: Collaborated with vendor teams, oversaw deliverable quality, and ensured adherence to security standards.',
          'Stakeholder Collaboration: Partnered with architects, product managers, and business stakeholders to translate requirements into integration designs and provide technical input for planning.'
        ]
      },
      {
        title: 'The Impact',
        bullets: [
          'Operational Efficiency: Streamlined integration processes, reducing deployment time for new modules and improving delivery predictability.',
          'Risk Mitigation: Resolved system bottlenecks, ensuring seamless data flow across transaction hubs and enhanced fraud detection capabilities.',
          'Team Growth: Mentored junior engineers, fostering technical excellence and collaborative problem-solving in a hands-on leadership role.',
          'Compliance Excellence: Achieved full alignment with industry standards, reinforcing the security and stability of financial integrations.'
        ]
      },
      {
        title: 'Key Skills Demonstrated',
        bullets: [
          'Java Development: Proficient in Java 11+, Spring Boot, Spring Integration, and reactive programming.',
          'API & Messaging: Expertise in REST/SOAP/GraphQL APIs, Azure Service Bus, Kafka, and IBM MQ.',
          'Platform Experience: Hands-on with OpenShift Container Platform and Azure for containerized workloads.',
          'Leadership: 8+ years in software engineering, with 3+ years in integration-focused lead roles.'
        ]
      }
    ]
  }
]

export default function Projects(){
  const [selected, setSelected] = useState(null)
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    // trigger fade-out then clear selected
    setClosing(true)
    setTimeout(() => {
      setSelected(null)
      setClosing(false)
    }, 200)
  }

  return (
    <section id="projects" className="card">
      <h2>Projects & Work</h2>
      <p className="muted">Selected projects and case studies. Click a project to expand and see details.</p>

      <div className="projects-list">
        {projects.map((p, i) => (
          <article key={i} className="project" onClick={() => setSelected(p)} style={{cursor: 'pointer'}}>
            {p.thumbnail && <img src={p.thumbnail} alt={`thumb-${i}`} className="thumb" />}
            <h3>{p.title}</h3>
            <p className="muted">{p.subtitle}</p>
          </article>
        ))}
      </div>

      {selected && (
        <div className={`project-details ${closing ? 'fade-out' : 'fade-in'}`} style={{marginTop:20}}>
          <button className="close-btn" onClick={handleClose} aria-label="Close project details">✕</button>
          <h3>{selected.title}</h3>
          <p className="muted">{selected.subtitle}</p>
          {selected.detailImage && (
            <img
              src={selected.detailImage}
              alt={`${selected.title} illustration`}
              className="project-detail-image"
            />
          )}
          <p><strong>Tech:</strong> {selected.tech.join(', ')}</p>
          {Array.isArray(selected.details)
            ? selected.details.map((section, index) => (
                <div key={index} style={{marginTop: index === 0 ? 16 : 24}}>
                  {section.title && <h4>{section.title}</h4>}
                  {section.paragraphs?.map((para, pIndex) => (
                    <p key={pIndex} className="muted">{para}</p>
                  ))}
                  {section.bullets?.length > 0 && (
                    <ul>
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="muted">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            : <p className="muted">{selected.details}</p>}
          <button className="close-btn-bottom" onClick={handleClose} aria-label="Close project details">Close</button>
        </div>
      )}
    </section>
  )
}
