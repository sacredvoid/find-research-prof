/**
 * In-memory LRU-ish cache for server-side OpenAlex API responses.
 * Prevents redundant API calls for the same author/topic within the TTL window.
 *
 * This runs in the Node.js process (server components) so it persists
 * across requests during the lifetime of the server process.
 */

const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
const MAX_ENTRIES = 500;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ApiCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    // Evict oldest entries if at capacity
    if (this.store.size >= MAX_ENTRIES) {
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) {
        this.store.delete(firstKey);
      }
    }
    this.store.set(key, { data, expiresAt: Date.now() + ttl });
  }

  /** Wrap a fetch function with caching */
  async fetch<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;
    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }
}

export const apiCache = new ApiCache();
