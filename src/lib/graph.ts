import { GraphNode, GraphLink, GraphData, OpenAlexWork, OpenAlexAuthor } from "@/types";
import { OPENALEX_BASE_URL, OPENALEX_MAILTO, MAX_GRAPH_NODES } from "@/lib/config";
import { stripOpenAlexId } from "@/lib/utils";

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Browser-level cache to avoid redundant API calls during exploration
const cache = new Map<string, { data: unknown; timestamp: number }>();

async function cachedFetch<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenAlex API error: ${res.status}`);
  const data = await res.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${OPENALEX_BASE_URL}${path}`);
  url.searchParams.set("mailto", OPENALEX_MAILTO);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

function authorToNode(author: OpenAlexAuthor): GraphNode {
  const hIndex = author.summary_stats?.h_index || 0;
  const institution = author.last_known_institutions?.[0];
  const topDomain = author.topics?.[0]?.domain?.display_name || "Other";
  const topField = author.topics?.[0]?.field?.display_name || "Other";
  const topics = (author.topics || []).slice(0, 5).map((t) => ({
    name: t.display_name,
    count: t.count,
  }));

  return {
    id: stripOpenAlexId(author.id),
    name: author.display_name,
    institution: institution?.display_name || "Unknown",
    country: institution?.country_code || "",
    hIndex,
    citedByCount: author.cited_by_count || 0,
    worksCount: author.works_count || 0,
    domain: topDomain,
    field: topField,
    topics,
    val: Math.max(3, Math.sqrt(hIndex) * 2),
  };
}

function extractCoauthorEdges(
  works: OpenAlexWork[],
  nodeIds: Set<string>
): GraphLink[] {
  const edgeMap = new Map<string, number>();

  for (const work of works) {
    const authors = (work.authorships || [])
      .map((a) => a.author?.id ? stripOpenAlexId(a.author.id) : undefined)
      .filter((id): id is string => !!id && nodeIds.has(id));

    // Create edges between all co-author pairs in this work
    for (let i = 0; i < authors.length; i++) {
      for (let j = i + 1; j < authors.length; j++) {
        const key = [authors[i], authors[j]].sort().join("--");
        edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
      }
    }
  }

  return Array.from(edgeMap.entries()).map(([key, weight]) => {
    const [source, target] = key.split("--");
    return { source, target, weight };
  });
}

export async function buildAuthorGraph(authorId: string): Promise<GraphData> {
  if (!/^A\d+$/.test(authorId)) throw new Error("Invalid author ID");

  // Fetch the central author and their works
  const [author, worksRes] = await Promise.all([
    cachedFetch<OpenAlexAuthor>(buildUrl(`/authors/${authorId}`)),
    cachedFetch<{ results: OpenAlexWork[] }>(
      buildUrl("/works", {
        filter: `authorships.author.id:${authorId}`,
        sort: "cited_by_count:desc",
        per_page: "50",
        select: "id,title,authorships,topics,cited_by_count,publication_year",
      })
    ),
  ]);

  const works = worksRes.results;
  const centralNode = authorToNode(author);

  // Extract co-authors from works
  const coauthorMap = new Map<string, { name: string; count: number; institutions: string[] }>();
  for (const work of works) {
    for (const authorship of work.authorships || []) {
      const id = authorship.author?.id ? stripOpenAlexId(authorship.author.id) : undefined;
      if (!id || id === authorId) continue;
      const existing = coauthorMap.get(id);
      if (existing) {
        existing.count++;
      } else {
        coauthorMap.set(id, {
          name: authorship.author.display_name,
          count: 1,
          institutions: authorship.institutions?.map((i) => i.display_name) || [],
        });
      }
    }
  }

  // Take top 30 co-authors by collaboration frequency
  const topCoauthors = Array.from(coauthorMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 30);

  if (topCoauthors.length === 0) {
    return { nodes: [centralNode], links: [] };
  }

  // Fetch full profiles for co-authors (batched)
  const coauthorIds = topCoauthors.map(([id]) => id).join("|");
  const coauthorsRes = await cachedFetch<{ results: OpenAlexAuthor[] }>(
    buildUrl("/authors", {
      filter: `openalex:${coauthorIds}`,
      per_page: "30",
    })
  );

  const coauthorNodes = coauthorsRes.results.map(authorToNode);
  const allNodes = [centralNode, ...coauthorNodes];
  const nodeIds = new Set(allNodes.map((n) => n.id));

  // Build edges from the central author's works
  const links = extractCoauthorEdges(works, nodeIds);

  return { nodes: allNodes, links };
}

