import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
  if (normalized === 'learning') return 'study-notes'
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

function formatPostDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function estimateReadingTime(content = '') {
  if (!content) return 1

  const text = content.replace(/<[^>]+>/g, ' ').replace(/[`*_>#|-]/g, ' ')
  const cjkCount = (text.match(/[\u3400-\u9fff]/g) || []).length
  const latinWords = (
    text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []
  ).length

  return Math.max(1, Math.ceil(cjkCount / 350 + latinWords / 220))
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

function normalizeHeadingText(text = '') {
  return text
    .toString()
    .replace(/<[^>]+>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

// Long study notes use explicit `<a id="...">` anchors before headings so their
// table of contents survives mixed Chinese/English heading slugs. Pull those ids
// out of the markdown and attach them to the matching heading instead.
function extractHeadingIds(content = '') {
  if (!content) return { content, headingIds: {} }

  const headingIds = {}
  const pattern = /<a id="([^"]+)"><\/a>\s*\n(#{1,6})\s+([^\n]+)/g
  let match
  while ((match = pattern.exec(content))) {
    headingIds[normalizeHeadingText(match[3])] = match[1]
  }

  return {
    content: content.replace(/<a id="[^"]+"><\/a>\s*\n?/g, ''),
    headingIds
  }
}

function reactNodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactNodeText).join('')
  if (node && typeof node === 'object' && node.props) return reactNodeText(node.props.children)
  return ''
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

          const resolvedContent = resolveMarkdownImagePaths(post.content, assetMap)
          const prepared = extractHeadingIds(resolvedContent)

          return {
            ...post,
            slug: getPostSlug(post),
            category: normalizedCategory,
            tags: Array.isArray(post.tags) ? post.tags.map(t => t.toLowerCase()) : [normalizedCategory],
            format: post.format || (normalizedCategory === 'study-notes' ? 'note' : 'post'),
            readingTime: post.readingTime || estimateReadingTime(prepared.content),
            content: prepared.content,
            headingIds: prepared.headingIds
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
    const headingFor = (level) => {
      const Tag = `h${level}`
      return function MarkdownHeading({ children }) {
        const text = normalizeHeadingText(reactNodeText(children))
        const id = selected.headingIds?.[text]
        return (
          <Tag id={id} className={`magazine-h${level}`}>
            {children}
          </Tag>
        )
      }
    }

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
                <p className="magazine-date">{formatPostDate(selected.date)} · {selected.readingTime} min read</p>
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
            {!selected.thumbnail && (
              <p className="magazine-detail-meta">
                <span className="magazine-detail-category">{formatCategoryLabel(selected.category)}</span>
                <span>{formatPostDate(selected.date)}</span>
                <span>{selected.readingTime} min read</span>
              </p>
            )}
            <div className="magazine-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({src, alt}) => (
                    <figure className="magazine-figure">
                      <img src={src} alt={alt} loading="lazy" decoding="async" />
                      {alt && <figcaption>{alt}</figcaption>}
                    </figure>
                  ),
                  h1: headingFor(1),
                  h2: headingFor(2),
                  h3: headingFor(3),
                  h4: headingFor(4),
                  p: ({children}) => <p className="magazine-p">{children}</p>,
                  em: ({children}) => <em className="magazine-lead">{children}</em>,
                  blockquote: ({children}) => <blockquote className="magazine-quote">{children}</blockquote>,
                  table: ({children}) => (
                    <div className="magazine-table-wrap">
                      <table>{children}</table>
                    </div>
                  ),
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
      <div className="blog-heading">
        <p className="blog-eyebrow">After hours</p>
        <h2>Blog & Learning Notes</h2>
        <p className="blog-subtitle">
          Travel journals, personal essays and study notes for people who keep thinking after work.
        </p>
        <p className="blog-intro">
          This is where the longer thoughts live: trips worth remembering, ideas I am still working out, and study notes I wish someone had written for me. Short posts are a coffee break; the longest notes are bilingual and made to come back to. Search by keyword or use the category tabs when you know what you are looking for. Everything here is free to read.
        </p>
        <p className="blog-house-rules">
          House rules: honest notes, sources linked, no SEO filler, and no writing for an algorithm.
        </p>
      </div>

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

          if (p.format === 'note') {
            return (
              <article
                key={i}
                className="magazine-card note-card"
                onClick={() => openPost(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openPost(p)
                  }
                }}
              >
                <div className="note-card-top">
                  <span className="note-card-kicker">{formatCategoryLabel(p.category)}</span>
                  <span className="note-card-readtime">{p.readingTime} min read</span>
                </div>
                <h3 className="note-card-title">{p.title}</h3>
                {p.summary && <p className="note-card-summary">{p.summary}</p>}
                <div className="post-tags">
                  {p.tags?.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag-chip">#{tag.replace(/\s+/g, '-')}</span>
                  ))}
                </div>
                <p className="note-card-date">{formatPostDate(p.date)}</p>
                <span className="magazine-card-read">Read note →</span>
              </article>
            )
          }

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
                <p className="magazine-card-date">{formatPostDate(p.date)} · {p.readingTime} min read</p>
                <h3 className="magazine-card-title">{p.title}</h3>
                <div className="post-tags">
                  {p.tags?.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag-chip">#{tag.replace(/\s+/g, '-')}</span>
                  ))}
                </div>
                <span className="magazine-card-read">Read story →</span>
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
