# Deployment Guide

This guide walks through deploying the portfolio to **Vercel + MongoDB Atlas**.
End-to-end time: ~15 minutes.

---

## 1 · Prerequisites

- GitHub account (the repo lives here, Vercel pulls from it)
- [Vercel account](https://vercel.com/signup) (free tier is fine)
- [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) (free M0 cluster is fine)
- Node 20+ locally
- Optional: a custom domain

---

## 2 · MongoDB Atlas

1. Create a new project → **Build a Database** → choose the free **M0** tier.
2. Pick a region close to your Vercel region (default `iad1` → AWS N. Virginia, so use `us-east-1`).
3. **Database Access** → create a user, e.g. `portfolio_app`, with the **Read and write to any database** role. Save the password.
4. **Network Access** → add IP `0.0.0.0/0` (Vercel functions cold-start from variable IPs). For tighter control use [Atlas + Vercel integration](https://www.mongodb.com/docs/atlas/reference/partner-integrations/vercel/).
5. **Connect → Drivers → Node.js** → copy the SRV string. It looks like:
   ```
   mongodb+srv://portfolio_app:<password>@cluster0.xxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
   Replace `<password>` with the real one and append the DB name (`portfolio`) before the query string.

---

## 3 · Generate secrets

```bash
# JWT_SECRET — at least 32 chars
openssl rand -base64 48

# ADMIN_SEED_PASSWORD — what you'll use to sign into /admin
openssl rand -base64 18
```

---

## 4 · Seed the database (local one-time step)

```bash
cp .env.example .env.local        # fill MONGODB_URI, JWT_SECRET, ADMIN_SEED_*
npm install
npm run seed
```

This creates the owner user (bcrypt cost 12) and imports the demo content.
Verify locally first: `npm run dev` → visit `http://localhost:3000` and `/admin/login`.

---

## 5 · Push to GitHub

```bash
git add .
git commit -m "Production-ready portfolio"
git push origin main
```

The included [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `lint`, `typecheck`,
and `build` on every push and PR.

---

## 6 · Vercel project

1. **New Project** → import the GitHub repo. Vercel detects Next.js automatically.
2. **Framework Preset**: Next.js (auto). **Root directory**: leave as repo root.
3. **Build Command**: `next build` (auto from `vercel.json`).
4. **Environment Variables** — paste these for **Production, Preview, Development**:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | your Atlas SRV string |
   | `JWT_SECRET` | the 48-byte secret you generated |
   | `ADMIN_SEED_EMAIL` | only needed if re-seeding from CI |
   | `ADMIN_SEED_PASSWORD` | only needed if re-seeding from CI |
   | `GITHUB_USERNAME` | your GitHub handle (for `/api/github/stats`) |
   | `GITHUB_TOKEN` | optional, raises rate limit + enables private stats |
   | `BLOB_READ_WRITE_TOKEN` | optional, enables `/api/upload` to Vercel Blob |
   | `RESEND_API_KEY` | optional, enables outbound contact emails |
   | `CONTACT_TO_EMAIL` | where contact-form copies land |
   | `NEXT_PUBLIC_SITE_URL` | your production URL (e.g. `https://muhammadfaizanali.dev`) |

5. **Deploy**. First build takes ~60–90s.

---

## 7 · Custom domain (optional)

1. Vercel → **Project → Settings → Domains** → add `muhammadfaizanali.dev`.
2. Add the suggested DNS records at your registrar (A or CNAME).
3. Update `NEXT_PUBLIC_SITE_URL` to the new domain and **Redeploy**.
4. Update [`src/config/site.ts`](src/config/site.ts) `url` if you want absolute links / OG metadata to use the new domain.

---

## 8 · Post-deploy verification

- [ ] `https://your-domain/` loads, hero renders
- [ ] `/projects/[slug]` pages render (proof Mongo connection works)
- [ ] `/api/github/stats` returns JSON
- [ ] `/admin/login` → sign in → dashboard loads with KPIs
- [ ] Contact form on `/contact` accepts a submission and it shows up in `/admin/inbox`
- [ ] Lighthouse score (mobile, throttled): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] [SecurityHeaders.com](https://securityheaders.com) score: A or A+
- [ ] Sitemap: `https://your-domain/sitemap.xml`, robots: `https://your-domain/robots.txt`
- [ ] OG image: paste your URL into [opengraph.xyz](https://opengraph.xyz) — should show the gradient card

---

## 9 · Routine operations

| Task | How |
|------|-----|
| Roll the admin password | Connect via `mongosh` and `db.users.updateOne(...)` with a fresh bcrypt hash, or re-run `npm run seed` with new env vars |
| Add an environment variable | Vercel dashboard → Settings → Environment Variables → Redeploy |
| Hotfix a content typo | Sign into `/admin`, edit in the dashboard — public site revalidates within the cache window |
| Roll back | Vercel → Deployments → click prior deploy → **Promote to Production** |
| Inspect logs | Vercel → Deployments → Functions tab |

---

## 10 · Cost notes

- Vercel Hobby: free, fine for personal portfolios. Bandwidth cap is 100GB/mo
- Atlas M0: free, 512MB storage — more than enough for portfolio data
- Vercel Blob: free up to 500MB stored
- Total: **$0/mo** for typical traffic
