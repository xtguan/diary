import React, { useEffect, useState } from 'react'

const SHOW_AFTER = 500

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const handleClick = () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Top</span>
    </button>
  )
}