export async function buildTopicGraph(query: string): Promise<GraphData & { topicName: string | null }> {
  // Search for the topic
  const topicsRes = await cachedFetch<{ results: { id: string; display_name: string }[] }>(
    buildUrl("/topics", { search: query, per_page: "1" })
  );

  const topic = topicsRes.results?.[0];
  const topicId = topic?.id ? stripOpenAlexId(topic.id) : undefined;

  let authorIds: string[];
  const topicName: string | null = topic?.display_name || null;

  if (topicId) {
    // Get top 30 authors in this topic
    const authorsRes = await cachedFetch<{ results: OpenAlexAuthor[] }>(
      buildUrl("/authors", {
        filter: `topics.id:${topicId},works_count:>5`,
        sort: "cited_by_count:desc",
        per_page: "30",
      })
    );
    const nodes = authorsRes.results.map(authorToNode);
    authorIds = nodes.map((n) => n.id);

    if (authorIds.length === 0) {
      return { nodes: [], links: [], topicName };
    }

    // Fetch works that involve these authors and this topic to find co-authorship edges
    const worksRes = await cachedFetch<{ results: OpenAlexWork[] }>(
      buildUrl("/works", {
        filter: `topics.id:${topicId}`,
        sort: "cited_by_count:desc",
        per_page: "200",
        select: "id,authorships,cited_by_count",
      })
    );

    const nodeIds = new Set(authorIds);
    const links = extractCoauthorEdges(worksRes.results, nodeIds);

    return { nodes, links, topicName };
  }

  // Fallback: search works by query and aggregate authors
  const worksRes = await cachedFetch<{ results: OpenAlexWork[] }>(
    buildUrl("/works", {
      search: query,
      per_page: "100",
      select: "id,authorships,cited_by_count",
    })
  );

  const authorCounts = new Map<string, { name: string; count: number }>();
  for (const work of worksRes.results) {
    for (const authorship of work.authorships || []) {
      const id = authorship.author?.id ? stripOpenAlexId(authorship.author.id) : undefined;
      if (!id) continue;
      const existing = authorCounts.get(id);
      if (existing) existing.count++;
      else authorCounts.set(id, { name: authorship.author.display_name, count: 1 });
    }
  }

  const topAuthors = Array.from(authorCounts.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 30);

  if (topAuthors.length === 0) {
    return { nodes: [], links: [], topicName: null };
  }

  const ids = topAuthors.map(([id]) => id).join("|");
  const authorsRes = await cachedFetch<{ results: OpenAlexAuthor[] }>(
    buildUrl("/authors", {
      filter: `openalex:${ids}`,
      per_page: "30",
    })
  );

  const nodes = authorsRes.results.map(authorToNode);
  const nodeIds = new Set(nodes.map((n) => n.id));
  const links = extractCoauthorEdges(worksRes.results, nodeIds);

  return { nodes, links, topicName: null };
}

export async function expandNode(authorId: string, existingNodeIds: Set<string>): Promise<GraphData> {
  if (!/^A\d+$/.test(authorId)) throw new Error("Invalid author ID");

  if (existingNodeIds.size >= MAX_GRAPH_NODES) {
    throw new Error(`Graph limit reached (${MAX_GRAPH_NODES} nodes). Reset the graph to explore a new network.`);
  }

  // Fetch works for this author
  const worksRes = await cachedFetch<{ results: OpenAlexWork[] }>(
    buildUrl("/works", {
      filter: `authorships.author.id:${authorId}`,
      sort: "cited_by_count:desc",
      per_page: "30",
      select: "id,authorships,cited_by_count",
    })
  );

  // Find new co-authors not already in the graph
  const newCoauthors = new Map<string, { name: string; count: number; institutions: string[] }>();
  for (const work of worksRes.results) {
    for (const authorship of work.authorships || []) {
      const id = authorship.author?.id ? stripOpenAlexId(authorship.author.id) : undefined;
      if (!id || id === authorId || existingNodeIds.has(id)) continue;
      const existing = newCoauthors.get(id);
      if (existing) existing.count++;
      else newCoauthors.set(id, {
        name: authorship.author.display_name,
        count: 1,
        institutions: authorship.institutions?.map((i) => i.display_name) || [],
      });
    }
  }

  // Take top 15 new co-authors
  const topNew = Array.from(newCoauthors.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15);

  if (topNew.length === 0) {
    return { nodes: [], links: [] };
  }

  const ids = topNew.map(([id]) => id).join("|");
  const authorsRes = await cachedFetch<{ results: OpenAlexAuthor[] }>(
    buildUrl("/authors", {
      filter: `openalex:${ids}`,
      per_page: "15",
    })
  );

  const newNodes = authorsRes.results.map(authorToNode);
  const allNodeIds = new Set([...existingNodeIds, ...newNodes.map((n) => n.id)]);
  const links = extractCoauthorEdges(worksRes.results, allNodeIds);

  return { nodes: newNodes, links };
}
