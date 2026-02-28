/**
 * Format a number for display (e.g. 1234 -> "1.2k", 1234567 -> "1.2M")
 */
export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toLocaleString();
}

/**
 * Escape strings for safe inclusion in JSON-LD script blocks.
 * Prevents script injection via </script> or <!-- sequences.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/<\/script/gi, "<\\/script")
    .replace(/<!--/g, "<\\!--");
}

/**
 * Escape HTML entities to prevent XSS when interpolating into raw HTML strings.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const OPENALEX_PREFIX = "https://openalex.org/";

/** Strip the OpenAlex URL prefix from an ID, e.g. "https://openalex.org/A123" -> "A123" */
export function stripOpenAlexId(url: string): string {
  return url.startsWith(OPENALEX_PREFIX) ? url.slice(OPENALEX_PREFIX.length) : url;
}

/** Build a clean URL query string, omitting empty values */
export function buildQueryString(params: Record<string, string>): string {
  const filtered = Object.entries(params).filter(([, v]) => v);
  return new URLSearchParams(filtered).toString();
}
