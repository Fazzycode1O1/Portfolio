"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { FolderKanban, MessageSquare, Sparkles, Inbox } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api-client";
import { PageHeader } from "@/components/admin/page-header";

interface Analytics {
  kpis: { totalProjects: number; draftProjects: number; totalMessages: number; newMessages: number; totalSkills: number; windowDays: number };
  statusCounts: Record<string, number>;
  messagesTimeSeries: { date: string; count: number }[];
  recentMessages: { _id: string; name: string; subject: string; createdAt: string; status: string }[];
}

const COLORS = ["#7C5CFF", "#4F8BFF", "#4FE0FF", "#A0A0AE"];

export default function AdminOverview() {
  const { data, isLoading, error } = useSWR<Analytics>("/api/analytics", fetcher, { refreshInterval: 30_000 });

  const kpis = [
    { label: "Projects", value: data?.kpis.totalProjects ?? "—", sub: `${data?.kpis.draftProjects ?? 0} drafts`, icon: FolderKanban, href: "/admin/projects" },
    { label: "Messages", value: data?.kpis.totalMessages ?? "—", sub: `${data?.kpis.newMessages ?? 0} unread`, icon: MessageSquare, href: "/admin/inbox" },
    { label: "Skills", value: data?.kpis.totalSkills ?? "—", sub: "across all categories", icon: Sparkles, href: "/admin/skills" },
    { label: "Inbox window", value: `${data?.kpis.windowDays ?? 30}d`, sub: "rolling chart", icon: Inbox, href: "/admin/inbox" },
  ];

  const pieData = data
    ? Object.entries(data.statusCounts).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8">
      <PageHeader title="Welcome back, Owner" description="Live snapshot of your portfolio." />

      {error && <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">Failed to load analytics — {String(error.message ?? error)}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={k.href} className="block rounded-2xl glass p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-text-muted">{k.label}</span>
                  <Icon className="size-4 text-gradient" />
                </div>
                <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
                  {isLoading ? <span className="inline-block h-7 w-12 animate-pulse rounded bg-white/[0.06]" /> : k.value}
                </div>
                <div className="mt-1 text-xs text-text-subtle">{k.sub}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Messages — last 30 days</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.messagesTimeSeries ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#6B6B7A" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B6B7A" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#16161E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#A0A0AE" }}
                />
                <Area type="monotone" dataKey="count" stroke="#7C5CFF" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">By status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, color: "#A0A0AE" }} />
                <Tooltip contentStyle={{ background: "#16161E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent messages</h2>
          <Link href="/admin/inbox" className="font-mono text-xs text-text-muted hover:text-text">View all →</Link>
        </div>
        <ul className="divide-y divide-border">
          {(data?.recentMessages ?? []).map((m) => (
            <li key={m._id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-text">{m.subject}</p>
                <p className="font-mono text-xs text-text-subtle">{m.name}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-text-subtle">{new Date(m.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
          {!isLoading && (data?.recentMessages.length ?? 0) === 0 && (
            <li className="py-6 text-center text-sm text-text-muted">No messages yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
