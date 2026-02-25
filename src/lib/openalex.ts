import { OpenAlexAuthor, OpenAlexWork, OpenAlexTopic, Professor, SearchFilters } from "@/types";

const BASE_URL = "https://api.openalex.org";
const MAILTO = "researchprof@example.com";

async function fetchOpenAlex<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("mailto", MAILTO);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`OpenAlex API error: ${res.status}`);
  return res.json();
}

function authorToProfessor(author: OpenAlexAuthor): Professor {
  const institution = author.last_known_institutions?.[0];
  const topTopics = (author.topics || []).slice(0, 5);

  return {
    id: author.id.replace("https://openalex.org/", ""),
    name: author.display_name,
    institution: institution?.display_name || "Unknown",
    country: countryCodeToName(institution?.country_code || ""),
    countryCode: institution?.country_code || "",
    department: topTopics[0]?.field?.display_name || "",
    topics: topTopics.map((t) => ({
      name: t.display_name,
      id: t.id.replace("https://openalex.org/", ""),
    })),
    hIndex: author.summary_stats?.h_index || 0,
    worksCount: author.works_count || 0,
    citedByCount: author.cited_by_count || 0,
    orcid: author.ids?.orcid || null,
    scholarUrl: null,
    openAlexUrl: author.id,
    recentWork: null,
    recentWorkYear: null,
  };
}

export async function searchByTopic(
  query: string,
  filters: SearchFilters = {},
  page: number = 1
): Promise<{ professors: Professor[]; totalCount: number; topicName: string | null }> {
  // Strategy 1: Search OpenAlex topics for a match
  const topicsRes = await fetchOpenAlex<{ results: OpenAlexTopic[] }>("/topics", {
    search: query,
    per_page: "1",
  });

  const topic = topicsRes.results?.[0];

  if (topic) {
    const topicId = topic.id.replace("https://openalex.org/", "");
    const filterParts: string[] = [`topics.id:${topicId}`, "works_count:>5"];
    if (filters.country) filterParts.push(`last_known_institutions.country_code:${filters.country}`);
    if (filters.minCitations) filterParts.push(`cited_by_count:>${filters.minCitations}`);
    if (filters.minWorks) filterParts.push(`works_count:>${filters.minWorks}`);

    const sortBy = filters.sortBy === "works_count" ? "works_count:desc" : "cited_by_count:desc";

    const authorsRes = await fetchOpenAlex<{ results: OpenAlexAuthor[]; meta: { count: number } }>(
      "/authors",
      {
        filter: filterParts.join(","),
        sort: sortBy,
        per_page: "25",
        page: page.toString(),
      }
    );

    return {
      professors: authorsRes.results.map(authorToProfessor),
      totalCount: authorsRes.meta.count,
      topicName: topic.display_name,
    };
  }

  // Strategy 2: No topic match — search works, extract top authors
  return searchViaWorks(query, filters, page);
}

