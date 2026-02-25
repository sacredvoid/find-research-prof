import { getAuthor, getAuthorWorks } from "@/lib/openalex";
import { OpenAlexAuthor, OpenAlexWork } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PublicationFilters from "@/components/PublicationFilters";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toLocaleString();
}

function countryCodeToName(code: string): string {
  const countries: Record<string, string> = {
    US: "United States", GB: "United Kingdom", CA: "Canada", DE: "Germany",
    FR: "France", CN: "China", JP: "Japan", AU: "Australia", NL: "Netherlands",
    CH: "Switzerland", SE: "Sweden", KR: "South Korea", IN: "India",
    BR: "Brazil", IT: "Italy", ES: "Spain", SG: "Singapore", IL: "Israel",
  };
  return countries[code] || code;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const author = await getAuthor(id);
    const institution = author.last_known_institutions?.[0]?.display_name || "";
    return {
      title: `${author.display_name} — ResearchProf`,
      description: `${author.display_name} at ${institution}. ${author.works_count} publications, ${formatNumber(author.cited_by_count)} citations, h-index ${author.summary_stats?.h_index}.`,
    };
  } catch {
    return { title: "Professor — ResearchProf" };
  }
}

export default async function ProfessorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string; year?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const validSorts = ["recent", "cited", "oldest"] as const;
  const sort = validSorts.includes(sp.sort as typeof validSorts[number]) ? (sp.sort as typeof validSorts[number]) : "recent";
  const year = sp.year || "";

  let author: OpenAlexAuthor;
  let works: OpenAlexWork[];

  try {
    [author, works] = await Promise.all([
      getAuthor(id),
      getAuthorWorks(id, { perPage: 20, sort, year: year || undefined }),
    ]);
  } catch {
    notFound();
  }

  const institution = author.last_known_institutions?.[0];
  const topics = (author.topics || []).slice(0, 10);
  const orcidUrl = author.ids?.orcid || null;

  return (
    <main className="max-w-[52rem] mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink tracking-tight leading-tight">
          {author.display_name}
        </h1>
        {institution && (
          <p className="text-ink-secondary mt-1">
            {institution.display_name}
            {institution.country_code && (
              <span className="text-ink-tertiary">
                {" — "}
                {countryCodeToName(institution.country_code)}
              </span>
            )}
          </p>
        )}
        {topics[0]?.field && (
          <p className="text-sm text-ink-tertiary mt-0.5">
            {topics[0].field.display_name}
            {topics[0].domain?.display_name && ` · ${topics[0].domain.display_name}`}
          </p>
        )}

        {/* Metrics — inline monospace */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm tabular-nums">
          <Metric label="h-index" value={author.summary_stats?.h_index?.toString() || "—"} />
          <Metric label="citations" value={formatNumber(author.cited_by_count)} />
          <Metric label="works" value={formatNumber(author.works_count)} />
          <Metric
            label="2yr avg"
            value={author.summary_stats?.["2yr_mean_citedness"]?.toFixed(1) || "—"}
          />
        </div>

        {/* External links */}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <ExtLink href={author.id}>OpenAlex</ExtLink>
          {orcidUrl && <ExtLink href={orcidUrl}>ORCID</ExtLink>}
          <ExtLink
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(`author:"${author.display_name}"${institution ? ` "${institution.display_name}"` : ""}`)}`}
          >
            Google Scholar
          </ExtLink>
          {institution && (
            <ExtLink
              href={`https://www.google.com/search?q=${encodeURIComponent(author.display_name + " " + institution.display_name + " lab")}`}
            >
              Lab page
            </ExtLink>
          )}
        </div>
      </header>

      <hr className="border-rule mb-8" />

      {/* Research Topics */}
      {topics.length > 0 && (
        <section className="mb-8">
          <SectionHeading>Research Topics</SectionHeading>
          <p className="text-sm leading-relaxed">
            {topics.map((topic, i) => (
              <span key={topic.id}>
                {i > 0 && ", "}
                <Link
                  href={`/search?q=${encodeURIComponent(topic.display_name)}&type=topic`}
                  className="text-link hover:text-link-hover transition-colors"
                >
                  {topic.display_name}
                </Link>
                <span className="text-ink-tertiary text-xs ml-0.5">
                  ({topic.count})
                </span>
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Publications */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <SectionHeading>Publications</SectionHeading>
          <Suspense fallback={null}>
            <PublicationFilters currentSort={sort} currentYear={year} />
          </Suspense>
        </div>
        {works.length === 0 ? (
          <p className="text-ink-tertiary text-sm">
            No publications found{year ? ` for ${year}` : ""}.
          </p>
        ) : (
          <div>
            {works.map((work) => (
              <WorkEntry key={work.id} work={work} />
            ))}
          </div>
        )}
      </section>

      {/* Co-authors */}
      <CoauthorsSection works={works} currentAuthorId={`https://openalex.org/${id}`} />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="bg-gold-bg px-2.5 py-1 rounded-md">
      <span className="text-gold font-semibold">{value}</span>
      <span className="text-gold-muted font-sans text-xs ml-1">{label}</span>
    </span>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-accent bg-accent-bg hover:bg-accent-border px-2.5 py-1 rounded-md font-medium transition-all"
    >
      {children}
      <span className="text-accent/50">↗</span>
    </a>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.7rem] font-medium text-ink-tertiary uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}

function WorkEntry({ work }: { work: OpenAlexWork }) {
  const doiUrl = work.doi ? `https://doi.org/${work.doi.replace("https://doi.org/", "")}` : null;
  const oaUrl = work.open_access?.oa_url;
  const url = oaUrl || doiUrl;
  const journal = work.primary_location?.source?.display_name;

  return (
    <div className="py-3 border-b border-rule last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent transition-colors leading-snug"
            >
              {work.title || "Untitled"}
            </a>
          ) : (
            <span className="text-ink leading-snug">
              {work.title || "Untitled"}
            </span>
          )}
          <div className="text-sm text-ink-tertiary mt-0.5 flex flex-wrap items-center gap-x-1">
            {journal && <span>{journal}</span>}
            {journal && work.publication_year && <span>·</span>}
            {work.publication_year && <span>{work.publication_year}</span>}
            {work.open_access?.is_oa && (
              <span className="text-oa bg-oa-bg px-1.5 py-0.5 rounded text-xs font-medium">
                Open Access
              </span>
            )}
          </div>
        </div>
        {work.cited_by_count > 0 && (
          <span className="text-xs font-mono tabular-nums text-gold shrink-0">
            {formatNumber(work.cited_by_count)} cited
          </span>
        )}
      </div>
    </div>
  );
}

function CoauthorsSection({
  works,
  currentAuthorId,
}: {
  works: OpenAlexWork[];
  currentAuthorId: string;
}) {
  const coauthorMap = new Map<string, { name: string; count: number; id: string }>();
  for (const work of works) {
    for (const authorship of work.authorships || []) {
      if (!authorship.author?.id) continue;
      if (authorship.author.id === currentAuthorId) continue;
      const existing = coauthorMap.get(authorship.author.id);
      if (existing) {
        existing.count++;
      } else {
        coauthorMap.set(authorship.author.id, {
          name: authorship.author.display_name,
          count: 1,
          id: authorship.author.id.replace("https://openalex.org/", ""),
        });
      }
    }
  }

  const coauthors = Array.from(coauthorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  if (coauthors.length === 0) return null;

  return (
    <section className="mb-8">
      <SectionHeading>Frequent Co-authors</SectionHeading>
      <p className="text-sm leading-relaxed">
        {coauthors.map((ca, i) => (
          <span key={ca.id}>
            {i > 0 && ", "}
            <Link
              href={`/professor/${ca.id}`}
              className="text-link hover:text-link-hover transition-colors"
            >
              {ca.name}
            </Link>
            <span className="text-ink-tertiary text-xs ml-0.5">({ca.count})</span>
          </span>
        ))}
      </p>
    </section>
  );
}
