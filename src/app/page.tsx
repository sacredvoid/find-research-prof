import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const EXAMPLE_TOPICS = [
  "Computational Neuroscience",
  "Machine Learning",
  "Climate Change",
  "Quantum Computing",
  "Gene Therapy",
  "Behavioral Economics",
  "Robotics",
  "Astrophysics",
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        {/* Floating gradient orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)",
              filter: "blur(60px)",
              animation: "float-orb-1 14s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -top-10 -right-16 w-[450px] h-[450px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
              filter: "blur(60px)",
              animation: "float-orb-2 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0.05) 40%, transparent 70%)",
              filter: "blur(60px)",
              animation: "float-orb-3 22s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto px-6">
          <p className="text-sm text-accent font-medium mb-3">
            Search 240M+ academic works across every field and country.
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mb-3">
            Find the right researcher, faster.
          </h1>
          <p className="text-ink-secondary text-[0.95rem] leading-relaxed mb-8">
            Search by topic, name, or institution. Save professors, draft
            emails, compare candidates, and explore collaboration networks
            &mdash; all in one place.
          </p>

          <SearchBar />

          <p className="mt-6 text-sm text-ink-tertiary leading-relaxed">
            Try:{" "}
            {EXAMPLE_TOPICS.map((topic, i) => (
              <span key={topic}>
                {i > 0 && ", "}
                <Link
                  href={`/search?q=${encodeURIComponent(topic)}&type=topic`}
                  className="text-link hover:text-link-hover transition-colors"
                >
                  {topic}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-rule py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Search & Discover */}
            <div>
              <div className="w-9 h-9 rounded-lg bg-accent-bg flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-ink mb-2">Search &amp; Discover</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Find professors by research topic, name, or institution. Filter
                by country, citations, and sort by relevance.
              </p>
            </div>

            {/* Save & Track */}
            <div>
              <div className="w-9 h-9 rounded-lg bg-accent-bg flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-ink mb-2">Save &amp; Track</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Build your shortlist, add notes, track email status, compare up
                to 4 professors side by side, and export to CSV.
              </p>
            </div>

            {/* Explore Networks */}
            <div>
              <div className="w-9 h-9 rounded-lg bg-accent-bg flex items-center justify-center text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.06-7.39a.75.75 0 00-1.5 0v2.033l-.312-.312a7 7 0 00-11.712 3.138.75.75 0 001.449.39A5.5 5.5 0 0113.889 6.11l.311.312H11.767a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.538l.22.496z" />
                </svg>
              </div>
              <h3 className="font-semibold text-ink mb-2">Explore Networks</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Visualize collaboration graphs in 3D. See how researchers in a
                field connect, expand nodes to discover new collaborators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep-Dives */}
      <section className="border-t border-rule py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {/* Professor Profiles */}
            <div className="border-l-2 border-accent pl-5">
              <h2 className="text-lg font-bold text-ink tracking-tight mb-2">
                Rich professor profiles
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-2">
                Research topics, publications sorted by year, citation metrics,
                and frequent co-authors. Direct links to Google Scholar, ORCID,
                and lab pages.
              </p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Draft a cold email in one click, flag whether they&rsquo;re
                accepting students, or share any profile with a direct link.
              </p>
            </div>

            {/* Save, Compare & Export */}
            <div className="border-l-2 border-accent pl-5">
              <h2 className="text-lg font-bold text-ink tracking-tight mb-2">
                Save, compare &amp; export
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-2">
                Bookmark professors, add private notes, and track your outreach
                status. Compare up to four side by side with topic overlap
                analysis.
              </p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Export any search results to CSV for offline tracking and
                sharing.
              </p>
            </div>

            {/* Smart Filtering */}
            <div className="border-l-2 border-accent pl-5">
              <h2 className="text-lg font-bold text-ink tracking-tight mb-2">
                Smart filtering
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Narrow down by country, minimum citations, or sort by most cited
                or most published. Multi-page export lets you download the top
                100, 250, or 500 results at once.
              </p>
            </div>

            {/* 3D Network Explorer */}
            <div className="border-l-2 border-accent pl-5">
              <h2 className="text-lg font-bold text-ink tracking-tight mb-2">
                3D network explorer
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed mb-2">
                Visualize how top researchers in any field collaborate. Search a
                topic to see the network, or search an author to map their
                co-author connections.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Try the network explorer
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="border-t border-rule py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-[0.7rem] font-medium text-ink-tertiary uppercase tracking-widest mb-6">
            Who it&rsquo;s for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            <div>
              <h3 className="font-semibold text-accent mb-1">Students</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Find research assistantships, PhD advisors, or labs to join by
                searching your area of interest.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-1">Faculty</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Identify reviewers, panelists, or potential collaborators in a
                specific research niche.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-1">Researchers</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Audit your own collaboration network, discover adjacent
                researchers, and explore how your field connects.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-1">Organizers</h3>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Map who&rsquo;s actively publishing in a topic when planning
                conferences, workshops, or special issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-rule">
        <div className="max-w-5xl mx-auto px-6 py-5 text-xs text-ink-tertiary text-center leading-relaxed">
          Searching 240M+ academic works across all fields and countries.
          <br />
          Data from{" "}
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:text-link-hover transition-colors"
          >
            OpenAlex
          </a>{" "}
          (CC0 license). Not affiliated with any university.
        </div>
      </footer>
    </main>
  );
}
