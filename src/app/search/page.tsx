import { searchByTopic, searchByName } from "@/lib/openalex";
import SearchBar from "@/components/SearchBar";
import ProfessorCard from "@/components/ProfessorCard";
import Link from "next/link";
import { SearchFilters } from "@/types";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toLocaleString();
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
  const page = parseInt(params.page || "1");

  if (!query) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <SearchBar />
        <p className="text-center text-gray-400 mt-8">
          Enter a search query to find professors.
        </p>
      </main>
    );
  }

  const filters: SearchFilters = {
    country: params.country || undefined,
    minCitations: params.minCitations ? parseInt(params.minCitations) : undefined,
    minWorks: params.minWorks ? parseInt(params.minWorks) : undefined,
    sortBy: (params.sortBy as SearchFilters["sortBy"]) || undefined,
  };

  const searchFn = searchType === "name" ? searchByName : searchByTopic;
  const { professors, totalCount, topicName } = await searchFn(query, filters, page);

  const COUNTRY_OPTIONS = [
    { code: "", label: "All countries" },
    { code: "US", label: "United States" },
    { code: "GB", label: "United Kingdom" },
    { code: "CA", label: "Canada" },
    { code: "DE", label: "Germany" },
    { code: "CN", label: "China" },
    { code: "JP", label: "Japan" },
    { code: "AU", label: "Australia" },
    { code: "FR", label: "France" },
    { code: "NL", label: "Netherlands" },
    { code: "CH", label: "Switzerland" },
    { code: "IN", label: "India" },
    { code: "KR", label: "South Korea" },
    { code: "SE", label: "Sweden" },
    { code: "SG", label: "Singapore" },
    { code: "IL", label: "Israel" },
  ];

  const CITATION_OPTIONS = [
    { value: "", label: "Any citations" },
    { value: "100", label: "100+ citations" },
    { value: "1000", label: "1,000+ citations" },
    { value: "5000", label: "5,000+ citations" },
    { value: "10000", label: "10,000+ citations" },
    { value: "50000", label: "50,000+ citations" },
  ];

  const SORT_OPTIONS = [
    { value: "", label: "Most relevant" },
    { value: "cited_by_count", label: "Most cited" },
    { value: "works_count", label: "Most publications" },
  ];

  function buildFilterUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {
      q: query,
      type: searchType,
    };
    if (params.country) base.country = params.country;
    if (params.minCitations) base.minCitations = params.minCitations;
    if (params.sortBy) base.sortBy = params.sortBy;
    const merged = { ...base, ...overrides };
    // Remove empty values
    for (const key of Object.keys(merged)) {
      if (!merged[key]) delete merged[key];
    }
    const sp = new URLSearchParams(merged);
    return `/search?${sp.toString()}`;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar
          defaultValue={query}
          size="small"
          searchType={searchType as "topic" | "name"}
        />
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-4 space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Country
              </h3>
              <div className="space-y-1">
                {COUNTRY_OPTIONS.map((opt) => (
                  <Link
                    key={opt.code}
                    href={buildFilterUrl({ country: opt.code, page: "" })}
                    className={`block text-sm px-2 py-1 rounded ${
                      (params.country || "") === opt.code
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Min Citations
              </h3>
              <div className="space-y-1">
                {CITATION_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildFilterUrl({ minCitations: opt.value, page: "" })}
                    className={`block text-sm px-2 py-1 rounded ${
                      (params.minCitations || "") === opt.value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Sort By
              </h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildFilterUrl({ sortBy: opt.value, page: "" })}
                    className={`block text-sm px-2 py-1 rounded ${
                      (params.sortBy || "") === opt.value
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-baseline gap-2">
            <h1 className="text-xl font-semibold text-gray-900">
              {topicName ? (
                <>
                  Professors in{" "}
                  <span className="text-blue-600">{topicName}</span>
                </>
              ) : (
                <>
                  Results for{" "}
                  <span className="text-blue-600">&ldquo;{query}&rdquo;</span>
                </>
              )}
            </h1>
            <span className="text-sm text-gray-400">
              {formatNumber(totalCount)} found
            </span>
          </div>

          {professors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-2">No professors found</p>
              <p className="text-sm">
                Try a different search term or broaden your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {professors.map((prof) => (
                  <ProfessorCard key={prof.id} professor={prof} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildFilterUrl({ page: (page - 1).toString() })}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-gray-400">
                  Page {page}
                </span>
                {professors.length === 25 && (
                  <Link
                    href={buildFilterUrl({ page: (page + 1).toString() })}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                  >
                    Next
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
