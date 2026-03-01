"use client";

import { useState, useRef, useEffect } from "react";
import { Professor } from "@/types";
import { OPENALEX_BASE_URL, OPENALEX_MAILTO, SITE_URL } from "@/lib/config";
import { stripOpenAlexId } from "@/lib/utils";

interface ExportCSVProps {
  professors: Professor[];
  filename?: string;
  /** Pass search context to enable multi-page export */
  searchContext?: {
    query: string;
    searchType: string;
    filters: Record<string, string>;
    totalCount: number;
  };
}

const PER_PAGE = 200; // OpenAlex max
const MAX_EXPORT = 10_000; // Hard cap to prevent abuse

function professorsToCsv(professors: Professor[]): string {
  const headers = [
    "Name",
    "Institution",
    "Country",
    "Department",
    "h-index",
    "Citations",
    "Works",
    "Topics",
    "ORCID",
    "Profile URL",
  ];

  const rows = professors.map((p) => [
    p.name,
    p.institution,
    p.country,
    p.department,
    p.hIndex.toString(),
    p.citedByCount.toString(),
    p.worksCount.toString(),
    p.topics.map((t) => t.name).join("; "),
    p.orcid || "",
    `${SITE_URL}/professor/${p.id}`,
  ]);

  return [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface OpenAlexAuthorRaw {
  id: string;
  display_name: string;
  works_count: number;
  cited_by_count: number;
  summary_stats: { h_index: number; i10_index: number; "2yr_mean_citedness": number };
  last_known_institutions: { id: string; display_name: string; country_code: string; type: string }[];
  topics: { id: string; display_name: string; count: number; field: { id: string; display_name: string } }[];
  ids: { openalex: string; orcid?: string };
  updated_date: string;
}

const COUNTRY_MAP: Record<string, string> = {
  US: "United States", GB: "United Kingdom", CA: "Canada", DE: "Germany",
  CN: "China", JP: "Japan", AU: "Australia", FR: "France", NL: "Netherlands",
  CH: "Switzerland", IN: "India", KR: "South Korea", SE: "Sweden",
  SG: "Singapore", IL: "Israel", BR: "Brazil", IT: "Italy", ES: "Spain",
};

function rawToProfessor(author: OpenAlexAuthorRaw): Professor {
  const inst = author.last_known_institutions?.[0];
  const topTopics = (author.topics || []).slice(0, 5);
  return {
    id: stripOpenAlexId(author.id),
    name: author.display_name,
    institution: inst?.display_name || "Unknown",
    country: COUNTRY_MAP[inst?.country_code] || inst?.country_code || "",
    countryCode: inst?.country_code || "",
    department: topTopics[0]?.field?.display_name || "",
    topics: topTopics.map((t) => ({ name: t.display_name, id: stripOpenAlexId(t.id) })),
    hIndex: author.summary_stats?.h_index || 0,
    worksCount: author.works_count || 0,
    citedByCount: author.cited_by_count || 0,
    orcid: author.ids?.orcid || null,
    openAlexUrl: author.id,
    updatedDate: author.updated_date || "",
  };
}

async function fetchAuthorsPage(
  searchType: string,
  query: string,
  filters: Record<string, string>,
  page: number,
  perPage: number,
  signal?: AbortSignal,
): Promise<{ professors: Professor[]; totalCount: number }> {
  // Resolve topic/institution ID first if needed
  let filterParts: string[] = ["works_count:>5"];
  let searchParam = "";

  if (searchType === "topic") {
    const topicRes = await fetch(
      `${OPENALEX_BASE_URL}/topics?mailto=${OPENALEX_MAILTO}&search=${encodeURIComponent(query)}&per_page=1`,
      { signal }
    );
    const topicData = await topicRes.json();
    const topic = topicData.results?.[0];
    if (topic) {
      filterParts.push(`topics.id:${stripOpenAlexId(topic.id)}`);
    } else {
      searchParam = query;
    }
  } else if (searchType === "institution") {
    const instRes = await fetch(
      `${OPENALEX_BASE_URL}/institutions?mailto=${OPENALEX_MAILTO}&search=${encodeURIComponent(query)}&per_page=1`,
      { signal }
    );
    const instData = await instRes.json();
    const inst = instData.results?.[0];
    if (inst) {
      filterParts.push(`last_known_institutions.id:${stripOpenAlexId(inst.id)}`);
    }
  } else {
    searchParam = query;
  }

  // Validate filter values to prevent API injection
  if (filters.country && /^[A-Z]{2}$/.test(filters.country)) {
    filterParts.push(`last_known_institutions.country_code:${filters.country}`);
  }
  if (filters.minCitations && /^\d+$/.test(filters.minCitations)) {
    filterParts.push(`cited_by_count:>${filters.minCitations}`);
  }
  if (filters.minWorks && /^\d+$/.test(filters.minWorks)) {
    filterParts.push(`works_count:>${filters.minWorks}`);
  }

  const validSorts = ["works_count", "cited_by_count"];
  const sortParam = validSorts.includes(filters.sortBy) ? `${filters.sortBy}:desc` : "cited_by_count:desc";

  const url = new URL(`${OPENALEX_BASE_URL}/authors`);
  url.searchParams.set("mailto", OPENALEX_MAILTO);
  url.searchParams.set("filter", filterParts.join(","));
  url.searchParams.set("sort", sortParam);
  url.searchParams.set("per_page", perPage.toString());
  url.searchParams.set("page", page.toString());
  if (searchParam) url.searchParams.set("search", searchParam);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`OpenAlex error: ${res.status}`);
  const data = await res.json();

  return {
    professors: (data.results || []).map(rawToProfessor),
    totalCount: data.meta?.count || 0,
  };
}

export default function ExportCSV({
  professors,
  filename = "professors",
  searchContext,
}: ExportCSVProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState("");
  const [customCount, setCustomCount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (!exporting) {
          setOpen(false);
          setShowCustom(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exporting]);

  if (professors.length === 0) return null;

  function exportCurrentPage() {
    downloadCsv(professorsToCsv(professors), filename);
    setOpen(false);
  }

  async function exportMultiPage(count: number | "all") {
    if (!searchContext) return;
    setExporting(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const requested = count === "all" ? searchContext.totalCount : Math.min(count, searchContext.totalCount);
      const target = Math.min(requested, MAX_EXPORT);
      const allProfs: Professor[] = [];
      let page = 1;

      while (allProfs.length < target) {
        if (controller.signal.aborted) break;
        const perPage = Math.min(PER_PAGE, target - allProfs.length);
        setProgress(`Fetching ${allProfs.length} / ${target}...`);

        const result = await fetchAuthorsPage(
          searchContext.searchType,
          searchContext.query,
          searchContext.filters,
          page,
          perPage,
          controller.signal,
        );

        allProfs.push(...result.professors);
        if (result.professors.length < perPage) break;
        page++;
      }

      if (!controller.signal.aborted) {
        setProgress(`Exporting ${allProfs.length} professors...`);
        downloadCsv(professorsToCsv(allProfs), filename);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("Export failed:", err);
      setProgress("Export failed. Try again.");
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setExporting(false);
      setProgress("");
      setOpen(false);
      setShowCustom(false);
    }
  }

  function handleCustomExport() {
    const num = parseInt(customCount);
    if (num > 0) exportMultiPage(num);
  }

  const hasMultiPage = !!searchContext && searchContext.totalCount > professors.length;

  // Simple single-button when no search context (e.g. My List page)
  if (!searchContext) {
    return (
      <button
        onClick={exportCurrentPage}
        className="inline-flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-accent bg-paper-elevated hover:bg-accent-bg px-3 py-1.5 rounded-md transition-all"
        title="Export to CSV"
      >
        <DownloadIcon />
        Export CSV
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { if (!exporting) setOpen(!open); }}
        className="inline-flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-accent bg-paper-elevated hover:bg-accent-bg px-3 py-1.5 rounded-md transition-all"
        title="Export to CSV"
      >
        <DownloadIcon />
        {exporting ? progress : "Export CSV"}
        {hasMultiPage && !exporting && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {open && !exporting && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-paper-elevated border border-rule rounded-lg shadow-lg z-20 py-1">
          <button
            onClick={exportCurrentPage}
            className="w-full text-left px-3 py-2 text-sm text-ink-secondary hover:bg-accent-bg hover:text-accent transition-colors"
          >
            Current page
            <span className="text-ink-tertiary text-xs ml-1">({professors.length})</span>
          </button>

          {hasMultiPage && (
            <>
              <button
                onClick={() => exportMultiPage(100)}
                className="w-full text-left px-3 py-2 text-sm text-ink-secondary hover:bg-accent-bg hover:text-accent transition-colors"
              >
                Top 100
              </button>

              {!showCustom ? (
                <button
                  onClick={() => setShowCustom(true)}
                  className="w-full text-left px-3 py-2 text-sm text-ink-secondary hover:bg-accent-bg hover:text-accent transition-colors"
                >
                  Custom number...
                </button>
              ) : (
                <div className="px-3 py-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={searchContext.totalCount}
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCustomExport(); }}
                    placeholder="e.g. 250"
                    className="w-24 bg-paper-inset border border-rule rounded px-2 py-1 text-sm focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  <button
                    onClick={handleCustomExport}
                    className="text-sm text-accent font-medium px-2 py-1 hover:bg-accent-bg rounded transition-colors"
                  >
                    Go
                  </button>
                </div>
              )}

              <div className="border-t border-rule my-1" />
              <button
                onClick={() => exportMultiPage("all")}
                className="w-full text-left px-3 py-2 text-sm text-ink-secondary hover:bg-accent-bg hover:text-accent transition-colors"
              >
                All results
                <span className="text-ink-tertiary text-xs ml-1">
                  ({searchContext.totalCount.toLocaleString()})
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  );
}
