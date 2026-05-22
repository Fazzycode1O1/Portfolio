import { ok, serverError } from "@/lib/api";

export const runtime = "edge";
export const revalidate = 3600; // 1h

const USERNAME = process.env.GITHUB_USERNAME ?? "Fazzycode1O1";
const TOKEN = process.env.GITHUB_TOKEN;

interface Repo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  fork: boolean;
}

async function gh(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub ${path} returned ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [user, repos] = (await Promise.all([
      gh(`/users/${USERNAME}`),
      gh(`/users/${USERNAME}/repos?per_page=100&sort=updated`),
    ])) as [{ followers: number; public_repos: number }, Repo[]];

    const owned = repos.filter((r) => !r.fork);
    const stars = owned.reduce((s, r) => s + r.stargazers_count, 0);
    const forks = owned.reduce((s, r) => s + r.forks_count, 0);
    const topRepos = [...owned]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        desc: r.description,
        stars: r.stargazers_count,
        lang: r.language,
        url: r.html_url,
      }));

    const langMap = new Map<string, number>();
    for (const r of owned) if (r.language) langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
    const total = Array.from(langMap.values()).reduce((s, n) => s + n, 0) || 1;
    const languages = Array.from(langMap.entries())
      .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);

    return ok({
      username: USERNAME,
      followers: user.followers,
      repos: user.public_repos,
      stars,
      forks,
      topRepos,
      languages,
    });
  } catch (e) {
    console.error("[github/stats]", e);
    return serverError("GitHub fetch failed");
  }
}
