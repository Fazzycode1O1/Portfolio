import {
  LayoutDashboard, FolderKanban, Briefcase, MessageSquare, Sparkles,
  Settings, Quote, Code2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: ReadonlyArray<NavItem> = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/inbox", label: "Inbox", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
