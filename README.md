# Personal Website (Vite + React)

This repository is a minimal starter for a personal website (portfolio, blog, photo gallery) built with Vite + React. The design is modern and minimal; replace content and images with your own.

Get started locally

1. Install dependencies

```bash
cd ~/Downloads/personal-website
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

Deploy to GitHub Pages (two common options)

Option A — Repository pages (recommended for project sites)

-- Create a GitHub repo (for example `diary`) and push this code to it.
- In `package.json` the `deploy` script uses `gh-pages` (already included). Install it locally: `npm install --save-dev gh-pages`.
- Update `vite.config.js` `base` if your site will be served from a subpath. Example: `base: '/diary/'`.
- Run:

```bash
npm run predeploy
npm run deploy
```

This will push the `dist` folder to the `gh-pages` branch and publish the site at `https://<yourusername>.github.io/diary/`.

Option B — User/Organization site (`<username>.github.io`)

- Create a GitHub repository named exactly `<yourusername>.github.io`.
- Build the site (`npm run build`).
- Push the contents of the `dist` folder to the `main` branch root of the repository (or configure a GitHub Action to do it).
- The site will be available at `https://<yourusername>.github.io/diary/`.

Notes and next steps

- Replace `Your Name`, contact info, and project details in `src/components`.
- Add real images in `public/photos` (replace placeholders).
- If you want to render markdown into styled HTML inside React, consider adding a small static site generator (e.g., mdx or building at compile-time).

Adding blog posts

- Blog posts live in `src/posts/` as JS modules that export an object with `title`, `date`, `thumbnail`, and `content` (see existing `post-1.js`).
- To categorize posts, add a `category` field. Use one of the recommended values:
	- `travel` — travel / trip posts
	- `thoughts` — short essays, reflections, or sharing thoughts

Example post template (`src/posts/new-post.js`):
```javascript
import thumb from '../photos/your-image.jpg'

const content = `
# Post title

Write your post here in Markdown.
`

export default {
	title: 'Post Title',
	date: '2026-01-04',
	category: 'thoughts', // or 'travel'
	thumbnail: thumb,
	content
}
```

Adding bakery recipes

- Bakery recipes live in `src/recipes/` as JS modules that export one recipe object.
- Each recipe carries both languages under `content.en` and `content.zh`, so the
  section can be switched between English and Chinese without duplicating the page.
- Register a new recipe by importing it in `src/recipes/index.js` and adding it to
  the `recipes` array. The newest `date` is listed first automatically.
- `thumbnail` is optional. Without it, the card renders a warm placeholder;
  illustrations and recipe photos live in `src/assets/bakery/`.
- Add an optional `photos` array for extra shots on the detail page. Each entry
  takes a local image `src` and a bilingual `caption`.
- Recipes open at `?recipe=<slug>#bakery`, and the "Print recipe" button hides the
  rest of the page for a clean paper/PDF copy.

Example recipe skeleton (`src/recipes/my-recipe.js`):
```javascript
import thumbnail from '../assets/bakery/my-recipe.svg'
import detailPhoto from '../assets/bakery/my-recipe-photo.jpg'

export default {
  slug: 'my-recipe',
  date: '2026-10-23',
  category: 'sugar-reduced',
  thumbnail, // optional
  photos: [
    {
      src: detailPhoto,
      caption: { en: 'A caption for the detail page.', zh: '详情页里的图片说明。' },
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
      ingredients: [{ title: 'Base', items: [{ amount: '1 cup', name: 'Flour', note: 'Optional note' }] }],
      steps: [{ title: 'Step title', body: ['Paragraph one.', 'Paragraph two.'], tip: 'Optional tip' }],
      notes: [{ title: 'Note title', body: 'Note body.' }],
    },
    zh: {
      // same shape, Chinese strings
    },
  },
}
```
