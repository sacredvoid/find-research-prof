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
