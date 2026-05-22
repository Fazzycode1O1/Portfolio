/**
 * Runtime-agnostic constants.
 *
 * This module must NOT import from `next/headers` or other Node-only APIs so
 * that the Edge runtime (middleware) can use it alongside the Node runtime.
 */

export const AUTH_COOKIE = "auth_token";
/** 12 hours — short enough to limit blast radius if a token leaks; long enough not to annoy. */
export const AUTH_TTL_SECONDS = 60 * 60 * 12;

/** JWT claim values. Verifying these stops tokens minted for other apps (with the same secret) from being accepted here. */
export const JWT_ISSUER = "muhammadfaizanali.dev";
export const JWT_AUDIENCE = "muhammadfaizanali.dev/admin";
