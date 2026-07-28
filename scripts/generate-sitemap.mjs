import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const posts = [
  { slug: 'christmas-trip-to-tampa', title: 'A Christmas Trip to Tampa' },
  { slug: 'reflections-on-solitude-and-strength', title: 'Reflections on Solitude and Strength' }
]

const baseUrl = 'https://xtguan.github.io/diary'
const now = new Date().toISOString()

const urls = [
  '',
  '/#about',
  '/#projects',
  '/#blog',
  '/#gallery',
  '/#contact'
].concat(posts.map(post => `/blog/${post.slug}`))

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url>\n    <loc>${baseUrl}${url}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`

mkdirSync(path.join(root, 'public'), { recursive: true })
writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml)
console.log('sitemap.xml generated')