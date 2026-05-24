import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github } from "lucide-react";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { ProjectHero } from "@/components/sections/project-hero";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    openGraph: { title: p.title, description: p.tagline, images: [p.cover] },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="relative">
      <ProjectHero project={project} />

      <div className="container-x py-24 md:py-32">
        <div className="grid grid-cols-12 gap-10 md:gap-16">
          {/* Reading column */}
          <div className="col-span-12 lg:col-span-8">
            <section>
              <p className="eyebrow mb-4">Overview</p>
              <p className="text-lg text-text-muted leading-relaxed body-pretty md:text-xl">
                {project.description}
              </p>
            </section>
          </div>

          {/* Sticky rail */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-10">
              <div>
                <p className="eyebrow mb-4">Tech stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>

              {project.categories.length > 0 && (
                <div>
                  <p className="eyebrow mb-4">Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.categories.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(project.liveUrl || project.repoUrl) && (
                <div>
                  <p className="eyebrow mb-4">Links</p>
                  <ul className="space-y-3">
                    {project.liveUrl && (
                      <li>
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          className="group/link relative inline-flex items-center gap-2 text-text transition-colors duration-fast ease-out-quart hover:text-signal-bright"
                        >
                          <ExternalLink className="size-4" />
                          <span>Live site</span>
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-6 right-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover/link:scale-x-100"
                          />
                        </Link>
                      </li>
                    )}
                    {project.repoUrl && (
                      <li>
                        <Link
                          href={project.repoUrl}
                          target="_blank"
                          className="group/link relative inline-flex items-center gap-2 text-text transition-colors duration-fast ease-out-quart hover:text-signal-bright"
                        >
                          <Github className="size-4" />
                          <span>Source code</span>
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-6 right-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover/link:scale-x-100"
                          />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="border-t border-border pt-8">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-text-subtle transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  <span className="size-1 rounded-full bg-accent" />
                  All projects
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
