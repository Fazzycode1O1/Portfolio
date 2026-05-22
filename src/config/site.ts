export const siteConfig = {
  name: "Alif",
  title: "Alif — Software Engineer & AI Engineer",
  description:
    "Premium portfolio of a full-stack software engineer and AI enthusiast — building modern web products, intelligent systems, and developer tools.",
  url: "https://alif.dev",
  ogImage: "/og.png",
  author: { name: "Alif", email: "alif61598@gmail.com", role: "Software Engineer · AI Engineer" },
  links: {
    github: "https://github.com/Fazzycode1O1",
    linkedin: "https://linkedin.com/in/alif",
    twitter: "https://x.com/alif",
    email: "mailto:alif61598@gmail.com",
    resume: "/resume.pdf",
  },
  nav: [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
