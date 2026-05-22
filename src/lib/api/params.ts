/**
 * Typed helpers for Next.js App Router dynamic route params.
 *
 * In Next 15 `params` is a Promise. Awaiting + casting per-handler is noisy,
 * so handlers should call `getRouteParam(params, "id")` instead.
 */

export type RouteParams<K extends string> = Promise<Record<K, string>>;

export async function getRouteParam<K extends string>(
  params: Promise<Record<string, string>>,
  key: K
): Promise<string> {
  const resolved = await params;
  return resolved[key] ?? "";
}

export async function getRouteParams<K extends string>(
  params: Promise<Record<string, string>>,
  ...keys: K[]
): Promise<Record<K, string>> {
  const resolved = await params;
  const out = {} as Record<K, string>;
  for (const k of keys) out[k] = resolved[k] ?? "";
  return out;
}
