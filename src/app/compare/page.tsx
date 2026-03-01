import { getAuthor } from "@/lib/openalex";
import { OpenAlexAuthor } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import MetricBadge from "@/components/MetricBadge";
import { formatNumber, stripOpenAlexId } from "@/lib/utils";
import { countryCodeToName } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Professors",
  description: "Compare professors side by side — h-index, citations, publications, and research topics.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const idList = (params.ids || "").split(",").filter(Boolean).slice(0, 4);

  if (idList.length < 2) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-ink tracking-tight mb-4">
          Compare Professors
        </h1>
        <p className="text-ink-tertiary">
          Save at least 2 professors to your list, then click &ldquo;Compare&rdquo; to see
          them side by side.
        </p>
        <Link
          href="/my-list"
          className="mt-4 inline-block text-accent hover:text-accent-hover font-medium text-sm"
        >
          Go to My List
        </Link>
      </main>
    );
  }

  let authors: OpenAlexAuthor[];
  try {
    authors = await Promise.all(idList.map((id) => getAuthor(id)));
  } catch {
    notFound();
  }

  const metrics = authors.map((a) => ({
    id: stripOpenAlexId(a.id),
    name: a.display_name,
    institution: a.last_known_institutions?.[0]?.display_name || "Unknown",
    country: countryCodeToName(a.last_known_institutions?.[0]?.country_code || ""),
    field: (a.topics || [])[0]?.field?.display_name || "",
    hIndex: a.summary_stats?.h_index || 0,
    citations: a.cited_by_count || 0,
    works: a.works_count || 0,
    meanCitedness: a.summary_stats?.["2yr_mean_citedness"] || 0,
    topics: (a.topics || []).slice(0, 8).map((t) => t.display_name),
    orcid: a.ids?.orcid || null,
  }));

  // Find max values for highlighting
  const maxH = Math.max(...metrics.map((m) => m.hIndex));
  const maxCite = Math.max(...metrics.map((m) => m.citations));
  const maxWorks = Math.max(...metrics.map((m) => m.works));
  const maxMean = Math.max(...metrics.map((m) => m.meanCitedness));

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Compare Professors
        </h1>
        <Link
          href="/my-list"
          className="text-sm text-accent hover:text-accent-hover font-medium"
        >
          Back to My List
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left py-3 pr-4 text-ink-tertiary font-medium text-xs uppercase tracking-widest w-32">
                &nbsp;
              </th>
              {metrics.map((m) => (
                <th key={m.id} className="text-left py-3 px-4 min-w-[180px]">
                  <Link
                    href={`/professor/${m.id}`}
                    className="text-ink font-semibold hover:text-accent transition-colors text-base"
                  >
                    {m.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CompareRow label="Institution">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4 text-ink-secondary">
                  {m.institution}
                  {m.country && (
                    <span className="text-ink-tertiary block text-xs">{m.country}</span>
                  )}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Field">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4 text-ink-secondary">
                  {m.field || "—"}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="h-index">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4">
                  <MetricBadge
                    label=""
                    value={m.hIndex.toString()}
                    compact
                  />
                  {m.hIndex === maxH && metrics.filter((x) => x.hIndex === maxH).length === 1 && (
                    <span className="ml-1 text-oa text-xs font-medium">Highest</span>
                  )}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Citations">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4">
                  <MetricBadge
                    label=""
                    value={formatNumber(m.citations)}
                    compact
                  />
                  {m.citations === maxCite && metrics.filter((x) => x.citations === maxCite).length === 1 && (
                    <span className="ml-1 text-oa text-xs font-medium">Highest</span>
                  )}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Works">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4">
                  <MetricBadge
                    label=""
                    value={formatNumber(m.works)}
                    compact
                  />
                  {m.works === maxWorks && metrics.filter((x) => x.works === maxWorks).length === 1 && (
                    <span className="ml-1 text-oa text-xs font-medium">Highest</span>
                  )}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="2yr Avg Citedness">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4">
                  <MetricBadge
                    label=""
                    value={m.meanCitedness.toFixed(1)}
                    compact
                  />
                  {m.meanCitedness === maxMean && metrics.filter((x) => x.meanCitedness === maxMean).length === 1 && (
                    <span className="ml-1 text-oa text-xs font-medium">Highest</span>
                  )}
                </td>
              ))}
            </CompareRow>
            <CompareRow label="Research Topics">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4">
                  <div className="flex flex-wrap gap-1">
                    {m.topics.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-paper-elevated px-2 py-0.5 rounded text-ink-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </CompareRow>
            <CompareRow label="ORCID">
              {metrics.map((m) => (
                <td key={m.id} className="py-2.5 px-4">
                  {m.orcid ? (
                    <a
                      href={m.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-xs hover:text-accent-hover"
                    >
                      View ORCID
                    </a>
                  ) : (
                    <span className="text-ink-tertiary">—</span>
                  )}
                </td>
              ))}
            </CompareRow>
          </tbody>
        </table>
      </div>

      {/* Topic overlap */}
      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink-tertiary uppercase tracking-widest mb-3">
          Research Topic Overlap
        </h2>
        <TopicOverlap metrics={metrics} />
      </section>
    </main>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-rule">
      <td className="py-2.5 pr-4 text-ink-tertiary font-medium text-xs uppercase tracking-widest align-top">
        {label}
      </td>
      {children}
    </tr>
  );
}

function TopicOverlap({
  metrics,
}: {
  metrics: { name: string; topics: string[] }[];
}) {
  // Find shared topics between professors
  const allTopics = new Map<string, string[]>();
  for (const m of metrics) {
    for (const topic of m.topics) {
      const existing = allTopics.get(topic) || [];
      existing.push(m.name);
      allTopics.set(topic, existing);
    }
  }

  const shared = Array.from(allTopics.entries())
    .filter(([, profs]) => profs.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  if (shared.length === 0) {
    return (
      <p className="text-sm text-ink-tertiary">
        No overlapping research topics found between these professors.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {shared.map(([topic, profs]) => (
        <div key={topic} className="flex items-center gap-3">
          <span className="text-sm text-ink font-medium min-w-0">{topic}</span>
          <span className="text-xs text-ink-tertiary">
            Shared by {profs.join(", ")}
          </span>
        </div>
      ))}
    </div>
  );
}
