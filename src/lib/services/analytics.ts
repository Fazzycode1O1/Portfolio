/**
 * Analytics service — aggregates the admin dashboard snapshot.
 *
 * Pure business logic: takes no Request, returns plain data. Lets API routes
 * stay thin (auth + serialize) and lets Server Components call the same code
 * path without going through HTTP.
 */

import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { countByField, timeSeries } from "@/lib/db-utils";

export interface AnalyticsSnapshot {
  kpis: {
    totalProjects: number;
    draftProjects: number;
    totalMessages: number;
    newMessages: number;
    totalSkills: number;
    windowDays: number;
  };
  statusCounts: Record<string, number>;
  messagesTimeSeries: { date: string; count: number }[];
  recentMessages: Array<{
    _id: unknown;
    name: string;
    subject: string;
    createdAt: Date;
    status: string;
  }>;
}

const WINDOW_DAYS = 30;

async function computeAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  await connectDB();
  const since = new Date();
  since.setDate(since.getDate() - WINDOW_DAYS);

  const [
    totalProjects,
    draftProjects,
    totalMessages,
    newMessages,
    totalSkills,
    recent,
    statusCounts,
    msgSeries,
  ] = await Promise.all([
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ status: "draft" }),
    ContactMessage.countDocuments({}),
    ContactMessage.countDocuments({ status: "new" }),
    Skill.countDocuments({}),
    ContactMessage.find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    countByField(ContactMessage, "status"),
    timeSeries(ContactMessage, WINDOW_DAYS, "createdAt"),
  ]);

  return {
    kpis: { totalProjects, draftProjects, totalMessages, newMessages, totalSkills, windowDays: WINDOW_DAYS },
    statusCounts,
    messagesTimeSeries: msgSeries,
    recentMessages: recent as AnalyticsSnapshot["recentMessages"],
  };
}

/**
 * Cached at the Node-runtime layer for 60s. Shared across all admin tabs hitting
 * the same region. Tagged so future mutations can call `revalidateTag("analytics")`
 * to invalidate on writes.
 */
export const getAnalyticsSnapshot = unstable_cache(
  computeAnalyticsSnapshot,
  ["analytics-snapshot-v1"],
  { revalidate: 60, tags: ["analytics"] }
);
