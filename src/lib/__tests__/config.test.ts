import { describe, it, expect } from "vitest";
import {
  OPENALEX_BASE_URL,
  SITE_NAME,
  MAX_GRAPH_NODES,
  SEARCH_PAGE_SIZE,
  PROFESSOR_PAGE_SIZE,
  COUNTRIES,
  countryCodeToName,
} from "../config";

describe("config constants", () => {
  it("has correct OpenAlex base URL", () => {
    expect(OPENALEX_BASE_URL).toBe("https://api.openalex.org");
  });

  it("has a site name", () => {
    expect(SITE_NAME).toBe("ResearchProf");
  });

  it("has reasonable page sizes", () => {
    expect(SEARCH_PAGE_SIZE).toBeGreaterThan(0);
    expect(PROFESSOR_PAGE_SIZE).toBeGreaterThan(0);
  });

  it("has a graph node limit", () => {
    expect(MAX_GRAPH_NODES).toBeGreaterThan(0);
    expect(MAX_GRAPH_NODES).toBe(150);
  });
});

describe("COUNTRIES", () => {
  it("starts with 'All countries' option with empty code", () => {
    expect(COUNTRIES[0]).toEqual({ code: "", label: "All countries" });
  });

  it("has US as the second entry", () => {
    expect(COUNTRIES[1]).toEqual({ code: "US", label: "United States" });
  });

  it("has unique country codes (excluding empty)", () => {
    const codes = COUNTRIES.filter((c) => c.code).map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("has more than 40 countries", () => {
    expect(COUNTRIES.length).toBeGreaterThan(40);
  });
});

describe("countryCodeToName", () => {
  it("maps known codes to names", () => {
    expect(countryCodeToName("US")).toBe("United States");
    expect(countryCodeToName("GB")).toBe("United Kingdom");
    expect(countryCodeToName("JP")).toBe("Japan");
    expect(countryCodeToName("IN")).toBe("India");
  });

  it("returns the code for unknown codes", () => {
    expect(countryCodeToName("XX")).toBe("XX");
    expect(countryCodeToName("ZZ")).toBe("ZZ");
  });

  it("returns empty string for empty input", () => {
    expect(countryCodeToName("")).toBe("");
  });
});
