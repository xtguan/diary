import React, { useState, useEffect } from 'react'

// Friendly display names for album folders
const ALBUM_NAMES = {
  '2024-01-07-moving-house':  'Moving House',
  '2024-02-25-street-photo':  'Street Photography',
  '2025-10-05-photos-moon':   'Moon',
  '2025-12-25-tampa':         'Tampa Christmas',
  '__root__':                 'Other',
}

// Album cover — first photo in each album will be used as cover
function albumDisplayName(key) {
  return ALBUM_NAMES[key] || key
}

export default function Gallery(){
  const [albums, setAlbums]       = useState({})   // { albumKey: [{src, name}] }
  const [activeAlbum, setActive]  = useState(null) // null = show album grid
  const [selected, setSelected]   = useState(null)
  const [closing, setClosing]     = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => { setSelected(null); setClosing(false) }, 200)
  }

  useEffect(() => {
    // Vite glob — use eager:false, separate lowercase/uppercase extensions
    const lower = import.meta.glob('../photos/**/*.{jpg,jpeg,png,svg}')
    const upper = import.meta.glob('../photos/**/*.{JPG,JPEG,PNG}')
    const modules = { ...lower, ...upper }

    ;(async () => {
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, resolver]) => {
          const m = await resolver()
          const parts = path.split('/')
          const name = parts[parts.length - 1]
          // If path is ../photos/subfolder/file.jpg → folder = subfolder
          // If path is ../photos/file.jpg → folder = '__root__'
          const folder = parts.length >= 4 ? parts[parts.length - 2] : '__root__'
          return { src: m.default, name, folder }
        })
      )
      entries.sort((a, b) => a.name.localeCompare(b.name))

      const grouped = {}
      for (const e of entries) {
        if (!grouped[e.folder]) grouped[e.folder] = []
        grouped[e.folder].push(e)
      }
      setAlbums(grouped)
    })()
  }, [])

  const albumKeys = Object.keys(albums).sort()

  // ── Album grid ──────────────────────────────────────────────
  if (!activeAlbum) {
    return (
      <section id="gallery" className="card">
        <h2>Photo Gallery</h2>
        <p className="muted">Browse by album — click one to explore.</p>

        <div className="album-grid">
          {albumKeys.map(key => {
            const photos = albums[key]
            const cover  = photos[0]
            return (
              <div key={key} className="album-card" onClick={() => setActive(key)}>
                <div className="album-card-img">
                  <img src={cover.src} alt={albumDisplayName(key)} />
                  <div className="album-card-overlay">
                    <span className="album-card-count">{photos.length} photos</span>
                  </div>
                </div>
                <div className="album-card-body">
                  <h3 className="album-card-title">{albumDisplayName(key)}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // ── Individual album view ───────────────────────────────────
  const photos = albums[activeAlbum] || []
  return (
    <section id="gallery" className="card">
      <div className="album-nav">
        <button className="magazine-back" onClick={() => setActive(null)}>← All Albums</button>
        <h2>{albumDisplayName(activeAlbum)}</h2>
        <p className="muted">{photos.length} photos</p>
      </div>

      <div className="gallery">
        {photos.map((img, i) => (
          <div key={i} className="gallery-thumb" onClick={() => setSelected(img)}>
            <img src={img.src} alt={img.name} />
          </div>
        ))}
      </div>

      {selected && (
        <div className={`modal-overlay ${closing ? 'fade-out' : 'fade-in'}`} onClick={handleClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>✕</button>
            <img src={selected.src} alt={selected.name} style={{maxWidth:'90vw', maxHeight:'80vh', borderRadius:8}} />
            <p className="muted" style={{marginTop:8, fontSize:'0.8rem'}}>{selected.name}</p>
          </div>
        </div>
      )}
    </section>
  )
}
