# Faizan — Premium Developer Portfolio

A modern, full-stack portfolio for a Software Engineer & AI Engineer.

Built with **Next.js 15 (App Router)**, **TypeScript (strict)**, **Tailwind CSS**,
**Framer Motion**, **Radix / ShadCN-style components**, **MongoDB / Mongoose**,
JWT auth, and Recharts on the admin dashboard.

> 📘 **Deployment:** see [`DEPLOYMENT.md`](./DEPLOYMENT.md)
> ✅ **Pre-launch:** see [`PRODUCTION_CHECKLIST.md`](./PRODUCTION_CHECKLIST.md)

---

## Stack

- **Frontend** — Next.js 15, React 19, TypeScript, Tailwind, Framer Motion, Radix UI, lucide-react
- **Backend** — Next.js Route Handlers (Node + Edge), Mongoose, jose (JWT), bcryptjs
- **Database** — MongoDB Atlas
- **Auth** — JWT in httpOnly cookies + edge middleware guard
- **Charts** — Recharts (admin only)
- **Validation** — zod (every API mutation)
- **State** — SWR for client-side data fetching
- **Animations** — Framer Motion + custom hooks (tilt, magnetic, particles, marquee, scroll progress)

---

## Quick start

```bash
npm install
cp .env.example .env.local           # fill MONGODB_URI, JWT_SECRET, ADMIN_SEED_*
npm run seed                         # creates owner user + content in Mongo
npm run dev                          # http://localhost:3000
```

Sign into `/admin/login` with the email/password from `ADMIN_SEED_*`.

---

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Local dev server |
| `build` | Production build |
| `start` | Run the built app |
| `lint` | ESLint |
| `typecheck` | Strict TypeScript check |
| `seed` | Seed Mongo with owner user + demo content |

---

## Project structure

```
src/
  app/
    (marketing)/        # public site (home, projects, about, contact)
    (admin)/            # /admin dashboard + login
    api/                # route handlers (see DEPLOYMENT)
    layout.tsx, globals.css, sitemap.ts, robots.ts, manifest.ts
    opengraph-image.tsx # dynamic OG image generator
  components/
    sections/           # Hero, About, Skills, Projects, Experience, Services, GitHubStats, Testimonials, Contact
    shared/             # Navbar, Footer, ThemeToggle, CursorGlow, SectionHeading, JsonLd
    motion/             # Reveal, Particles, GradientOrbs, Marquee, Magnetic, Tilt, TextReveal, GradientText, ScrollProgress, PageTransition, SmoothScroll
    admin/              # ConfirmDialog, ImageUpload, PageHeader
    ui/                 # Button, Card, Input, Badge, Dialog (ShadCN-style primitives)
  hooks/                # use-mobile, use-tilt, use-magnetic, use-in-view
  config/site.ts
  lib/                  # db, db-utils, auth, api, api-client, crud, rate-limit, validators, utils
  models/               # User, Project, Skill, Experience, Service, Testimonial, ContactMessage, SiteSettings, AuditLog
  types/
scripts/seed.ts
middleware.ts           # /admin guard (edge)
next.config.mjs         # security headers, image opts, package optimizations
vercel.json             # region pinning, function durations
.github/workflows/ci.yml # lint · typecheck · build on every push
```

---

## Premium animation system (Phase 7)

Reusable, performance-aware motion primitives. Every effect is disabled on
`prefers-reduced-motion` and on coarse pointers (touch); offscreen work is
paused via IntersectionObserver + `visibilitychange`.

| Component / hook | Use |
|------------------|-----|
| `<Particles />` | Canvas particle field with connecting lines, DPR-aware, mobile-throttled |
| `<GradientOrbs />` | Drifting blurred color orbs (transform-only, cheap) |
| `<Marquee />` | Seamless duplicated track, pause-on-hover, fade mask |
| `<Magnetic />` | Wrap a button — it drifts toward the cursor |
| `<Tilt />` | Spring 3D tilt + optional glare overlay |
| `<TextReveal />` | Word-by-word blur-unfurl on in-view |
| `<GradientText />` | Animated gradient hue sweep |
| `<ScrollProgress />` | Top gradient bar tied to scroll position |
| `<PageTransition />` | Soft fade+lift on route change |
| `<SmoothScroll />` | Lerp-based inertia (opt-in) |
| `useTilt()` | Underlying spring values for custom tilt UIs |
| `useMagnetic()` | Cursor-attraction motion values |
| `useIsTouch / useIsMobile / useMediaQuery` | Cheap effect-disabling helpers |

