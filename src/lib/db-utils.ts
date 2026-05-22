import type { FilterQuery, Model, PipelineStage, PopulateOptions, SortOrder } from "mongoose";

export interface PaginateOptions<T> {
  page?: number;
  limit?: number;
  sort?: Record<string, SortOrder>;
  filter?: FilterQuery<T>;
  select?: string;
  populate?: PopulateOptions | PopulateOptions[];
  lean?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

const MAX_LIMIT = 100;

export async function paginate<T>(
  model: Model<T>,
  opts: PaginateOptions<T> = {}
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(opts.limit ?? 20)));
  const filter = opts.filter ?? {};

  const cursor = model.find(filter);
  if (opts.sort) cursor.sort(opts.sort);
  if (opts.select) cursor.select(opts.select);
  if (opts.populate) cursor.populate(opts.populate);
  if (opts.lean !== false) cursor.lean();

  const [items, total] = await Promise.all([
    cursor.skip((page - 1) * limit).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    items: items as T[],
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
    hasMore: page * limit < total,
  };
}

/** Build a case-insensitive regex filter against the given fields. */
export function searchFilter<T>(query: string | undefined, fields: (keyof T & string)[]): FilterQuery<T> {
  if (!query?.trim()) return {} as FilterQuery<T>;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(escaped, "i");
  return { $or: fields.map((f) => ({ [f]: rx })) } as FilterQuery<T>;
}

/** Parse `?sort=field` or `?sort=-field,createdAt` into a Mongoose sort object. */
export function parseSort(input: string | null | undefined, fallback: Record<string, SortOrder> = { createdAt: -1 }): Record<string, SortOrder> {
  if (!input) return fallback;
  const out: Record<string, SortOrder> = {};
  for (const raw of input.split(",")) {
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith("-")) out[t.slice(1)] = -1;
    else out[t] = 1;
  }
  return Object.keys(out).length ? out : fallback;
}

/** Parse query-string params into PaginateOptions. */
export function parsePagination<T>(searchParams: URLSearchParams, defaults: PaginateOptions<T> = {}): PaginateOptions<T> {
  return {
    ...defaults,
    page: Number(searchParams.get("page")) || defaults.page || 1,
    limit: Number(searchParams.get("limit")) || defaults.limit || 20,
    sort: parseSort(searchParams.get("sort"), defaults.sort),
  };
}

/** Strip undefined fields so $set patches don't clobber values with `undefined`. */
export function pruneUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k as keyof T] = v as T[keyof T];
  return out;
}

/** Cheap shape check for ObjectId strings. */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/** Group-and-count aggregation. Useful for analytics (e.g. messages by status). */
export async function countByField<T>(
  model: Model<T>,
  field: keyof T & string,
  filter: FilterQuery<T> = {}
): Promise<Record<string, number>> {
  const pipeline: PipelineStage[] = [
    { $match: filter },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ];
  const rows = (await model.aggregate(pipeline)) as { _id: string; count: number }[];
  return Object.fromEntries(rows.map((r) => [String(r._id), r.count]));
}

/** Time-bucketed count of documents (by day) for the last N days. */
export async function timeSeries<T>(
  model: Model<T>,
  days: number,
  field: keyof T & string = "createdAt" as keyof T & string
): Promise<{ date: string; count: number }[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const pipeline: PipelineStage[] = [
    { $match: { [field]: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: `$${field}` } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
  ];
  return (await model.aggregate(pipeline)) as { date: string; count: number }[];
}
