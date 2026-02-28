import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to re-import a fresh cache for each test.
// The module exports a singleton, so we use dynamic import with vi.resetModules.

describe("ApiCache", () => {
  let apiCache: typeof import("../cache")["apiCache"];

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../cache");
    apiCache = mod.apiCache;
  });

  it("returns null for missing keys", () => {
    expect(apiCache.get("nonexistent")).toBeNull();
  });

  it("stores and retrieves values", () => {
    apiCache.set("key1", { data: "hello" });
    expect(apiCache.get("key1")).toEqual({ data: "hello" });
  });

  it("respects TTL expiration", () => {
    vi.useFakeTimers();
    apiCache.set("key2", "value", 1000); // 1 second TTL
    expect(apiCache.get("key2")).toBe("value");

    vi.advanceTimersByTime(1001);
    expect(apiCache.get("key2")).toBeNull();
    vi.useRealTimers();
  });

  it("evicts oldest entries when at capacity", () => {
    // MAX_ENTRIES is 500. Set 500 entries, then one more should evict the first.
    for (let i = 0; i < 500; i++) {
      apiCache.set(`key-${i}`, `value-${i}`);
    }
    expect(apiCache.get("key-0")).toBe("value-0"); // Still present

    apiCache.set("key-500", "value-500"); // This triggers eviction of key-0
    expect(apiCache.get("key-0")).toBeNull();
    expect(apiCache.get("key-500")).toBe("value-500");
    expect(apiCache.get("key-1")).toBe("value-1"); // key-1 should still be there
  });

  it("fetch() returns cached data on hit", async () => {
    const fetcher = vi.fn().mockResolvedValue("fetched-data");
    apiCache.set("cached-key", "cached-data");

    const result = await apiCache.fetch("cached-key", fetcher);
    expect(result).toBe("cached-data");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("fetch() calls fetcher and caches on miss", async () => {
    const fetcher = vi.fn().mockResolvedValue("new-data");

    const result = await apiCache.fetch("new-key", fetcher);
    expect(result).toBe("new-data");
    expect(fetcher).toHaveBeenCalledOnce();

    // Second call should use cache
    const result2 = await apiCache.fetch("new-key", fetcher);
    expect(result2).toBe("new-data");
    expect(fetcher).toHaveBeenCalledOnce(); // Not called again
  });

  it("fetch() propagates errors from fetcher", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("API down"));

    await expect(apiCache.fetch("fail-key", fetcher)).rejects.toThrow("API down");
  });
});
