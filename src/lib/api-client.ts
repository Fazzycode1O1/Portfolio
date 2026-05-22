export class ApiError extends Error {
  constructor(message: string, public status: number, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const init: RequestInit = {
    method,
    credentials: "same-origin",
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body == null ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  };
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const message = (data && typeof data === "object" && "error" in data ? (data as Record<string, string>).error : null) ?? res.statusText;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export const api = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body?: unknown) => request<T>("POST", url, body),
  patch: <T>(url: string, body?: unknown) => request<T>("PATCH", url, body),
  delete: <T>(url: string) => request<T>("DELETE", url),
};

export const fetcher = <T>(url: string) => api.get<T>(url);
