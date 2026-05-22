import mongoose, { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

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

export type AuditLogDoc = InferSchemaType<typeof AuditLogSchema> & { _id: mongoose.Types.ObjectId };
export const AuditLog: Model<AuditLogDoc> =
  (models.AuditLog as Model<AuditLogDoc>) ?? model<AuditLogDoc>("AuditLog", AuditLogSchema);

export async function audit(
  entry: { actorId?: string; actorEmail?: string; action: string; entity: string; entityId?: string; diff?: unknown }
) {
  try {
    await AuditLog.create(entry);
  } catch (e) {
    console.warn("[audit] failed", e);
  }
}
