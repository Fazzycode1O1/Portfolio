import { withAuth } from "@/lib/auth";
import { ok, handle } from "@/lib/api";
import { getAnalyticsSnapshot } from "@/lib/services/analytics";

export const runtime = "nodejs";

export const GET = withAuth(async () =>
  handle(async () => ok(await getAnalyticsSnapshot()))
);
