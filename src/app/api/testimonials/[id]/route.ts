import { Testimonial } from "@/models/Testimonial";
import { testimonialSchema, testimonialPatchSchema } from "@/lib/validators";
import { getOneHandler, patchHandler, deleteHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = {
  model: Testimonial,
  entity: "Testimonial",
  createSchema: testimonialSchema,
  patchSchema: testimonialPatchSchema,
  revalidatePaths: ["/"],
};

export const GET = getOneHandler(opts);
export const PATCH = patchHandler(opts);
export const DELETE = deleteHandler(opts);