async function searchViaWorks(
  query: string,
  filters: SearchFilters = {},
  page: number = 1
): Promise<{ professors: Professor[]; totalCount: number; topicName: string | null }> {
  // Search works matching the query, collect author IDs
  const worksRes = await fetchOpenAlex<{ results: OpenAlexWork[] }>("/works", {
    search: query,
    per_page: "100",
    select: "authorships",
  });

  // Aggregate authors by frequency
  const authorCounts = new Map<string, { name: string; count: number }>();
  for (const work of worksRes.results) {
    for (const authorship of work.authorships || []) {
      const id = authorship.author?.id;
      if (!id) continue;
      const existing = authorCounts.get(id);
      if (existing) {
        existing.count++;
      } else {
        authorCounts.set(id, { name: authorship.author.display_name, count: 1 });
      }
    }
  }

  // Sort by frequency, take top authors for this page
  const sortedAuthors = Array.from(authorCounts.entries())
    .sort((a, b) => b[1].count - a[1].count);

  const startIdx = (page - 1) * 25;
  const pageAuthors = sortedAuthors.slice(startIdx, startIdx + 25);

  if (pageAuthors.length === 0) {
    return { professors: [], totalCount: 0, topicName: null };
  }

  // Fetch full author details
  const authorIds = pageAuthors
    .map(([id]) => id.replace("https://openalex.org/", ""))
    .join("|");

  const filterParts: string[] = [`openalex:${authorIds}`, "works_count:>5"];
  if (filters.country) filterParts.push(`last_known_institutions.country_code:${filters.country}`);
  if (filters.minCitations) filterParts.push(`cited_by_count:>${filters.minCitations}`);

  const authorsRes = await fetchOpenAlex<{ results: OpenAlexAuthor[]; meta: { count: number } }>(
    "/authors",
    {
      filter: filterParts.join(","),
      sort: "cited_by_count:desc",
      per_page: "25",
    }
  );

  return {
    professors: authorsRes.results.map(authorToProfessor),
    totalCount: sortedAuthors.length,
    topicName: null,
  };
}

export async function searchByName(
  query: string,
  filters: SearchFilters = {},
  page: number = 1
): Promise<{ professors: Professor[]; totalCount: number; topicName: string | null }> {
  const filterParts: string[] = ["works_count:>5"];
  if (filters.country) filterParts.push(`last_known_institutions.country_code:${filters.country}`);
  if (filters.minCitations) filterParts.push(`cited_by_count:>${filters.minCitations}`);
  if (filters.minWorks) filterParts.push(`works_count:>${filters.minWorks}`);

  const params: Record<string, string> = {
    search: query,
    filter: filterParts.join(","),
    per_page: "25",
    page: page.toString(),
  };

  if (filters.sortBy && filters.sortBy !== "relevance") {
    params.sort = `${filters.sortBy}:desc`;
  }

  const res = await fetchOpenAlex<{ results: OpenAlexAuthor[]; meta: { count: number } }>(
    "/authors",
    params
  );

  return {
    professors: res.results.map(authorToProfessor),
    totalCount: res.meta.count,
    topicName: null,
  };
}

export async function getAuthor(id: string): Promise<OpenAlexAuthor> {
  return fetchOpenAlex<OpenAlexAuthor>(`/authors/${id}`);
}

export async function getAuthorWorks(
  authorId: string,
  options: {
    perPage?: number;
    sort?: "recent" | "cited" | "oldest";
    year?: string;
  } = {}
): Promise<OpenAlexWork[]> {
  const { perPage = 15, sort = "recent", year } = options;

  const filterParts: string[] = [`authorships.author.id:${authorId}`];
  if (year) filterParts.push(`publication_year:${year}`);

  const sortMap = {
    recent: "publication_date:desc",
    cited: "cited_by_count:desc",
    oldest: "publication_date:asc",
  };

  const res = await fetchOpenAlex<{ results: OpenAlexWork[] }>("/works", {
    filter: filterParts.join(","),
    sort: sortMap[sort],
    per_page: perPage.toString(),
  });
  return res.results;
}

function countryCodeToName(code: string): string {
  const countries: Record<string, string> = {
    US: "United States", GB: "United Kingdom", CA: "Canada", DE: "Germany",
    FR: "France", CN: "China", JP: "Japan", AU: "Australia", NL: "Netherlands",
    CH: "Switzerland", SE: "Sweden", KR: "South Korea", IN: "India",
    BR: "Brazil", IT: "Italy", ES: "Spain", SG: "Singapore", IL: "Israel",
    DK: "Denmark", NO: "Norway", FI: "Finland", AT: "Austria", BE: "Belgium",
    IE: "Ireland", NZ: "New Zealand", HK: "Hong Kong", TW: "Taiwan",
    PT: "Portugal", CZ: "Czech Republic", PL: "Poland",
  };
  return countries[code] || code;
}
