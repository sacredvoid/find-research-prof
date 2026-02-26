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
    <main className="min-h-[calc(100vh-49px)] flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="max-w-2xl mx-auto px-6 w-full">
          <div className="mb-8">
            <p className="text-sm text-accent font-medium mb-3">
              Find advisors, reviewers, collaborators, or just see who&rsquo;s active in your field.
            </p>
            <h1 className="text-2xl font-bold text-ink tracking-tight mb-2">
              Find professors by research topic
            </h1>
            <p className="text-ink-secondary text-[0.95rem] leading-relaxed">
              Stop juggling Google Scholar, faculty pages, and ResearchGate.
              Search any research area and instantly see who&rsquo;s publishing
              in that field — their papers, citations, h-index, and links to
              reach them. All in one place.
            </p>
          </div>

          <SearchBar />

          <Link
            href="/explore"
            className="mt-4 flex items-center gap-3 text-sm text-left group"
          >
            <span className="shrink-0 w-8 h-8 rounded-lg bg-accent-bg flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.06-7.39a.75.75 0 00-1.5 0v2.033l-.312-.312a7 7 0 00-11.712 3.138.75.75 0 001.449.39A5.5 5.5 0 0113.889 6.11l.311.312H11.767a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.538l.22.496z" />
              </svg>
            </span>
            <span>
              <span className="font-medium text-accent group-hover:text-accent-hover transition-colors">
                Explore Research Networks
              </span>
              <span className="block text-ink-tertiary text-xs">
                Visualize collaboration graphs between researchers in 3D
              </span>
            </span>
          </Link>

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
      </div>

      <footer className="border-t border-rule">
        <div className="max-w-2xl mx-auto px-6 py-5 text-xs text-ink-tertiary text-center leading-relaxed">
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
