import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <article className="container-x pt-32 pb-24">
      <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text">
        <ArrowLeft className="size-3" /> Back to projects
      </Link>

      <header className="mt-8 mb-10 max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs text-gradient">{project.year}</span>
          {project.featured && <Badge variant="gradient">Featured</Badge>}
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">{project.title}</h1>
        <p className="mt-4 text-lg text-text-muted">{project.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <Button asChild>
              <Link href={project.liveUrl} target="_blank"><ExternalLink /> Live site</Link>
            </Button>
          )}
          {project.repoUrl && (
            <Button asChild variant="secondary">
              <Link href={project.repoUrl} target="_blank"><Github /> Source</Link>
            </Button>
          )}
        </div>
      </header>

      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border-gradient">
        <Image src={project.cover} alt={project.title} fill className="object-cover" priority />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8 text-text-muted leading-relaxed">
          <section>
            <h2 className="mb-3 font-display text-2xl font-semibold text-text">Overview</h2>
            <p>{project.description}</p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">Tech stack</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {project.categories.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
