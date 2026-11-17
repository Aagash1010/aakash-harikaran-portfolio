# Beyond the Interface — Aagash Harikaran

A premium, motion-led developer portfolio for **Aagash Harikaran** — software developer, AI enthusiast and creative technologist from Sri Lanka.

Dark-first with an electric-lime accent, oversized Space Grotesk display type, a custom cursor, an interactive WebGL energy core, a real studio portrait and scroll-driven timelines. The work section is backed by **dedicated, routable case-study pages** rather than an overlay.

The site is designed to be read by a recruiter in under a minute: a visible CV download, GitHub / LinkedIn / email short cuts, a verified timeline, grouped skills and four honest engineering case studies.

---

## Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | React 19 + TypeScript                                         |
| Build      | Vite 8                                                        |
| Styling    | Tailwind CSS 4 (CSS-first tokens in `src/index.css`)          |
| Motion     | Framer Motion + GSAP with ScrollTrigger                       |
| Icons      | Lucide + `simple-icons` (GitHub / LinkedIn brand marks)        |
| Visuals    | Hand-built CSS/SVG abstract panels, lazy-loaded Three.js core  |
| CV         | PDFKit-generated A4 PDF (`scripts/generate-cv.mjs`)           |

---

## Getting started

Requires **Node 20+**.

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173/`.

### Scripts

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR                  |
| `npm run build`     | Type-check (`tsc -b`) and build to `dist/`          |
| `npm run preview`   | Serve the production build locally                  |
| `npm run typecheck` | Type-check only                                     |
| `npm run cv`        | Regenerate `public/Aagash-Harikaran-CV.pdf`         |

---

## Project structure

```
src/
├─ App.tsx                 # Path routing: home, /work, /work/:id, 404
├─ index.css               # Design tokens, display type scale, utilities, keyframes
├─ data/profile.ts         # ← All editable content lives here
├─ components/
│  ├─ layout/              # Navbar (CV + availability), Footer, LoadingScreen,
│  │                       # cursor, scroll progress
│  ├─ sections/            # Hero, About (+ DeveloperTerminal), Skills, Projects
│  │                       # index, Experience/Journey, Interests, Contact
│  ├─ ui/                  # Buttons, magnetic wrapper, reveal, terminal, icons,
│  │                       # clock, theme toggle
│  └─ visuals/             # PortraitFrame, HeroScene, HeroOrb, ProjectVisual
├─ context/                # Theme + toast providers
├─ hooks/                  # Active-section spy, parallax, Sri Lanka time
└─ pages/                  # ProjectPage (case study), NotFound
scripts/generate-cv.mjs    # CV generator
public/                    # CV, portrait variants, favicon, OG image, robots.txt
```

### Routes

| Path          | Renders                                                        |
| ------------- | -------------------------------------------------------------- |
| `/`           | Full single-page portfolio                                     |
| `/work`       | Redirects to `/#projects` on the home page                     |
| `/work/:id`   | Dedicated case-study page for one of the four documented builds |
| anything else | Custom 404 (`noindex, follow`)                                 |

---

## Make it yours

### 1. Content

Almost every string, project, skill and date lives in **`src/data/profile.ts`**. Update:

- `profile` — name, roles, headline, email, availability, location, university
- `hero` — supporting paragraph and recruiter quick facts
- `aboutParagraphs` / `aboutFacts` / `aboutFocus`
- `skillCategories` — each skill carries a `status` of `"used"` (coursework or a build) or `"exploring"`; there are deliberately no proficiency percentages
- `projects` — the full case-study model described below
- `timeline`, `education`, `interests`, `stats`

Wording for the hero name, roles and availability is centralised so the hero, navbar, CV shortcut and project pages cannot disagree.

### 2. Case studies

Each entry in `projects` is a self-contained case study rendered by `src/pages/ProjectPage.tsx`:

| Field            | Used for                                                     |
| ---------------- | ------------------------------------------------------------ |
| `title`, `shortTitle`, `category` | Page heading, cards, breadcrumbs, prev/next |
| `description`    | Card summary, page lede, metadata description                |
| `overview`, `problem`, `solution` | The narrative sections                       |
| `stack`          | `{ name, role }` pairs shown in the page sidebar             |
| `features`       | Key functionality checklist                                  |
| `contribution`   | The sidebar “My contribution” card                           |
| `implementation` | Technical implementation notes + honesty status              |
| `challenges`, `learnings`, `screenshots` | `{ status, body }` sections      |
| `repo`, `demo`   | External destinations — `null` until published               |
| `visual`         | Which abstract SVG/CSS panel to render                       |

