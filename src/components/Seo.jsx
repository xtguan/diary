import { useEffect } from 'react'

const DEFAULT_TITLE = 'Xiaotang Guan | Personal Website'
const DEFAULT_DESCRIPTION = 'A personal website for writing, photography, and thoughtful projects.'
const DEFAULT_IMAGE = '/og-image.svg'
const SITE_URL = 'https://xtguan.github.io/diary/'

function normalizePath(path) {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = '/',
  type = 'website'
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Xiaotang Guan` : DEFAULT_TITLE
    const fullDescription = description || DEFAULT_DESCRIPTION
    const resolvedPath = normalizePath(path)
    const url = new URL(resolvedPath, SITE_URL)
    const imageUrl = image.startsWith('http') ? image : new URL(image, SITE_URL).toString()

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
    setMeta('theme-color', '#0ea5a4')
    setMeta('robots', 'index,follow')
    setProperty('og:title', fullTitle)
    setProperty('og:description', fullDescription)
    setProperty('og:type', type)
    setProperty('og:url', url.toString())
    setProperty('og:image', imageUrl)
    setProperty('og:site_name', 'Xiaotang Guan')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', fullDescription)
    setMeta('twitter:image', imageUrl)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url.toString())
  }, [title, description, image, path, type])

  return null
}
