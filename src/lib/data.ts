import type { Project, Skill, ExperienceItem, Service, Testimonial } from "@/types";

export const skills: Skill[] = [
  { name: "TypeScript", category: "language", proficiency: 5 },
  { name: "Python", category: "language", proficiency: 5 },
  { name: "Go", category: "language", proficiency: 3 },
  { name: "Rust", category: "language", proficiency: 2 },
  { name: "Next.js", category: "framework", proficiency: 5 },
  { name: "React", category: "framework", proficiency: 5 },
  { name: "Node.js", category: "framework", proficiency: 5 },
  { name: "FastAPI", category: "framework", proficiency: 4 },
  { name: "LangChain", category: "ai", proficiency: 5 },
  { name: "OpenAI / Anthropic", category: "ai", proficiency: 5 },
  { name: "PyTorch", category: "ai", proficiency: 4 },
  { name: "Vector DBs", category: "ai", proficiency: 4 },
  { name: "Docker", category: "devops", proficiency: 4 },
  { name: "AWS", category: "devops", proficiency: 4 },
  { name: "Vercel", category: "devops", proficiency: 5 },
  { name: "GitHub Actions", category: "devops", proficiency: 4 },
  { name: "MongoDB", category: "db", proficiency: 5 },
  { name: "PostgreSQL", category: "db", proficiency: 4 },
  { name: "Redis", category: "db", proficiency: 4 },
  { name: "Prisma", category: "db", proficiency: 4 },
  { name: "Figma", category: "tool", proficiency: 4 },
  { name: "Git", category: "tool", proficiency: 5 },
];

export const projects: Project[] = [
  {
    slug: "neural-notes",
    title: "Neural Notes",
    tagline: "AI-powered second brain with semantic search.",
    description:
      "A productivity app that ingests your notes, PDFs, and bookmarks and lets you query them in natural language using RAG over a vector store.",
    cover:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    tech: ["Next.js", "TypeScript", "OpenAI", "Pinecone", "MongoDB"],
    categories: ["AI", "Full-Stack"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/Fazzycode1O1",
    featured: true,
    year: 2025,
  },
  {
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    tagline: "Realtime product analytics with sub-second dashboards.",
    description: "Event pipeline ingesting millions of events/day with ClickHouse-backed dashboards.",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tech: ["Next.js", "ClickHouse", "Kafka", "Go"],
    categories: ["Data", "Full-Stack"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/Fazzycode1O1",
    featured: true,
    year: 2025,
  },
  {
    slug: "agent-forge",
    title: "Agent Forge",
    tagline: "Visual builder for multi-agent LLM workflows.",
    description: "Drag-and-drop canvas for composing agents, tools, and memory with versioned deployments.",
    cover:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    tech: ["React Flow", "LangChain", "FastAPI", "Postgres"],
    categories: ["AI", "Tools"],
    repoUrl: "https://github.com/Fazzycode1O1",
    featured: true,
    year: 2024,
  },
  {
    slug: "lumen-ui",
    title: "Lumen UI",
    tagline: "Open-source React component library with motion baked in.",
    description: "60+ accessible components, themeable design tokens, Framer Motion presets.",
    cover:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    tech: ["React", "TypeScript", "Framer Motion", "Tailwind"],
    categories: ["OSS", "Frontend"],
    repoUrl: "https://github.com/Fazzycode1O1",
    year: 2024,
  },
  {
    slug: "tradesight",
    title: "TradeSight",
    tagline: "Algorithmic trading sandbox with backtest engine.",
    description: "Python backtester + Next.js UI for strategy authoring and walk-forward analysis.",
    cover:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    tech: ["Python", "Next.js", "Postgres"],
    categories: ["Finance", "Data"],
    repoUrl: "https://github.com/Fazzycode1O1",
    year: 2023,
  },
  {
    slug: "voxa",
    title: "Voxa",
    tagline: "Realtime voice-to-voice AI assistant.",
    description: "Streaming ASR + LLM + TTS pipeline with sub-400ms latency.",
    cover:
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80",
    tech: ["WebRTC", "Whisper", "Anthropic", "ElevenLabs"],
    categories: ["AI"],
    year: 2024,
  },
];

export const experience: ExperienceItem[] = [
  {
    company: "Independent",
    role: "Founder & AI Engineer",
    type: "work",
    start: "2024",
    end: null,
    location: "Remote",
    highlights: [
      "Shipping AI-first developer tools used by 5k+ engineers.",
      "Built RAG infrastructure handling 10M+ embeddings.",
      "Open-sourced 4 libraries with combined 2k+ GitHub stars.",
    ],
  },
  {
    company: "Stealth Startup",
    role: "Senior Full-Stack Engineer",
    type: "work",
    start: "2022",
    end: "2024",
    location: "Remote",
    highlights: [
      "Led the rewrite of a legacy monolith into a Next.js + Node services architecture.",
      "Cut p95 latency from 1.2s to 180ms.",
      "Mentored 3 engineers and owned the design-system migration.",
    ],
  },
  {
    company: "Agency",
    role: "Full-Stack Engineer",
    type: "work",
    start: "2020",
    end: "2022",
    location: "Hybrid",
    highlights: [
      "Delivered 12+ client projects spanning fintech, e-commerce, and SaaS.",
      "Built reusable component library adopted across 8 client codebases.",
    ],
  },
  {
    company: "University",
    role: "BSc Computer Science",
    type: "education",
    start: "2016",
    end: "2020",
    location: "On-campus",
    highlights: ["Graduated with First-Class Honours.", "Thesis on transformer architectures for code completion."],
  },
];

export const services: Service[] = [
  {
    title: "Full-Stack Web Apps",
    icon: "layers",
    summary: "End-to-end product builds with Next.js, Node, and modern databases.",
    deliverables: ["Architecture & design system", "Production-ready codebase", "CI/CD + monitoring"],
  },
  {
    title: "AI Engineering",
    icon: "sparkles",
    summary: "RAG pipelines, agentic workflows, and LLM-powered features.",
    deliverables: ["Evaluation harness", "Vector store integration", "Cost & latency tuning"],
  },
  {
    title: "Technical Consulting",
    icon: "compass",
    summary: "Architecture reviews, hiring help, and engineering strategy.",
    deliverables: ["Audit report", "Roadmap proposal", "Pairing sessions"],
  },
];

export const testimonials: Testimonial[] = [
  {
    author: "Sarah Chen",
    role: "CTO",
    company: "Northbeam",
    quote: "Muhammad Faizan Ali rebuilt our data pipeline in two weeks. It now handles 20× the load on half the infra.",
    rating: 5,
  },
  {
    author: "Marcus Reyes",
    role: "Head of Product",
    company: "Lumen",
    quote: "One of the rare engineers who treats UX and infra with equal seriousness. Ship-fast, ship-right.",
    rating: 5,
  },
  {
    author: "Priya Nair",
    role: "Founder",
    company: "Voxa",
    quote: "Our AI features went from prototype to production thanks to Muhammad Faizan Ali's RAG architecture.",
    rating: 5,
  },
];

export const stats = [
  { label: "Years building", value: 6, suffix: "+" },
  { label: "Projects shipped", value: 40, suffix: "+" },
  { label: "GitHub stars", value: 2100, suffix: "+" },
  { label: "Happy clients", value: 18, suffix: "" },
];
