/**
 * Shared validation regexes. Defined once so the schemas, validators, and any
 * future client-side check agree on the same definition of "valid".
 */

export const URL_REGEX = /^https?:\/\//i;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** kebab-case: lowercase letters, digits, single hyphen separators. */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** YYYY or YYYY-MM. */
export const PERIOD_REGEX = /^\d{4}(-\d{2})?$/;
