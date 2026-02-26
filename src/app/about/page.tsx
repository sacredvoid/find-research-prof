import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — ResearchProf",
  description: "Why ResearchProf exists and how to use it.",
};

export default function AboutPage() {
  return (
    <main className="max-w-[40rem] mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-ink tracking-tight mb-2">
        About ResearchProf
      </h1>
      <p className="text-accent font-medium text-sm mb-6">
        For students, researchers, and academics navigating the world of
        scholarly collaboration.
      </p>

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
          citations, and links to reach them. Whether you&rsquo;re cold-emailing
          for an RA position, shortlisting PhD advisors, or just exploring
          who&rsquo;s doing interesting work in your field — this should save
          you hours.
        </p>
        <p>
          It&rsquo;s not just for students, though. Faculty looking for
          reviewers or panelists in a specific area can quickly surface active
          researchers. Conference organizers can map who&rsquo;s publishing in a
          niche. And if you&rsquo;re a researcher yourself, it&rsquo;s a handy
          way to double-check your own collaboration network and discover
          potential collaborators you might have missed.
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
          <div>
            <h3 className="font-medium text-ink mb-1">Explore research networks</h3>
            <p className="text-sm">
              Use the{" "}
              <Link href="/explore" className="text-link hover:text-link-hover transition-colors">
                3D network explorer
              </Link>{" "}
              to visualize collaboration graphs. Search a topic to see how the
              top researchers in a field connect, or search an author to map
              their co-author network. Click any node to expand it, see their
              research areas, and discover new collaborators.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule my-8" />

      <section className="mb-8">
        <h2 className="text-[0.7rem] font-medium text-ink-tertiary uppercase tracking-widest mb-4">
          Who is this for?
        </h2>
        <div className="space-y-3 text-sm text-ink-secondary leading-relaxed">
          <div className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">Students</span>
            <span>Find research assistantships, PhD advisors, or labs to join by searching your area of interest.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">Faculty</span>
            <span>Identify reviewers, panelists, or potential collaborators in a specific research niche.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">Researchers</span>
            <span>Audit your own collaboration network, discover adjacent researchers, and explore how your field connects.</span>
          </div>
          <div className="flex gap-3">
            <span className="text-accent font-semibold shrink-0">Organizers</span>
            <span>Map who&rsquo;s actively publishing in a topic when planning conferences, workshops, or special issues.</span>
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
