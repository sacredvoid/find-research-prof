import { getAuthor, getAuthorWorks } from "@/lib/openalex";
import { OpenAlexAuthor, OpenAlexWork } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let author: OpenAlexAuthor;
  let works: OpenAlexWork[];

  try {
    [author, works] = await Promise.all([
      getAuthor(id),
      getAuthorWorks(id, 15),
    ]);
  } catch {
    notFound();
  }

  const institution = author.last_known_institutions?.[0];
  const topics = (author.topics || []).slice(0, 10);
  const orcidUrl = author.ids?.orcid || null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {author.display_name}
        </h1>
        {institution && (
          <p className="text-lg text-gray-600">
            {institution.display_name}
            {institution.country_code && (
              <span className="text-gray-400">
                {" "}
                — {countryCodeToName(institution.country_code)}
              </span>
            )}
          </p>
        )}
        {topics[0]?.field && (
          <p className="text-sm text-gray-400 mt-1">
            {topics[0].field.display_name} &middot;{" "}
            {topics[0].domain.display_name}
          </p>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="h-index" value={author.summary_stats?.h_index?.toString() || "—"} />
        <MetricCard label="Total citations" value={formatNumber(author.cited_by_count)} />
        <MetricCard label="Publications" value={formatNumber(author.works_count)} />
        <MetricCard
          label="2yr avg citations"
          value={author.summary_stats?.["2yr_mean_citedness"]?.toFixed(1) || "—"}
        />
      </div>

      {/* External links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <ExternalLink
          href={author.id}
          label="OpenAlex"
        />
        {orcidUrl && (
          <ExternalLink href={orcidUrl} label="ORCID" />
        )}
        <ExternalLink
          href={`https://scholar.google.com/scholar?q=author:"${encodeURIComponent(author.display_name)}"${institution ? `+"${encodeURIComponent(institution.display_name)}"` : ""}`}
          label="Google Scholar"
        />
        {institution && (
          <ExternalLink
            href={`https://www.google.com/search?q=${encodeURIComponent(author.display_name + " " + institution.display_name + " lab")}`}
            label="Find Lab Page"
          />
        )}
      </div>

      {/* Research Topics */}
      {topics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            Research Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/search?q=${encodeURIComponent(topic.display_name)}&type=topic`}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
              >
                {topic.display_name}
                <span className="text-blue-400 ml-1 text-xs">
                  ({topic.count})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
          Recent Publications
        </h2>
        {works.length === 0 ? (
          <p className="text-gray-400 text-sm">No publications found.</p>
        ) : (
          <div className="space-y-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </section>

      {/* Co-authors from works */}
      <CoauthorsSection works={works} currentAuthorId={`https://openalex.org/${id}`} />
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      {label}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5 text-gray-400"
      >
        <path
          fillRule="evenodd"
          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.5a.75.75 0 01-.75-.75z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
}

function WorkCard({ work }: { work: OpenAlexWork }) {
  const doiUrl = work.doi ? `https://doi.org/${work.doi.replace("https://doi.org/", "")}` : null;
  const oaUrl = work.open_access?.oa_url;
  const url = oaUrl || doiUrl;
  const journal = work.primary_location?.source?.display_name;

  return (
    <div className="border-l-2 border-gray-100 pl-4 py-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {work.title || "Untitled"}
            </a>
          ) : (
            <span className="font-medium text-gray-900">
              {work.title || "Untitled"}
            </span>
          )}
          <div className="text-sm text-gray-500 mt-0.5">
            {journal && <span>{journal}</span>}
            {journal && work.publication_year && <span> &middot; </span>}
            {work.publication_year && <span>{work.publication_year}</span>}
          </div>
        </div>
        <div className="text-sm text-gray-400 shrink-0">
          {work.cited_by_count > 0 && (
            <span>{formatNumber(work.cited_by_count)} cited</span>
          )}
        </div>
      </div>
      {work.open_access?.is_oa && (
        <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
          Open Access
        </span>
      )}
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
  // Extract unique co-authors from works
  const coauthorMap = new Map<string, { name: string; count: number; id: string }>();
  for (const work of works) {
    for (const authorship of work.authorships || []) {
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
      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
        Frequent Co-authors
      </h2>
      <div className="flex flex-wrap gap-2">
        {coauthors.map((ca) => (
          <Link
            key={ca.id}
            href={`/professor/${ca.id}`}
            className="px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            {ca.name}
            <span className="text-gray-400 ml-1">({ca.count})</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
