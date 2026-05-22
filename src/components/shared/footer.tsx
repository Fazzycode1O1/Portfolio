import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-2xl font-semibold">
              {siteConfig.name}<span className="text-gradient">.dev</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-text-muted">{siteConfig.description}</p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { href: siteConfig.links.github, icon: Github, label: "GitHub" },
                { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: siteConfig.links.twitter, icon: Twitter, label: "Twitter" },
                { href: siteConfig.links.email, icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-lg glass transition-all hover:-translate-y-0.5 hover:shadow-glow-violet"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-text-subtle">Navigate</p>
            <ul className="space-y-2 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-text-muted hover:text-text">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-text-subtle">Connect</p>
            <ul className="space-y-2 text-sm">
              <li><Link href={siteConfig.links.email} className="text-text-muted hover:text-text">{siteConfig.author.email}</Link></li>
              <li><Link href={siteConfig.links.resume} className="text-text-muted hover:text-text">Resume</Link></li>
              <li><Link href="/admin/login" className="text-text-muted hover:text-text">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-mono text-xs text-text-subtle">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-text-subtle">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            All systems operational
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 select-none font-display text-[clamp(120px,20vw,280px)] font-bold leading-none tracking-tighter text-white/[0.025]"
      >
        {siteConfig.name.toUpperCase()}
      </div>
    </footer>
  );
}
