import type { Metadata } from "next";
import { searchByTopic, searchByName } from "@/lib/openalex";
import SearchBar from "@/components/SearchBar";
import ProfessorCard from "@/components/ProfessorCard";
import Link from "next/link";
import { SearchFilters } from "@/types";
import { formatNumber } from "@/lib/utils";
import { COUNTRIES } from "@/lib/config";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";
  const type = params.type || "topic";

  if (!query) {
    return {
      title: "Search Professors",
      description: "Search for professors by research topic or name.",
    };
  }

  const label = type === "name" ? "professors named" : "professors researching";
  const title = `${query} — Find ${label} ${query}`;
  const description = `Find ${label} "${query}". View their publications, citations, h-index, and collaboration networks on ResearchProf.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — ResearchProf`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} — ResearchProf`,
      description,
    },
    alternates: {
      canonical: `/search?q=${encodeURIComponent(query)}&type=${type}`,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
    country?: string;
    minCitations?: string;
    minWorks?: string;
    sortBy?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const searchType = params.type || "topic";
  const page = parseInt(params.page || "1") || 1;

  if (!query) {
    return (
      <main className="max-w-[52rem] mx-auto px-6 py-12">
        <SearchBar />
        <p className="text-center text-ink-tertiary mt-8 text-sm">
          Enter a search query to find professors.
        </p>
      </main>
    );
  }

  const filters: SearchFilters = {
    country: params.country || undefined,
    minCitations: params.minCitations ? (parseInt(params.minCitations) || undefined) : undefined,
    minWorks: params.minWorks ? (parseInt(params.minWorks) || undefined) : undefined,
    sortBy: (params.sortBy as SearchFilters["sortBy"]) || undefined,
  };

  const searchFn = searchType === "name" ? searchByName : searchByTopic;
  let professors: Awaited<ReturnType<typeof searchFn>>["professors"] = [];
  let totalCount = 0;
  let topicName: string | null = null;
  let searchError = false;

  try {
    const result = await searchFn(query, filters, page);
    professors = result.professors;
    totalCount = result.totalCount;
    topicName = result.topicName;
  } catch {
    searchError = true;
  }

  const COUNTRY_OPTIONS = COUNTRIES;

  const CITATION_OPTIONS = [
    { value: "", label: "Any" },
    { value: "100", label: "100+" },
    { value: "1000", label: "1k+" },
    { value: "5000", label: "5k+" },
    { value: "10000", label: "10k+" },
    { value: "50000", label: "50k+" },
  ];

  const SORT_OPTIONS = [
    { value: "", label: "Relevance" },
    { value: "cited_by_count", label: "Most cited" },
    { value: "works_count", label: "Most works" },
  ];

  function buildFilterUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {
      q: query,
      type: searchType,
    };
    if (params.country) base.country = params.country;
    if (params.minCitations) base.minCitations = params.minCitations;
    if (params.minWorks) base.minWorks = params.minWorks;
    if (params.sortBy) base.sortBy = params.sortBy;
    const merged = { ...base, ...overrides };
    for (const key of Object.keys(merged)) {
      if (!merged[key]) delete merged[key];
    }
    const sp = new URLSearchParams(merged);
    return `/search?${sp.toString()}`;
  }

  return (
    <main className="max-w-[52rem] mx-auto px-6 py-6">
      <div className="mb-6">
        <SearchBar
          defaultValue={query}
          size="small"
          searchType={searchType as "topic" | "name"}
        />
      </div>

      {/* Mobile filters */}
      <details className="md:hidden mb-4 border border-rule rounded-lg">
        <summary className="px-4 py-2.5 text-sm font-medium text-ink-secondary cursor-pointer select-none hover:bg-paper-elevated transition-colors">
          Filters
          {(params.country || params.minCitations || params.sortBy) && (
            <span className="ml-1.5 text-xs text-accent font-mono">(active)</span>
          )}
        </summary>
        <div className="px-4 pb-4 pt-2 grid grid-cols-3 gap-4 border-t border-rule">
          <FilterSection title="Country">
            {COUNTRY_OPTIONS.map((opt) => (
              <FilterLink
                key={opt.code}
                href={buildFilterUrl({ country: opt.code, page: "" })}
                active={(params.country || "") === opt.code}
              >
                {opt.label}
              </FilterLink>
            ))}
          </FilterSection>

          <FilterSection title="Citations">
            {CITATION_OPTIONS.map((opt) => (
              <FilterLink
                key={opt.value}
                href={buildFilterUrl({ minCitations: opt.value, page: "" })}
                active={(params.minCitations || "") === opt.value}
              >
                {opt.label}
              </FilterLink>
            ))}
          </FilterSection>

          <FilterSection title="Sort">
            {SORT_OPTIONS.map((opt) => (
              <FilterLink
                key={opt.value}
                href={buildFilterUrl({ sortBy: opt.value, page: "" })}
                active={(params.sortBy || "") === opt.value}
              >
                {opt.label}
              </FilterLink>
            ))}
          </FilterSection>
        </div>
      </details>

      <div className="flex gap-10">
        {/* Filter sidebar — desktop only */}
        <aside className="w-44 shrink-0 hidden md:block">
          <div className="sticky top-4 space-y-6">
            <FilterSection title="Country">
              {COUNTRY_OPTIONS.map((opt) => (
                <FilterLink
                  key={opt.code}
                  href={buildFilterUrl({ country: opt.code, page: "" })}
                  active={(params.country || "") === opt.code}
                >
                  {opt.label}
                </FilterLink>
              ))}
            </FilterSection>

            <FilterSection title="Citations">
              {CITATION_OPTIONS.map((opt) => (
                <FilterLink
                  key={opt.value}
                  href={buildFilterUrl({ minCitations: opt.value, page: "" })}
                  active={(params.minCitations || "") === opt.value}
                >
                  {opt.label}
                </FilterLink>
              ))}
            </FilterSection>

            <FilterSection title="Sort">
              {SORT_OPTIONS.map((opt) => (
                <FilterLink
                  key={opt.value}
                  href={buildFilterUrl({ sortBy: opt.value, page: "" })}
                  active={(params.sortBy || "") === opt.value}
                >
                  {opt.label}
                </FilterLink>
              ))}
            </FilterSection>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-baseline gap-2">
            <h1 className="text-lg font-semibold text-ink tracking-tight">
              {topicName ? (
                <>Professors in {topicName}</>
              ) : (
                <>Results for &ldquo;{query}&rdquo;</>
              )}
            </h1>
            <span className="text-xs text-ink-tertiary font-mono tabular-nums">
              {formatNumber(totalCount)}
            </span>
          </div>

          {searchError ? (
            <div className="text-center py-16 text-ink-tertiary">
              <p className="mb-1">Something went wrong fetching results.</p>
              <p className="text-sm">Please try again in a moment.</p>
            </div>
          ) : professors.length === 0 ? (
            <div className="text-center py-16 text-ink-tertiary">
              <p className="mb-1">No professors found.</p>
              <p className="text-sm">Try a different term or broaden your filters.</p>
            </div>
          ) : (
            <>
              <div>
                {professors.map((prof) => (
                  <ProfessorCard key={prof.id} professor={prof} />
                ))}
              </div>

              <div className="mt-8 flex justify-center items-center gap-3 text-sm">
                {page > 1 && (
                  <Link
                    href={buildFilterUrl({ page: (page - 1).toString() })}
                    className="text-accent hover:text-accent-hover bg-accent-bg hover:bg-accent-border px-3 py-1.5 rounded-md font-medium transition-all"
                  >
                    &larr; Previous
                  </Link>
                )}
                <span className="text-ink-tertiary font-mono text-xs px-2">
                  page {page}
                </span>
                {professors.length === 25 && (
                  <Link
                    href={buildFilterUrl({ page: (page + 1).toString() })}
                    className="text-accent hover:text-accent-hover bg-accent-bg hover:bg-accent-border px-3 py-1.5 rounded-md font-medium transition-all"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[0.65rem] font-medium text-ink-tertiary uppercase tracking-widest mb-2">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block text-sm py-1 px-2 rounded transition-all ${
        active
          ? "text-accent font-medium bg-accent-bg"
          : "text-ink-tertiary hover:text-ink-secondary hover:bg-paper-elevated"
      }`}
    >
      {children}
    </Link>
  );
}
