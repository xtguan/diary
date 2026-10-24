# Xiaotang Guan — Personal Website

A single-page personal site built with **React 18 + Vite 5**. It brings together a short profile, software projects, a blog and study-notes library, two food sections (bakery and weekly meal prep), a photo gallery, and contact details.

**Live site:** https://xtguan.github.io/diary/

## Current sections

| Section | Anchor | What it contains |
| --- | --- | --- |
| About | `#about` | Intro, current focus, and links |
| Skills | `#skills` | Skill groups and tools |
| Projects & Work | `#projects` | Expandable project cards and case-study details |
| Blog & Learning Notes | `#blog` | Search, category filters, essays, travel journals and study notes |
| Bakery | `#bakery` | **The Corporate Captive’s Kitchen & Bakery** / **公司囚徒的厨房与烘焙坊** |
| Meal Prep | `#meal-prep` | **Clocked Out & Cooked Up** / **下班开火** — weekly prep entries |
| Photo Gallery | `#gallery` | Albums loaded from `src/photos/` |
| Contact | `#contact` | Contact links and footer |

The Blog, Projects, Bakery, Meal Prep and Gallery headers use the same pattern: eyebrow, title, subtitle, intro paragraph, and a short “house rules” line. The section content is rendered on one page; detail views use query-string deep links.

## Stack and features

- React 18, Vite 5, plain CSS in `src/styles.css`
- ReactMarkdown 8 with `remark-gfm` for tables inside blog posts
- Bilingual bakery and meal-prep sections with an EN / 中文 toggle (persisted in `localStorage`)
- Search and category filters for the blog
- Automatic reading-time estimates on blog cards and detail views
- Deep links:
  - Blog: `?post=<slug>#blog`
  - Recipe: `?recipe=<slug>#bakery`
  - Meal prep: `?mealprep=<slug>#meal-prep`
- Print-friendly recipe view
- Back-to-top button after scrolling
- SEO title, description, Open Graph, Twitter and canonical tags via `src/components/Seo.jsx`
- Production build deployed to GitHub Pages at `/diary/`

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Vite prints the local URL (typically `http://localhost:5173`).

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

`npm run build` first regenerates `public/sitemap.xml` and then builds the site into `dist/`. `dist/` is ignored by Git.

The development server uses `base: '/'`; production builds use `base: '/diary/'`. To build for another path, set `VITE_BASE`:

```bash
VITE_BASE=/my-repo/ npm run build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`:

1. checks out the repository
2. installs Node.js 18 and runs `npm ci`
3. runs `npm run build`
4. publishes `dist/` to GitHub Pages using `peaceiris/actions-gh-pages`

The published URL is https://xtguan.github.io/diary/.

The old manual path is still available:

```bash
npm run deploy
```

`npm run predeploy` builds the site first, and `gh-pages` pushes `dist/` to the `gh-pages` branch.

If the repository or site URL changes, update the production base in `vite.config.mjs`, `SITE_URL` in `src/components/Seo.jsx`, `baseUrl` in `scripts/generate-sitemap.mjs`, and the static `og:image` URL in `index.html`.

## Project layout

```text
src/
  App.jsx                 page order and section composition
  styles.css              all site styles
  components/             Header, About, Skills, Projects, Blog, Bakery,
                          MealPrep, Gallery, Contact, Footer, BackToTop, Seo
  posts/                  blog post modules, loaded automatically with import.meta.glob
  posts/notes/            long-form Markdown study notes imported with ?raw
  recipes/                bakery recipe modules and registry
  meal-prep/              weekly meal-prep modules and registry
  assets/
    bakery/               served bakery photos and illustrations
    blog/                 blog cover images
    meal-prep/            served weekly prep photos
    photos/               project and detail images
  photos/                 gallery albums and blog images discovered by Vite globs
source-photos/            original bakery, meal-prep and project photos (archive)
scripts/
  generate-sitemap.mjs    writes public/sitemap.xml before each build
public/                   static files, including og-image.svg and sitemap.xml
.github/workflows/
  deploy.yml              GitHub Pages build and deploy
```

## Adding content

### Blog & Learning Notes

Posts live in `src/posts/` as JS modules. They are loaded automatically by `import.meta.glob('../posts/*.js')`, so no registry update is needed.

A post can define:

```js
import thumbnail from '../assets/blog/your-cover.jpg'

export default {
  slug: 'your-post-slug',
  title: 'Post Title',
  date: '2026-10-23',
  category: 'thoughts',        // travel | thoughts | study-notes
  tags: ['thoughts', 'notes'],
  summary: 'Short summary shown on note cards.',
  thumbnail,                   // optional
  content: `# Post Title

Markdown content goes here.`,
}
```

Category labels are title-cased by `formatCategoryLabel`. The code also normalizes legacy values: `learning` becomes `study-notes`, and `sharing thoughts` becomes `thoughts`.

