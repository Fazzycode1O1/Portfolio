/**
 * Runtime-agnostic constants.
 *
 * This module must NOT import from `next/headers` or other Node-only APIs so
 * that the Edge runtime (middleware) can use it alongside the Node runtime.
 */

export const AUTH_COOKIE = "auth_token";
export const AUTH_TTL_SECONDS = 60 * 60 * 24 * 2; // 2 days
