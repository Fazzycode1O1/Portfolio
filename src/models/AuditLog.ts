import mongoose, { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { revalidateTag } from "next/cache";

/** Entities whose mutations should bust the analytics snapshot cache. */
const ANALYTICS_ENTITIES = new Set(["Project", "Skill", "ContactMessage"]);

const AuditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorEmail: String,
    action: { type: String, required: true }, // create | update | delete
    entity: { type: String, required: true }, // Project | Skill | …
    entityId: String,
    diff: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });
// Bound storage: audit entries auto-expire after 90 days. Mongo's TTL monitor
// runs every 60s — eventual deletion, not exact.
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
// Common query path: "show me everything touching this entity".
AuditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

export type AuditLogDoc = InferSchemaType<typeof AuditLogSchema> & { _id: mongoose.Types.ObjectId };
export const AuditLog: Model<AuditLogDoc> =
  (models.AuditLog as Model<AuditLogDoc>) ?? model<AuditLogDoc>("AuditLog", AuditLogSchema);

/**
 * Fire-and-forget audit write.
 *
 * Returns `void` deliberately — callers should NOT await this. The audit entry
 * is non-critical and must never delay the user response. Failures are logged
 * but never thrown.
 *
 * Returns a Promise (typed `void`) so test helpers / debugging can attach to it
 * via `audit(...).catch(...)`, but the request-path code treats it as fire-and-forget.
 */
export function audit(
  entry: { actorId?: string; actorEmail?: string; action: string; entity: string; entityId?: string; diff?: unknown }
): Promise<void> {
  if (ANALYTICS_ENTITIES.has(entry.entity)) {
    try { revalidateTag("analytics"); } catch { /* outside request scope — ignore */ }
  }
  return AuditLog.create(entry)
    .then(() => undefined)
    .catch((e) => {
      console.warn("[audit] failed", e);
    });
}
