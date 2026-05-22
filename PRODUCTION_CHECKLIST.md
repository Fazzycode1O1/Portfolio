# Production Checklist

A pre-flight list to run before pushing the portfolio live. Group by concern.

## Code quality
- [ ] `npm run lint` — clean
- [ ] `npm run typecheck` — no errors
- [ ] `npm run build` — succeeds locally with prod env
- [ ] No `console.log` / `debugger` left in shipped code
- [ ] No `TODO` comments tied to launch-blocking work

## Content
- [ ] Real projects in DB (replace seed demo data)
- [ ] Real `resume.pdf` in `public/`
- [ ] Real headshot / cover images
- [ ] Real social links in [`src/config/site.ts`](src/config/site.ts)
- [ ] About-page bio reflects current role
- [ ] Hero headline + sub copy approved
- [ ] At least 1 approved testimonial

## Environment
- [ ] All env vars set in Vercel (Production, Preview, Development scopes)
- [ ] `JWT_SECRET` ≥ 32 random chars, unique per environment
- [ ] `ADMIN_SEED_PASSWORD` rotated after first seed (don't reuse forever)
- [ ] Mongo Atlas user has least-privilege role
- [ ] `.env.local` is gitignored (verify: `git check-ignore .env.local`)

## Security
- [ ] Security headers verified at [securityheaders.com](https://securityheaders.com) → A or A+
- [ ] `/admin` redirects unauth users to `/admin/login` (middleware works)
- [ ] Contact form rate-limited (3 / hr / IP)
- [ ] Login rate-limited (5 / 15 min / IP)
- [ ] No secrets in client bundle (search build output: `grep -r SECRET .next/static`)
- [ ] CORS not over-permissive (no `Access-Control-Allow-Origin: *` on API routes)

## SEO
- [ ] `metadataBase` set to the production URL
- [ ] `<title>` and `<meta name="description">` unique per route
- [ ] `sitemap.xml` accessible
- [ ] `robots.txt` accessible, disallows `/admin` and `/api`
- [ ] OG image renders for `/` and a project detail page
- [ ] JSON-LD Person + WebSite present (view source)
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)

## Performance
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] LCP < 2.5s on slow 4G
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] All images via `next/image` with `sizes`
- [ ] Hero cover (if any) marked `priority`
- [ ] Fonts loaded via `next/font` (self-hosted, swap)
- [ ] Particles / cursor glow / tilt disabled on touch + reduced-motion (verified)
- [ ] No layout shift when navbar shrinks on scroll

## Accessibility
- [ ] Tab order is logical, focus visible on every interactive element
- [ ] All icon-only buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA on body + muted text
- [ ] Skip-to-content link present and works
- [ ] `prefers-reduced-motion` respected (test: macOS System Settings → Reduce motion)

## Observability
- [ ] Vercel Analytics enabled (optional but free)
- [ ] Speed Insights enabled
- [ ] Error tracking wired (Sentry or LogTail) — optional
- [ ] Health-check endpoint or uptime monitor pointing at `/`

## Backups & recovery
- [ ] Atlas → enable continuous backups (paid tier) OR document a manual `mongodump` cadence
- [ ] Vercel deploys give automatic rollbacks — confirmed you can promote a prior deploy
- [ ] Document password-reset path for the owner user

## Final smoke test (5 min, on production URL)
- [ ] Home loads, hero animates, scroll progress bar moves
- [ ] Project filter + detail page work
- [ ] Contact form submits → success state → message appears in `/admin/inbox`
- [ ] Admin sign-in → sign-out round trip
- [ ] Mobile viewport: hamburger menu opens, all sections render
- [ ] DevTools console: zero errors on initial load
