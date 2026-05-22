import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";

export interface IService {
  title: string;
  icon: string;
  summary: string;
  deliverables: string[];
  priceRange?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceDoc = HydratedDocument<IService>;

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    icon: { type: String, default: "layers", maxlength: 40 },
    summary: { type: String, required: true, minlength: 1, maxlength: 400 },
    deliverables: { type: [String], default: [], validate: (v: string[]) => v.length <= 12 },
    priceRange: { type: String, maxlength: 80 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ order: 1 });

export const Service: Model<IService> =
  (models.Service as Model<IService>) ?? model<IService>("Service", ServiceSchema);
