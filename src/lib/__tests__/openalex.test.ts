import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Reset modules before each test to get a clean cache
beforeEach(() => {
  vi.resetModules();
  mockFetch.mockReset();
});

function mockJsonResponse(data: unknown) {
  return {
    ok: true,
    json: () => Promise.resolve(data),
  };
}

function mockAuthor(overrides: Record<string, unknown> = {}) {
  return {
    id: "https://openalex.org/A100",
    display_name: "Jane Smith",
    works_count: 50,
    cited_by_count: 1000,
    summary_stats: { h_index: 20, i10_index: 15, "2yr_mean_citedness": 5.0 },
    last_known_institutions: [
      { id: "I1", display_name: "MIT", country_code: "US", type: "education" },
    ],
    topics: [
      {
        id: "https://openalex.org/T1",
        display_name: "Machine Learning",
        count: 10,
        subfield: { id: "S1", display_name: "AI" },
        field: { id: "F1", display_name: "Computer Science" },
        domain: { id: "D1", display_name: "Physical Sciences" },
      },
    ],
    ids: { openalex: "https://openalex.org/A100", orcid: "0000-0001-0000-0000" },
    works_api_url: "https://api.openalex.org/works?filter=author.id:A100",
    updated_date: "2024-01-01",
    ...overrides,
  };
}

describe("getAuthor", () => {
  it("fetches an author by ID", async () => {
    const author = mockAuthor();
    mockFetch.mockResolvedValueOnce(mockJsonResponse(author));

    const { getAuthor } = await import("../openalex");
    const result = await getAuthor("A100");

    expect(result).toEqual(author);
    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0].toString();
    expect(calledUrl).toContain("/authors/A100");
  });

  it("rejects invalid author IDs", async () => {
    const { getAuthor } = await import("../openalex");

    await expect(getAuthor("invalid")).rejects.toThrow("Invalid author ID");
    await expect(getAuthor("B100")).rejects.toThrow("Invalid author ID");
    await expect(getAuthor("")).rejects.toThrow("Invalid author ID");
  });
});

describe("getAuthorWorks", () => {
  it("fetches works with default options", async () => {
    const worksData = {
      results: [{ id: "W1", title: "Paper 1" }],
      meta: { count: 1 },
    };
    mockFetch.mockResolvedValueOnce(mockJsonResponse(worksData));

    const { getAuthorWorks } = await import("../openalex");
    const result = await getAuthorWorks("A100");

    expect(result.works).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });

  it("passes sort and page options", async () => {
    const worksData = { results: [], meta: { count: 0 } };
    mockFetch.mockResolvedValueOnce(mockJsonResponse(worksData));

    const { getAuthorWorks } = await import("../openalex");
    await getAuthorWorks("A100", { sort: "cited", page: 2 });

    const calledUrl = mockFetch.mock.calls[0][0].toString();
    expect(calledUrl).toContain("sort=cited_by_count%3Adesc");
    expect(calledUrl).toContain("page=2");
  });

  it("rejects invalid IDs", async () => {
    const { getAuthorWorks } = await import("../openalex");
    await expect(getAuthorWorks("INVALID")).rejects.toThrow("Invalid author ID");
  });
});

describe("searchByName", () => {
  it("searches authors by name with filters", async () => {
    const data = {
      results: [mockAuthor()],
      meta: { count: 1 },
    };
    mockFetch.mockResolvedValueOnce(mockJsonResponse(data));

    const { searchByName } = await import("../openalex");
    const result = await searchByName("Jane Smith", { country: "US" });

    expect(result.professors).toHaveLength(1);
    expect(result.professors[0].name).toBe("Jane Smith");
    expect(result.professors[0].id).toBe("A100");
    expect(result.topicName).toBeNull();

    const calledUrl = mockFetch.mock.calls[0][0].toString();
    expect(calledUrl).toContain("search=Jane+Smith");
    expect(calledUrl).toContain("country_code%3AUS");
  });

  it("converts author data to Professor format correctly", async () => {
    const data = {
      results: [mockAuthor()],
      meta: { count: 1 },
    };
    mockFetch.mockResolvedValueOnce(mockJsonResponse(data));

    const { searchByName } = await import("../openalex");
    const result = await searchByName("Jane Smith");

    const prof = result.professors[0];
    expect(prof.id).toBe("A100");
    expect(prof.institution).toBe("MIT");
    expect(prof.country).toBe("United States");
    expect(prof.countryCode).toBe("US");
    expect(prof.hIndex).toBe(20);
    expect(prof.worksCount).toBe(50);
    expect(prof.citedByCount).toBe(1000);
    expect(prof.topics[0].name).toBe("Machine Learning");
    expect(prof.orcid).toBe("0000-0001-0000-0000");
  });
});

describe("searchByTopic", () => {
  it("finds a topic and searches by topic ID", async () => {
    const topicData = {
      results: [{ id: "https://openalex.org/T1", display_name: "Machine Learning" }],
    };
    const authorsData = {
      results: [mockAuthor()],
      meta: { count: 1 },
    };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(topicData))
      .mockResolvedValueOnce(mockJsonResponse(authorsData));

    const { searchByTopic } = await import("../openalex");
    const result = await searchByTopic("machine learning");

    expect(result.topicName).toBe("Machine Learning");
    expect(result.professors).toHaveLength(1);
  });

  it("falls back to work-based search when no topic found", async () => {
    const topicData = { results: [] };
    const worksData = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
          ],
        },
      ],
    };
    const authorsData = {
      results: [mockAuthor()],
      meta: { count: 1 },
    };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(topicData))
      .mockResolvedValueOnce(mockJsonResponse(worksData))
      .mockResolvedValueOnce(mockJsonResponse(authorsData));

    const { searchByTopic } = await import("../openalex");
    const result = await searchByTopic("obscure query");

    expect(result.topicName).toBeNull();
    expect(result.professors).toHaveLength(1);
  });
});

describe("getAuthorCoauthors", () => {
  it("returns top co-authors excluding the author themselves", async () => {
    const worksData = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
            { author: { id: "https://openalex.org/A200", display_name: "John Doe" }, institutions: [] },
            { author: { id: "https://openalex.org/A300", display_name: "Alice" }, institutions: [] },
          ],
        },
        {
          id: "W2",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
            { author: { id: "https://openalex.org/A200", display_name: "John Doe" }, institutions: [] },
          ],
        },
      ],
    };
    mockFetch.mockResolvedValueOnce(mockJsonResponse(worksData));

    const { getAuthorCoauthors } = await import("../openalex");
    const result = await getAuthorCoauthors("A100");

    expect(result).toHaveLength(2);
    // John Doe should be first (2 collaborations)
    expect(result[0].name).toBe("John Doe");
    expect(result[0].count).toBe(2);
    expect(result[0].id).toBe("A200");
    // Alice second (1 collaboration)
    expect(result[1].name).toBe("Alice");
    expect(result[1].count).toBe(1);
  });

  it("rejects invalid IDs", async () => {
    const { getAuthorCoauthors } = await import("../openalex");
    await expect(getAuthorCoauthors("INVALID")).rejects.toThrow("Invalid author ID");
  });
});
