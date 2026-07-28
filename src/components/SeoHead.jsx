import { useEffect } from 'react'

export default function SeoHead({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Xiaotang Guan` : 'Xiaotang Guan | Personal Website'
    const fullDescription = description || 'A personal website for writing, photography, and thoughtful projects.'

    document.title = fullTitle

    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const setProperty = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    setMeta('description', fullDescription)
    setProperty('og:title', fullTitle)
    setProperty('og:description', fullDescription)
    setProperty('og:type', 'website')
    setProperty('og:url', `https://xtguan.github.io/diary${path}`)
    setProperty('og:image', 'https://xtguan.github.io/diary/og-image.svg')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', fullDescription)
    setMeta('twitter:image', 'https://xtguan.github.io/diary/og-image.svg')
  }, [title, description, path])

  return null
}