- **Study notes:** set `format: 'note'` to render a text-first note card with the summary and reading time instead of a cover image.
- **Reading time:** estimated from CJK characters and Latin words; set `readingTime` explicitly if you want to override it.
- **Markdown:** headings, lists, links, images, blockquotes and GFM tables are supported. Dates are formatted at noon local time to avoid timezone off-by-one issues.
- **Anchors:** a long note can use `<a id="anchor-name"></a>` immediately before a heading. The renderer moves that id onto the heading so a table of contents keeps working.
- **Long notes:** keep a Markdown file under `src/posts/notes/` and import it with `?raw`; see `src/posts/post-7.js` and `src/posts/notes/2026-10-06-graph-theory-black-box.md`.
- **Deep links:** the selected post is stored in `?post=<slug>#blog`; the detail view has a “Copy permalink” button.

### Bakery

Recipes live in `src/recipes/` as one module per recipe. Register a new one in `src/recipes/index.js`; recipes are sorted newest first, with same-date recipes keeping registry order.

Each recipe has bilingual `content.en` and `content.zh`:

```js
import thumbnail from '../assets/bakery/my-recipe.jpg'
import photo from '../assets/bakery/my-recipe-photo.jpg'

export default {
  slug: 'my-recipe',
  date: '2026-10-23',
  category: 'sugar-reduced',
  thumbnail,                   // optional
  photos: [                    // optional detail-page gallery
    {
      src: photo,
      caption: { en: 'Caption', zh: '图片说明' },
    },
  ],
  content: {
    en: {
      categoryLabel: 'Sugar-reduced',
      title: 'My Recipe',
      subtitle: 'One-line subtitle',
      summary: 'Short card summary.',
      intro: 'Intro paragraph.',
      stats: [{ label: 'Yield', value: '6 tarts' }],
      ingredients: [
        {
          title: 'Base',
          items: [{ amount: '1 cup', name: 'Flour', note: 'Optional note' }],
        },
      ],
      steps: [{ title: 'Step', body: ['Paragraph'], tip: 'Optional tip' }],
      notes: [{ title: 'Note', body: 'Body' }],
    },
    zh: {
      // same shape, Chinese strings
    },
  },
}
```

Served images live in `src/assets/bakery/`. The section language choice is stored in `localStorage`, and the “Print recipe” button opens the browser print dialog with the rest of the page hidden.

### Meal Prep

Weekly entries live in `src/meal-prep/`. Import each new week in `src/meal-prep/index.js` and add it to the array; entries are sorted newest first.

Each week follows this shape:

```js
import thumbnail from '../assets/meal-prep/week-2.jpg'
import photo from '../assets/meal-prep/week-2-trays.jpg'

export default {
  slug: 'week-2',
  date: '2026-10-19',
  thumbnail,
  photos: [
    {
      src: photo,
      caption: { en: 'Caption', zh: '图片说明' },
    },
  ],
  content: {
    en: {
      weekLabel: 'Week 2 · October 19–25, 2026',
      title: '...',
      subtitle: '...',
      summary: '...',
      intro: '...',
      sugarNote: '...',
      stats: [{ label: 'Prep day', value: '1' }],
      planTitle: 'The week at a glance',
      meals: [{ title: 'Breakfast', note: '...', items: ['...'] }],
      dishesTitle: 'What I cooked',
      dishes: [{ name: '...', detail: '...' }],
      prepTitle: 'The prep day',
      prep: [{ title: '...', body: '...' }],
      galleryTitle: 'The trays behind the week',
      storageTitle: 'Storage and reheating',
      storage: ['...'],
      notesTitle: 'Notes from the kitchen',
      notes: [{ title: '...', body: '...' }],
      closing: '...',
    },
    zh: {
      // same shape, Chinese strings
    },
  },
}
```

Served images live in `src/assets/meal-prep/`. Entries support the same EN / 中文 toggle and deep-link pattern as recipes: `?mealprep=<slug>#meal-prep`.

### Projects and Photo Gallery

- Project cards are defined directly in `src/components/Projects.jsx`; each card opens a detail modal with sections, bullets and an optional image.
- Gallery images are discovered automatically from `src/photos/` through `import.meta.glob`. Each subfolder becomes an album, using the folder name as its key. Add a friendly display name in `ALBUM_NAMES` inside `src/components/Gallery.jsx`; otherwise the folder name is shown.
- Gallery and blog content images are served from `src/photos/`; optimized project, bakery, meal-prep and blog-cover images live under `src/assets/`.

## Images and source photos

- Images served by the site live in `src/assets/` (optimized copies) or `src/photos/` (gallery and content images).
- `source-photos/` keeps the original bakery, meal-prep and project photos for future re-cropping or re-exporting. It is not required at runtime.
- Keep the served images reasonably sized; phone originals can be much larger than the site needs.
- `public/` is for static files that should be copied as-is, such as `og-image.svg` and the generated `sitemap.xml`.

## SEO and sitemap

- `src/components/Seo.jsx` sets the page title, description, Open Graph, Twitter and canonical metadata.
- `index.html` contains the static shell metadata and default Open Graph image.
- `scripts/generate-sitemap.mjs` writes `public/sitemap.xml` during `npm run build`. It includes the main section anchors plus the blog posts listed in the script’s `posts` array. Add new post slugs there if they should appear in the sitemap.

## Notes

- The site uses hash links for sections and query parameters for detail views; there is no client-side router.
- `npm run build` is the authoritative check for a production build.
- There is no automated test runner configured in the repository; verification is currently manual/visual.
