<!-- 
SYNC IMPACT REPORT
==================
This is the initial constitution for the Personal Website project. 

Version: 1.0.0 (INITIAL)
Ratification Date: 2026-09-25

Principles Added:
- I. Content-First Design
- II. Minimal & Fast
- III. Modular Components
- IV. Easy Content Management

Sections Added:
- Technology Stack
- Development Workflow
- Governance

This document establishes foundational governance for the Personal Website repository.
No previous constitution existed.

Deferred Items: None
-->

# Personal Website Constitution

A governance document for the Personal Website repository, establishing core principles,
technical standards, and development practices.

## Core Principles

### I. Content-First Design
The website is a vehicle for showcasing personal content (portfolio, blog, photography).
Every architectural and feature decision must prioritize content clarity, accessibility,
and the user's ability to present their work effectively. Technical choices serve the
content, not the reverse. Content should be easy to manage, update, and extend without
deep technical involvement.

### II. Minimal & Fast
The project uses Vite for fast development iteration and minimal production footprint.
Keep dependencies lean, avoid unnecessary complexity, and prioritize performance.
Build times should remain sub-second in development; production bundles should load
instantly. Follow YAGNI principles: do not add features or libraries speculatively.

### III. Modular Components
React components should be self-contained, reusable building blocks with clear
single responsibilities. Each component (Header, Footer, Blog, Gallery, etc.)
should be independently testable and documented. Avoid tight coupling between
components; favor composition and props-based configuration.

### IV. Easy Content Management
Blog posts, project descriptions, and gallery organization must be manageable without
code changes. Blog posts are authored as JavaScript modules or Markdown files;
galleries are configured via JSON. New content (blog, photos, projects) should be
addable through file addition and configuration updates only, not code refactoring.

## Technology Stack

**Frontend Framework**: React (via Vite)  
**Build Tool**: Vite  
**Styling**: CSS (inline or modular)  
**Content Format**: JavaScript modules (posts), Markdown, JSON (configuration)  
**Deployment**: GitHub Pages (primary)  
**Package Manager**: npm  

## Development Workflow

1. **Local Development**: Run `npm run dev` for fast iteration with hot module reload.
2. **Content Additions**:
   - Blog posts: Create new file in `src/posts/` following the post template.
   - Photos/Gallery: Add to `src/photos/` and update `src/data/photo-albums.json`.
   - Projects: Update project list in `src/components/Projects.jsx`.
3. **Code Changes**: Edit React components in `src/components/`. Follow existing
   component structure and naming conventions.
4. **Build & Deploy**:
   - `npm run build` — Runs sitemap generation and Vite production build.
   - `npm run deploy` — Deploys `dist/` to GitHub Pages (requires `gh-pages` package).
   - Do NOT run build/dev proactively in automated agents; it may destabilize sessions.

## Governance

This constitution supersedes informal practices and establishes binding governance
for the Personal Website repository. All contributors must adhere to these principles
when making design decisions, adding features, or organizing content.

**Amendment Process**: Changes to this constitution require:
1. Clear documentation of what is changing and why.
2. Ratification by the project maintainer.
3. Update to the version number and `LAST_AMENDED_DATE`.

**Version Increments**:
- MAJOR: Backward-incompatible principle removals or redefinitions.
- MINOR: New principles added or materially expanded guidance.
- PATCH: Clarifications, wording improvements, or non-semantic refinements.

**Compliance Review**: The constitution should be reviewed annually or when a new
major feature or principle is proposed.

---

**Version**: 1.0.0 | **Ratified**: 2026-09-25 | **Last Amended**: 2026-09-25
