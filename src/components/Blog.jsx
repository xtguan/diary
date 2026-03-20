import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Blog(){
  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(null)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const modules = import.meta.glob('../posts/*.js')
    ;(async () => {
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, resolver]) => {
          const mod = await resolver()
          return mod.default
        })
      )
      entries.sort((a,b) => (b.date > a.date ? 1 : -1))
      setPosts(entries)
    })()
  }, [])

  if (selected) {
    return (
      <section id="blog">
        <div className="magazine-post">
          {/* Hero image */}
          {selected.thumbnail && (
            <div className="magazine-hero">
              <img src={selected.thumbnail} alt={selected.title} />
              <div className="magazine-hero-overlay">
                <span className="magazine-category">{selected.category}</span>
                <h1 className="magazine-title">{selected.title}</h1>
                <p className="magazine-date">{new Date(selected.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          )}

          {/* Article body */}
          <div className="magazine-body">
            <button className="magazine-back" onClick={() => setSelected(null)}>
              ← Back to Blog
            </button>
            <div className="magazine-content">
              <ReactMarkdown
                components={{
                  img: ({src, alt}) => (
                    <figure className="magazine-figure">
                      <img src={src} alt={alt} />
                      {alt && <figcaption>{alt}</figcaption>}
                    </figure>
                  ),
                  h2: ({children}) => <h2 className="magazine-h2">{children}</h2>,
                  p: ({children}) => <p className="magazine-p">{children}</p>,
                  em: ({children}) => <em className="magazine-lead">{children}</em>,
                  blockquote: ({children}) => <blockquote className="magazine-quote">{children}</blockquote>,
                }}
              >
                {selected.content}
              </ReactMarkdown>
            </div>
            <button className="magazine-back" onClick={() => setSelected(null)}>
              ← Back to Blog
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="card">
      <h2>Blog</h2>
      <p className="muted">Short notes and longer posts. Click to read.</p>

      <div className="tabs">
        <button className={`tab ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>All</button>
        <button className={`tab ${category === 'travel' ? 'active' : ''}`} onClick={() => setCategory('travel')}>Travel</button>
        <button className={`tab ${category === 'thoughts' ? 'active' : ''}`} onClick={() => setCategory('thoughts')}>Sharing Thoughts</button>
      </div>

      {/* Magazine-style post cards */}
      <div className="magazine-grid">
        {posts.filter(p => category === 'all' || (p.category && p.category === category)).map((p, i) => (
          <article key={i} className="magazine-card" onClick={() => setSelected(p)}>
            {p.thumbnail && (
              <div className="magazine-card-img">
                <img src={p.thumbnail} alt={p.title} />
                <span className="magazine-card-category">{p.category}</span>
              </div>
            )}
            <div className="magazine-card-body">
              <p className="magazine-card-date">{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h3 className="magazine-card-title">{p.title}</h3>
              <span className="magazine-card-read">Read story →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
