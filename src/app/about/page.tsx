import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — ResearchProf",
  description: "Why ResearchProf exists and how to use it.",
};

export default function AboutPage() {
  return (
    <main className="max-w-[40rem] mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-ink tracking-tight mb-6">
        About ResearchProf
      </h1>

      <section className="space-y-4 text-ink-secondary leading-relaxed">
        <p>
          When I was looking for professors in my research area, I found myself
          juggling half a dozen sites — Google Scholar, university faculty pages,
          ResearchGate, ORCID, random lab websites. None of them let me just
          type a topic and see who&rsquo;s actually publishing in that field,
          ranked by their work.
        </p>
        <p>
          ResearchProf is my attempt at fixing that. One search box, one place
          to find professors by what they research — with their papers,
          citations, and links to reach them.
        </p>
      </section>

      <hr className="border-rule my-8" />

      <section className="mb-8">
        <h2 className="text-[0.7rem] font-medium text-ink-tertiary uppercase tracking-widest mb-4">
          How to use it
        </h2>
        <div className="space-y-4 text-ink-secondary leading-relaxed">
          <div>
            <h3 className="font-medium text-ink mb-1">Search by topic</h3>
            <p className="text-sm">
              Enter any research area — &ldquo;computational neuroscience&rdquo;,
              &ldquo;gene therapy&rdquo;, &ldquo;climate modeling&rdquo; — and
              get a list of professors who publish in that field. Results are
              ranked by relevance to the topic.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-ink mb-1">Search by name</h3>
            <p className="text-sm">
              Already know who you&rsquo;re looking for? Switch to name search
              and find them directly.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-ink mb-1">Filter results</h3>
            <p className="text-sm">
              Narrow down by country, minimum citations, or sort by most cited
              or most published. Useful when a topic returns hundreds of
              researchers.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-ink mb-1">Professor profiles</h3>
            <p className="text-sm">
              Click any professor to see their full profile — research topics,
              publications (sortable and filterable by year), citation metrics,
              frequent co-authors, and direct links to OpenAlex, ORCID, Google
              Scholar, and their lab page.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule my-8" />

      <section className="mb-8">
        <h2 className="text-[0.7rem] font-medium text-ink-tertiary uppercase tracking-widest mb-4">
          Data
        </h2>
        <p className="text-sm text-ink-secondary leading-relaxed">
          All data comes from{" "}
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:text-link-hover transition-colors"
          >
            OpenAlex
          </a>
          , a free and open catalog of 240M+ academic works, authors, and
          institutions. The data is licensed under{" "}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:text-link-hover transition-colors"
          >
            CC0
          </a>
          . ResearchProf is not affiliated with any university or institution.
        </p>
      </section>

      <hr className="border-rule my-8" />

      <p className="text-sm text-ink-tertiary">
        Built by Samanvya Tripathi
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="text-accent hover:text-accent-hover font-medium text-sm transition-colors"
        >
          &larr; Back to search
        </Link>
      </div>
    </main>
  );
}
