import { Testimonial } from "@/models/Testimonial";
import { testimonialSchema, testimonialPatchSchema } from "@/lib/validators";
import { listHandler, createHandler } from "@/lib/crud";

export const runtime = "nodejs";

const opts = {
  model: Testimonial,
  entity: "Testimonial",
  createSchema: testimonialSchema,
  patchSchema: testimonialPatchSchema,
  publicFilter: { approved: true },
  revalidatePaths: ["/"],
};

export const GET = listHandler(opts);
export const POST = createHandler(opts);