Every section takes a `CaseStudyStatus` (`documented`, `partial`, `pending`). Pending sections explain that the information has not been written up yet instead of inventing challenges or screenshots. Fill these in from real notes before launch and the UI updates automatically.

### 3. Replace the portrait

The hero and About sections use `public/portrait.jpg` — a real photograph presented without retouching the subject.

1. Replace `public/portrait.jpg` (keep the filename), or point `profile.photo` at a new file in `public/`
2. Regenerate the responsive variants from the new original (640w and 900w) and keep the same filenames: `public/portrait-sm.jpg`, `public/portrait-md.jpg`
3. Adjust `photoAlt`, and the `width` / `height` attributes plus `srcSet` if the aspect ratio changes
4. Keep the subject roughly centred and use a **portrait-orientation image around 4:5** (the current original is 1215 × 1295)

The portrait ships with `srcSet` / `sizes`, explicit dimensions and a responsive preload, so no layout shift occurs. `PortraitFrame` supplies the art direction: a clip-path reveal, slow scroll parallax, pointer tilt on desktop, neutral lighting overlays and a metadata frame. Set `photo: null` and the designed placeholder returns automatically — no broken image.

### 4. Update the contact links

These are the only destinations the site can reach. Everything else is labelled rather than invented:

- **Email** — `profile.email` and the matching `mailto:` entry in `profile.socials` (currently `aagash1004@gmail.com`)
- **GitHub / LinkedIn** — live profile URLs in `profile.socials`; every social button and the contact cards link directly to them
- **Project `repo` / `demo`** — still `null`; the case-study page labels them **Pending** and the cards explain that no URL has been invented until one is supplied

> The contact form validates input, then prepares a pre-filled `mailto:` draft in your own mail app. There is no backend and no data is sent to a server — the UI says so explicitly and shows a “Draft ready” confirmation.

### 5. Regenerate the CV

The downloadable PDF is generated, not hand-maintained.

```bash
# 1. Edit the content inside scripts/generate-cv.mjs
# 2. Rebuild the file
npm run cv
```

This writes `public/Aagash-Harikaran-CV.pdf`, which is what every “Download CV” button serves (navbar, hero, journey, contact and case-study pages). The generator mirrors `src/data/profile.ts`; when your experience changes, update both so the PDF and the site agree.

---

## Design system

Semantic CSS variables in `src/index.css` drive both themes:

- `--c-base`, `--c-panel`, `--c-ink`, `--c-muted`, `--c-line`, `--c-accent`
- Theme is applied via `data-theme="dark" | "light"` on `<html>` and persisted in `localStorage` (`ak-theme`)
- Dark is the default; `prefers-color-scheme` is not forced

Display type is set in **Space Grotesk 700** with measured clamps at 640 / 768 / 1024 px, so headings fit their grid columns without clipping at any width. The hero's WebGL core is lazy-loaded, desktop-only and replaced by an SVG sculpture on mobile, with reduced motion, or if WebGL fails.

Motion respects `prefers-reduced-motion`: the intro collapses to a 200 ms fade, entrance slides are skipped, and decorative parallax is disabled.

---

## Accessibility

- Landmarks, exactly one `h1` per page, ordered heading levels, `aria-labelledby` on every section
- All controls have accessible names; every form field has a real `<label>` and `aria-describedby` error text
- Visible focus states, keyboard-operable mobile menu (`Escape` closes, focus trap + focus restore), `aria-live` form errors and toasts
- The developer terminal is a real form with a labelled input, arrow-key history and an `aria-live="polite"` output log
- Decorative visuals are `aria-hidden`; no image ships without `alt`
- Custom cursor is hidden on touch and under reduced motion
- Whitespace for 9–11 px mono labels uses AA-contrast colours in both themes; body copy is 5.4:1 or better

---

## Deployment

The build is fully static:

```bash
npm run build   # → dist/
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).

Two notes:

1. **Client-side routing.** `App.tsx` handles `/`, `/work`, `/work/:id` and the 404 page. On hosts that rewrite unknown paths to `index.html` (as SPAs usually do), add a catch-all rewrite so deep links like `/work/luxmy-billing` resolve. The 404 page sets `noindex, follow` itself, so search engines won't index it.
2. **Base path.** Assets use root-relative URLs. If you deploy under a subpath (e.g. GitHub Pages project sites), set `base` in `vite.config.ts` to that subpath and update the `og:image`, portrait, CV and `/work/...` paths accordingly.

Fonts load from Google Fonts; for a stricter privacy or performance posture, self-host Space Grotesk, Inter, JetBrains Mono and Instrument Serif and swap the `<link>` in `index.html`.

---

## License

Personal portfolio content and imagery belong to Aagash Harikaran. The code structure is free to learn from; please replace the content, portrait and CV before reusing it as your own.