---

## API surface

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/login` | public (rate-limited) | httpOnly JWT cookie |
| POST | `/api/auth/logout` | public | clears cookie |
| GET  | `/api/auth/me` | session | current user |
| GET / POST | `/api/projects` | public read · admin write | guests see published |
| GET / PATCH / DELETE | `/api/projects/[id]` | | |
| GET / POST | `/api/skills` (+ `[id]`) | public read · admin write | |
| GET / POST | `/api/experience` (+ `[id]`) | public read · admin write | |
| GET / POST | `/api/services` (+ `[id]`) | public read · admin write | |
| GET / POST | `/api/testimonials` (+ `[id]`) | public sees approved only | |
| GET / PATCH | `/api/settings` | public read · admin write | singleton |
| POST | `/api/contact` | public (rate-limited, honeypot) | stores message |
| GET / PATCH / DELETE | `/api/contact[/:id]` | admin | inbox |
| GET | `/api/github/stats` | public (edge, 1h cache) | live GitHub data |
| POST | `/api/upload` | admin | image/PDF up to 5MB |
| GET | `/api/analytics` | admin | KPIs + time series + status counts |

---

## Security

- JWT (HS256, 2-day TTL) signed with `JWT_SECRET`, stored as **httpOnly, Secure, SameSite=Lax**
- Edge middleware (`middleware.ts`) guards `/admin/*`
- bcrypt (cost 12) password hashing
- Per-IP rate limits on `/api/auth/login` (5 / 15 min) and `/api/contact` (3 / hr)
- Zod validation on every mutation
- Honeypot field on contact form
- Audit log records every admin mutation
- Hardened response headers (HSTS, X-Frame-Options, Permissions-Policy, etc.) — see `next.config.mjs`
- `poweredByHeader: false` (no `X-Powered-By: Next.js`)

---

## Performance

- Image optimization with AVIF/WebP, remote-pattern allowlist
- `optimizePackageImports` for `lucide-react`, `framer-motion`, `recharts`
- Static caching for `_next/static/*` (1y immutable)
- `Cache-Control: no-store` on `/api/*`
- Edge runtime for `/api/github/stats` with 1h revalidate
- Mongoose connection cached across function invocations
- Per-route function `maxDuration` tuned in `vercel.json`
- Particles + tilt + cursor glow auto-disabled on mobile + reduced-motion

---

## CI / CD

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — lint, typecheck, build on every push/PR
- Vercel auto-deploys main → Production, PRs → Preview URLs
- Rollbacks via Vercel Deployments → Promote prior deploy

---

## SEO

- Per-route `metadata` with templated titles
- Dynamic OG image at [`/opengraph-image`](src/app/opengraph-image.tsx) (edge, gradient card)
- JSON-LD `Person` + `WebSite` schema in root layout
- `sitemap.xml` includes all project detail pages
- `robots.txt` disallows `/admin` and `/api`
- PWA-style [`manifest.ts`](src/app/manifest.ts)

---

## Roadmap status

- Phase 1 — Product planning & architecture ✅
- Phase 2 — Design system ✅
- Phase 3 — Frontend (sections, layouts, animations) ✅
- Phase 4 — Backend (Mongo, JWT, API surface) ✅
- Phase 5 — Database layer (typed models, validators, db utils) ✅
- Phase 6 — Admin dashboard (charts, CRUD, drawer inbox, settings) ✅
- Phase 7 — Premium animations (Particles, Tilt, Magnetic, Marquee, ScrollProgress, …) ✅
- Phase 8 — Deployment & DevOps (security headers, CI, OG image, JSON-LD, docs) ✅
