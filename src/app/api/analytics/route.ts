import { withAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { ok, handle } from "@/lib/api";
import { countByField, timeSeries } from "@/lib/db-utils";

export const runtime = "nodejs";

export const GET = withAuth(async () =>
  handle(async () => {
    await connectDB();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [totalProjects, draftProjects, totalMessages, newMessages, totalSkills, recent, statusCounts, msgSeries] =
      await Promise.all([
        Project.countDocuments({ status: "published" }),
        Project.countDocuments({ status: "draft" }),
        ContactMessage.countDocuments({}),
        ContactMessage.countDocuments({ status: "new" }),
        Skill.countDocuments({}),
        ContactMessage.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(10).lean(),
        countByField(ContactMessage, "status"),
        timeSeries(ContactMessage, 30, "createdAt"),
      ]);

    return ok({
      kpis: { totalProjects, draftProjects, totalMessages, newMessages, totalSkills, windowDays: 30 },
      statusCounts,
      messagesTimeSeries: msgSeries,
      recentMessages: recent,
    });
  })
);
