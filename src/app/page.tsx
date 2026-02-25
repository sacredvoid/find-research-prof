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
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto px-6 -mt-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-2">
            Find professors by research topic
          </h1>
          <p className="text-ink-secondary text-[0.95rem] leading-relaxed">
            Search any research area and discover who&rsquo;s publishing in that
            field — their work, citations, and how to reach them.
          </p>
        </div>

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
