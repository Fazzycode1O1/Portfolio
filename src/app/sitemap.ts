import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllProjectSlugs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const routes = ["", "/projects", "/about", "/contact"].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));
  const slugs = await getAllProjectSlugs();
  const projectRoutes = slugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...routes, ...projectRoutes];
}
