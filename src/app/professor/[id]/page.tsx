import { getAuthor, getAuthorWorks, getAuthorCoauthors } from "@/lib/openalex";
import { OpenAlexAuthor, OpenAlexWork } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Cache professor pages at the CDN for 1 hour, then revalidate in the background.
// This means repeat visits to the same professor serve instantly from cache
// instead of invoking a serverless function each time.
export const revalidate = 3600;
import PublicationFilters from "@/components/PublicationFilters";
import MetricBadge from "@/components/MetricBadge";
import SectionHeading from "@/components/SectionHeading";
import SaveButton from "@/components/SaveButton";
import ShareButtons from "@/components/ShareButtons";
import EmailGenerator from "@/components/EmailGenerator";
import AcceptingStudents from "@/components/AcceptingStudents";
import { formatNumber, safeJsonLd, buildQueryString, stripOpenAlexId } from "@/lib/utils";
import { countryCodeToName, PROFESSOR_PAGE_SIZE, SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const author = await getAuthor(id);
    const institution = author.last_known_institutions?.[0]?.display_name || "";
    const topTopics = (author.topics || []).slice(0, 3).map((t) => t.display_name).join(", ");
    const title = `${author.display_name}`;
    const description = `${author.display_name} at ${institution}. ${author.works_count} publications, ${formatNumber(author.cited_by_count)} citations, h-index ${author.summary_stats?.h_index}.${topTopics ? ` Research areas: ${topTopics}.` : ""} View their full publication list, co-author network, and citation metrics on Only Research.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Only Research`,
        description,
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Only Research`,
        description,
      },
      alternates: {
        canonical: `/professor/${id}`,
      },
    };
  } catch {
    return { title: "Professor | Only Research" };
  }
}

export default async function ProfessorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sort?: string; year?: string; page?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const validSorts = ["recent", "cited", "oldest"] as const;
  const sort = validSorts.includes(sp.sort as typeof validSorts[number]) ? (sp.sort as typeof validSorts[number]) : "recent";
  const year = sp.year || "";
  const page = Math.max(1, parseInt(sp.page || "1") || 1);

  let author: OpenAlexAuthor;
  let works: OpenAlexWork[];
  let totalWorksCount: number;
  let coauthors: { name: string; count: number; id: string }[];

  try {
    const [authorData, worksData, coauthorData] = await Promise.all([
      getAuthor(id),
      getAuthorWorks(id, { perPage: 20, sort, year: year || undefined, page }),
      getAuthorCoauthors(id),
    ]);
    author = authorData;
    works = worksData.works;
    totalWorksCount = worksData.totalCount;
    coauthors = coauthorData;
  } catch {
    notFound();
  }

  const institution = author.last_known_institutions?.[0];
  const topics = (author.topics || []).slice(0, 10);
  const orcidUrl = author.ids?.orcid || null;
  const totalPages = Math.ceil(totalWorksCount / PROFESSOR_PAGE_SIZE);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.display_name,
    url: `${SITE_URL}/professor/${id}`,
    jobTitle: "Researcher",
    ...(institution && {
      affiliation: {
        "@type": "Organization",
        name: institution.display_name,
      },
      worksFor: {
        "@type": "Organization",
        name: institution.display_name,
      },
    }),
    ...(orcidUrl && { sameAs: [orcidUrl] }),
    ...(topics.length > 0 && {
      knowsAbout: topics.map((t) => t.display_name),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: author.display_name,
        item: `${SITE_URL}/professor/${id}`,
      },
    ],
  };

  function buildPubUrl(overrides: Record<string, string>) {
    const qs = buildQueryString({
      sort: sort !== "recent" ? sort : "",
      year,
      ...overrides,
    });
    return `/professor/${id}${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-ink tracking-tight leading-tight">
            {author.display_name}
          </h1>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <SaveButton
              professor={{
                id,
                name: author.display_name,
                institution: institution?.display_name || "Unknown",
                country: countryCodeToName(institution?.country_code || ""),
                countryCode: institution?.country_code || "",
                department: topics[0]?.field?.display_name || "",
                topics: topics.slice(0, 5).map((t) => ({ name: t.display_name, id: stripOpenAlexId(t.id) })),
                hIndex: author.summary_stats?.h_index || 0,
                worksCount: author.works_count || 0,
                citedByCount: author.cited_by_count || 0,
                orcid: orcidUrl,
                openAlexUrl: author.id,
                updatedDate: author.updated_date || "",
              }}
            />
            <ShareButtons
              url={`/professor/${id}`}
              title={`${author.display_name} | Only Research`}
            />
          </div>
        </div>
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

        {/* Metrics */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm tabular-nums">
          <MetricBadge label="h-index" value={author.summary_stats?.h_index?.toString() || "—"} />
          <MetricBadge label="citations" value={formatNumber(author.cited_by_count)} />
          <MetricBadge label="works" value={formatNumber(author.works_count)} />
          <MetricBadge
            label="2yr avg"
            value={author.summary_stats?.["2yr_mean_citedness"]?.toFixed(1) || "—"}
          />
        </div>

        {/* External links + Email */}
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
          <EmailGenerator
            professorName={author.display_name}
            institution={institution?.display_name || ""}
            topics={topics.slice(0, 5).map((t) => ({ name: t.display_name }))}
            recentPaperTitle={works[0]?.title || undefined}
          />
        </div>

        {/* Accepting Students */}
        <div className="mt-4">
          <AcceptingStudents professorId={id} />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <SectionHeading>
            Publications
            <span className="ml-2 text-ink-tertiary font-mono text-xs normal-case tracking-normal">
              {formatNumber(totalWorksCount)} total
            </span>
          </SectionHeading>
          <Suspense fallback={null}>
            <PublicationFilters currentSort={sort} currentYear={year} />
          </Suspense>
        </div>
        {works.length === 0 ? (
          <p className="text-ink-tertiary text-sm">
            No publications found{year ? ` for ${year}` : ""}.
          </p>
        ) : (
          <>
            <div>
              {works.map((work) => (
                <WorkEntry key={work.id} work={work} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-3 text-sm">
                {page > 1 && (
                  <Link
                    href={buildPubUrl({ page: (page - 1).toString() })}
                    className="text-accent hover:text-accent-hover bg-accent-bg hover:bg-accent-border px-3 py-1.5 rounded-md font-medium transition-all"
                  >
                    &larr; Previous
                  </Link>
                )}
                <span className="text-ink-tertiary font-mono text-xs px-2">
                  page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={buildPubUrl({ page: (page + 1).toString() })}
                    className="text-accent hover:text-accent-hover bg-accent-bg hover:bg-accent-border px-3 py-1.5 rounded-md font-medium transition-all"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Co-authors */}
      <CoauthorsSection coauthors={coauthors} />
    </main>
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

function WorkEntry({ work }: { work: OpenAlexWork }) {
  const doiUrl = work.doi ? `https://doi.org/${work.doi.replace("https://doi.org/", "")}` : null;
  const oaUrl = work.open_access?.oa_url;
  const url = oaUrl || doiUrl;
  const journal = work.primary_location?.source?.display_name;

  return (
    <div className="py-3 border-b border-rule last:border-b-0">
      <div>
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
          </div>
          {work.cited_by_count > 0 && (
            <span className="text-xs font-mono tabular-nums text-gold shrink-0 hidden sm:inline">
              {formatNumber(work.cited_by_count)} cited
            </span>
          )}
        </div>
        <div className="text-sm text-ink-tertiary mt-0.5 flex flex-wrap items-center gap-x-1">
          {journal && <span>{journal}</span>}
          {journal && work.publication_year && <span>·</span>}
          {work.publication_year && <span>{work.publication_year}</span>}
          {work.cited_by_count > 0 && (
            <span className="sm:hidden text-xs font-mono tabular-nums text-gold">
              · {formatNumber(work.cited_by_count)} cited
            </span>
          )}
          {work.open_access?.is_oa && (
            <span className="text-oa bg-oa-bg px-1.5 py-0.5 rounded text-xs font-medium">
              Open Access
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CoauthorsSection({
  coauthors,
}: {
  coauthors: { name: string; count: number; id: string }[];
}) {
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
