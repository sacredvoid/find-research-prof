import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

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

function mockAuthor(id: string, name: string, hIndex = 10) {
  return {
    id: `https://openalex.org/${id}`,
    display_name: name,
    works_count: 50,
    cited_by_count: 500,
    summary_stats: { h_index: hIndex, i10_index: 5, "2yr_mean_citedness": 2.0 },
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
    ids: { openalex: `https://openalex.org/${id}` },
    works_api_url: `https://api.openalex.org/works?filter=author.id:${id}`,
    updated_date: "2024-01-01",
  };
}

describe("buildAuthorGraph", () => {
  it("builds a graph for an author with co-authors", async () => {
    const centralAuthor = mockAuthor("A100", "Jane Smith", 20);
    const worksRes = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [{ display_name: "MIT" }] },
            { author: { id: "https://openalex.org/A200", display_name: "John Doe" }, institutions: [{ display_name: "Stanford" }] },
          ],
          topics: [],
          cited_by_count: 100,
          publication_year: 2024,
        },
      ],
    };
    const coauthorsRes = {
      results: [mockAuthor("A200", "John Doe")],
    };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(centralAuthor))
      .mockResolvedValueOnce(mockJsonResponse(worksRes))
      .mockResolvedValueOnce(mockJsonResponse(coauthorsRes));

    const { buildAuthorGraph } = await import("../graph");
    const graph = await buildAuthorGraph("A100");

    expect(graph.nodes).toHaveLength(2);
    expect(graph.nodes[0].id).toBe("A100");
    expect(graph.nodes[0].name).toBe("Jane Smith");
    expect(graph.nodes[1].id).toBe("A200");

    expect(graph.links).toHaveLength(1);
    expect(graph.links[0].weight).toBe(1);
  });

  it("returns only the central node when no co-authors exist", async () => {
    const centralAuthor = mockAuthor("A100", "Jane Smith");
    const worksRes = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
          ],
          topics: [],
          cited_by_count: 10,
          publication_year: 2024,
        },
      ],
    };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(centralAuthor))
      .mockResolvedValueOnce(mockJsonResponse(worksRes));

    const { buildAuthorGraph } = await import("../graph");
    const graph = await buildAuthorGraph("A100");

    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0].id).toBe("A100");
    expect(graph.links).toHaveLength(0);
  });

  it("rejects invalid author IDs", async () => {
    const { buildAuthorGraph } = await import("../graph");
    await expect(buildAuthorGraph("INVALID")).rejects.toThrow("Invalid author ID");
  });
});

describe("buildTopicGraph", () => {
  it("builds a graph for a topic", async () => {
    const topicsRes = {
      results: [{ id: "https://openalex.org/T1", display_name: "Machine Learning" }],
    };
    const authorsRes = {
      results: [mockAuthor("A100", "Jane Smith"), mockAuthor("A200", "John Doe")],
    };
    const worksRes = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
            { author: { id: "https://openalex.org/A200", display_name: "John Doe" }, institutions: [] },
          ],
          cited_by_count: 100,
        },
      ],
    };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(topicsRes))
      .mockResolvedValueOnce(mockJsonResponse(authorsRes))
      .mockResolvedValueOnce(mockJsonResponse(worksRes));

    const { buildTopicGraph } = await import("../graph");
    const graph = await buildTopicGraph("machine learning");

    expect(graph.topicName).toBe("Machine Learning");
    expect(graph.nodes).toHaveLength(2);
    expect(graph.links).toHaveLength(1);
  });

  it("returns empty graph when no topic or authors found", async () => {
    const topicsRes = { results: [] };
    const worksRes = { results: [] };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(topicsRes))
      .mockResolvedValueOnce(mockJsonResponse(worksRes));

    const { buildTopicGraph } = await import("../graph");
    const graph = await buildTopicGraph("nonexistent topic");

    expect(graph.nodes).toHaveLength(0);
    expect(graph.links).toHaveLength(0);
    expect(graph.topicName).toBeNull();
  });
});

describe("expandNode", () => {
  it("returns new co-author nodes not already in the graph", async () => {
    const worksRes = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
            { author: { id: "https://openalex.org/A300", display_name: "New Author" }, institutions: [] },
          ],
          cited_by_count: 50,
        },
      ],
    };
    const newAuthorsRes = {
      results: [mockAuthor("A300", "New Author")],
    };

    mockFetch
      .mockResolvedValueOnce(mockJsonResponse(worksRes))
      .mockResolvedValueOnce(mockJsonResponse(newAuthorsRes));

    const { expandNode } = await import("../graph");
    const existingIds = new Set(["A100", "A200"]);
    const result = await expandNode("A100", existingIds);

    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].id).toBe("A300");
  });

  it("throws when graph node limit is reached", async () => {
    const { expandNode } = await import("../graph");
    const existingIds = new Set(Array.from({ length: 150 }, (_, i) => `A${i}`));

    await expect(expandNode("A0", existingIds)).rejects.toThrow("Graph limit reached");
  });

  it("rejects invalid author IDs", async () => {
    const { expandNode } = await import("../graph");
    await expect(expandNode("INVALID", new Set())).rejects.toThrow("Invalid author ID");
  });

  it("returns empty graph when no new co-authors found", async () => {
    const worksRes = {
      results: [
        {
          id: "W1",
          authorships: [
            { author: { id: "https://openalex.org/A100", display_name: "Jane Smith" }, institutions: [] },
            { author: { id: "https://openalex.org/A200", display_name: "Existing" }, institutions: [] },
          ],
          cited_by_count: 50,
        },
      ],
    };

    mockFetch.mockResolvedValueOnce(mockJsonResponse(worksRes));

    const { expandNode } = await import("../graph");
    const existingIds = new Set(["A100", "A200"]);
    const result = await expandNode("A100", existingIds);

    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });
});
