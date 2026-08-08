import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function slugify(text = '') {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeCategory(value = '') {
  const normalized = value.toString().trim().toLowerCase()
  if (normalized === 'sharing thoughts') return 'thoughts'
  return normalized || 'uncategorized'
}

function getPostSlug(post) {
  if (post.slug) return post.slug
  return slugify(post.title)
}

function formatCategoryLabel(category) {
  if (category === 'all') return 'All'
  return category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function buildPermalink(slug) {
  const url = new URL(window.location.href)
  url.searchParams.set('post', slug)
  return url.toString()
}

function resolveMarkdownImagePaths(content = '', assetMap = {}) {
  if (!content) return content

  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, rawSrc) => {
    const src = rawSrc.trim().replace(/^['"]|['"]$/g, '').split(/\s+/)[0]

    if (!src || /^(https?:|data:|#)/i.test(src)) {
      return match
    }

    const candidates = [
      src,
      src.replace(/^\/src\//, '/'),
      src.replace(/^\//, '/src/'),
      src.replace(/^\/src\/photos\//, '/photos/'),
      src.replace(/^\//, '')
    ]

    const resolved = candidates.find(candidate => assetMap[candidate])
    if (resolved) {
      return `![${alt}](${assetMap[resolved]})`
    }

    return match
  })
}

export default function Blog(){
  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(null)
  const [category, setCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedSlug, setCopiedSlug] = useState('')

  useEffect(() => {
    const modules = import.meta.glob('../posts/*.js')
    const imageModules = import.meta.glob('../photos/**/*.{jpg,jpeg,png,svg,JPG,JPEG,PNG}')
    ;(async () => {
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, resolver]) => {
          const mod = await resolver()
          const post = mod.default
          const normalizedCategory = normalizeCategory(post.category)

          const assetMap = {}
          await Promise.all(
            Object.entries(imageModules).map(async ([imagePath, imageResolver]) => {
              const imported = await imageResolver()
              const normalizedPath = imagePath.replace(/^\.\.\//, '/').replace(/\/\//g, '/')
              assetMap[normalizedPath] = imported.default
              assetMap[normalizedPath.replace(/^\/src\//, '/')] = imported.default
              assetMap[normalizedPath.replace(/^\//, '/src/')] = imported.default
            })
          )

          return {
            ...post,
            slug: getPostSlug(post),
            category: normalizedCategory,
            tags: Array.isArray(post.tags) ? post.tags.map(t => t.toLowerCase()) : [normalizedCategory],
            content: resolveMarkdownImagePaths(post.content, assetMap)
          }
        })
      )
      entries.sort((a,b) => (b.date > a.date ? 1 : -1))
      setPosts(entries)
    })()
  }, [])

  useEffect(() => {
    if (!posts.length) return

    const applySelectionFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      const slug = params.get('post')
      if (!slug) {
        setSelected(null)
        return
      }
      const found = posts.find(p => p.slug === slug)
      setSelected(found || null)
    }

    applySelectionFromUrl()
    window.addEventListener('popstate', applySelectionFromUrl)
    return () => window.removeEventListener('popstate', applySelectionFromUrl)
  }, [posts])

  const openPost = (post) => {
    setSelected(post)
    const url = new URL(window.location.href)
    url.searchParams.set('post', post.slug)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const closePost = () => {
    setSelected(null)
    const url = new URL(window.location.href)
    if (url.searchParams.has('post')) {
      url.searchParams.delete('post')
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }

  const allCategories = Array.from(new Set(posts.map(p => p.category))).sort()
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredPosts = posts.filter((p) => {
    const inCategory = category === 'all' || p.category === category
    if (!inCategory) return false
    if (!normalizedSearch) return true
    const haystack = `${p.title} ${p.category} ${p.tags?.join(' ')} ${p.content}`.toLowerCase()
    return haystack.includes(normalizedSearch)
  })

  const handleCopyPermalink = async () => {
    if (!selected) return
    const permalink = buildPermalink(selected.slug)
    try {
      await navigator.clipboard.writeText(permalink)
      setCopiedSlug(selected.slug)
      setTimeout(() => setCopiedSlug(''), 1800)
    } catch {
      setCopiedSlug('')
    }
  }

  if (selected) {
    return (
      <section id="blog">
        <div className="magazine-post">
          {/* Hero image */}
          {selected.thumbnail && (
            <div className="magazine-hero">
              <img src={selected.thumbnail} alt={selected.title} />
              <div className="magazine-hero-overlay">
                <span className="magazine-category">{formatCategoryLabel(selected.category)}</span>
                <h1 className="magazine-title">{selected.title}</h1>
                <p className="magazine-date">{new Date(selected.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          )}

          {/* Article body */}
          <div className="magazine-body">
            <button className="magazine-back" onClick={closePost}>
              ← Back to Blog
            </button>
            <button className="magazine-link" onClick={handleCopyPermalink}>
              {copiedSlug === selected.slug ? 'Permalink copied' : 'Copy permalink'}
            </button>
            <div className="magazine-content">
              <ReactMarkdown
                components={{
                  img: ({src, alt}) => (
                    <figure className="magazine-figure">
                      <img src={src} alt={alt} loading="lazy" decoding="async" />
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
            <button className="magazine-back" onClick={closePost}>
              ← Back to Blog
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="card">
      <h2>Blog & Learning Notes</h2>
      <p className="muted">Short notes, longer posts, and current learning updates. Search, filter by topic, then click to read.</p>

      <div className="blog-controls">
        <label className="blog-search" htmlFor="blog-search-input">
          <span className="blog-search-label">Search</span>
          <input
            id="blog-search-input"
            type="search"
            placeholder="Search by title, topic, or content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      <div className="tabs">
        <button className={`tab ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>All</button>
        {allCategories.map((c) => (
          <button key={c} className={`tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {formatCategoryLabel(c)}
          </button>
        ))}
      </div>

      {/* Magazine-style post cards */}
      <div className="magazine-grid">
        {filteredPosts.map((p, i) => {
          const hasDisplayableThumbnail = Boolean(
            p.thumbnail &&
            typeof p.thumbnail === 'string' &&
            !p.thumbnail.includes('sample')
          )

          return (
            <article key={i} className="magazine-card" onClick={() => openPost(p)}>
              <div className={`magazine-card-img ${hasDisplayableThumbnail ? '' : 'magazine-card-img-placeholder'}`}>
                {hasDisplayableThumbnail ? (
                  <>
                    <img src={p.thumbnail} alt={p.title} />
                    <span className="magazine-card-category">{formatCategoryLabel(p.category)}</span>
                  </>
                ) : (
                  <div className="magazine-card-placeholder">
                    <span className="magazine-card-placeholder-kicker">{formatCategoryLabel(p.category)}</span>
                    <h3>{p.title}</h3>
                  </div>
                )}
              </div>
              <div className="magazine-card-body">
                <p className="magazine-card-date">{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 className="magazine-card-title">{p.title}</h3>
                <div className="post-tags">
                  {p.tags?.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag-chip">#{tag.replace(/\s+/g, '-')}</span>
                  ))}
                </div>
                <span className="magazine-card-read">{p.category === 'learning' ? 'Read note →' : 'Read story →'}</span>
              </div>
            </article>
          )
        })}
      </div>
      {filteredPosts.length === 0 && (
        <p className="muted" style={{ marginTop: 18 }}>
          No posts match this search. Try a shorter keyword or switch topic filters.
        </p>
      )}
    </section>
  )
}
