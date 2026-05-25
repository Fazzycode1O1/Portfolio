export const siteConfig = {
  name: "Muhammad Faizan Ali",
  title: "Muhammad Faizan Ali — Software Engineer UnderGraduate",
  description:
    "Portfolio of a full-stack junior software engineer undergraduate of 7th semester and AI/ML enthusiast. Showcasing projects, skills, and experience in web development ",
  url: "https://muhammad-faizan-ali-portfolio.vercel.app",
  ogImage: "/og.png",
  author: { name: "Muhammad Faizan Ali", email: "mfaizanali.alif@gmail.com", role: "Software Engineer Undergraduate" },
  links: {
    github: "https://github.com/Fazzycode1O1",
    linkedin: "https://www.linkedin.com/in/muhammad-faizan-ali-80103430b/",
    twitter: "https://x.com/",
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
