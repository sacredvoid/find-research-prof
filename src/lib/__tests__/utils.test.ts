import { describe, it, expect } from "vitest";
import {
  formatNumber,
  safeJsonLd,
  escapeHtml,
  stripOpenAlexId,
  buildQueryString,
} from "../utils";

describe("formatNumber", () => {
  it("formats millions with one decimal", () => {
    expect(formatNumber(1234567)).toBe("1.2M");
    expect(formatNumber(5000000)).toBe("5.0M");
    expect(formatNumber(10500000)).toBe("10.5M");
  });

  it("formats thousands with one decimal", () => {
    expect(formatNumber(1234)).toBe("1.2k");
    expect(formatNumber(5000)).toBe("5.0k");
    expect(formatNumber(99999)).toBe("100.0k");
  });

  it("returns small numbers as locale strings", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });

  it("handles the million boundary", () => {
    expect(formatNumber(1000000)).toBe("1.0M");
    expect(formatNumber(999999)).toBe("1000.0k");
  });

  it("handles the thousand boundary", () => {
    expect(formatNumber(1000)).toBe("1.0k");
  });
});

describe("safeJsonLd", () => {
  it("serializes data as JSON", () => {
    const result = safeJsonLd({ name: "test" });
    expect(JSON.parse(result)).toEqual({ name: "test" });
  });

  it("escapes </script> to prevent injection", () => {
    const data = { name: '</script><script>alert("xss")</script>' };
    const result = safeJsonLd(data);
    expect(result).not.toContain("</script");
    expect(result).toContain("<\\/script");
  });

  it("escapes <!-- to prevent injection", () => {
    const data = { comment: "<!-- hidden -->" };
    const result = safeJsonLd(data);
    expect(result).not.toContain("<!--");
    expect(result).toContain("<\\!--");
  });

  it("handles case-insensitive </SCRIPT>", () => {
    const data = { val: "</SCRIPT>" };
    const result = safeJsonLd(data);
    expect(result).not.toContain("</SCRIPT");
  });
});

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<div>test</div>")).toBe("&lt;div&gt;test&lt;/div&gt;");
  });

  it("escapes quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("handles strings with no special characters", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });

  it("escapes all special characters together", () => {
    expect(escapeHtml('<a href="x" title=\'y\'>&')).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;"
    );
  });
});

describe("stripOpenAlexId", () => {
  it("strips the OpenAlex URL prefix", () => {
    expect(stripOpenAlexId("https://openalex.org/A12345")).toBe("A12345");
    expect(stripOpenAlexId("https://openalex.org/T999")).toBe("T999");
    expect(stripOpenAlexId("https://openalex.org/W100")).toBe("W100");
  });

  it("returns the string unchanged if no prefix", () => {
    expect(stripOpenAlexId("A12345")).toBe("A12345");
    expect(stripOpenAlexId("")).toBe("");
  });

  it("does not strip partial prefix matches", () => {
    expect(stripOpenAlexId("https://openalex.org")).toBe("https://openalex.org");
    expect(stripOpenAlexId("http://openalex.org/A123")).toBe("http://openalex.org/A123");
  });
});

describe("buildQueryString", () => {
  it("builds a query string from params", () => {
    const result = buildQueryString({ page: "1", query: "test" });
    expect(result).toContain("page=1");
    expect(result).toContain("query=test");
  });

  it("omits empty values", () => {
    const result = buildQueryString({ page: "1", query: "", country: "US" });
    expect(result).toContain("page=1");
    expect(result).toContain("country=US");
    expect(result).not.toContain("query");
  });

  it("returns empty string when all values are empty", () => {
    expect(buildQueryString({ a: "", b: "" })).toBe("");
  });

  it("handles special characters with URL encoding", () => {
    const result = buildQueryString({ q: "machine learning" });
    expect(result).toBe("q=machine+learning");
  });
});
