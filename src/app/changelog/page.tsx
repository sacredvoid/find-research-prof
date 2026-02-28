import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and improvements to ResearchProf.",
};

interface ChangelogEntry {
  date: string;
  version: string;
  changes: { type: "added" | "fixed" | "improved"; text: string }[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-02-28",
    version: "0.2.0",
    changes: [
      { type: "added", text: "Server-side API caching — repeated searches are now instant" },
      { type: "added", text: "Publication pagination on professor pages" },
      { type: "added", text: "Skeleton loading states for search results" },
      { type: "added", text: "Custom 404 page" },
      { type: "added", text: "Changelog page" },
      { type: "added", text: "Error boundary for 3D graph (graceful WebGL crash recovery)" },
      { type: "added", text: "Graph node limit (150) with reset button" },
      { type: "added", text: "Explore page preserves search in URL (shareable/bookmarkable)" },
      { type: "improved", text: "Co-authors now derived from top 50 works (was 20)" },
      { type: "improved", text: "Country filter expanded from 16 to 48 countries" },
      { type: "improved", text: "Node expansion shows error feedback instead of failing silently" },
      { type: "improved", text: "Search inputs capped at 200 characters" },
      { type: "fixed", text: "XSS vulnerability in JSON-LD structured data" },
      { type: "fixed", text: "XSS vulnerability in 3D graph tooltips" },
      { type: "fixed", text: "Security headers added (CSP, X-Frame-Options, etc.)" },
    ],
  },
  {
    date: "2026-02-27",
    version: "0.1.0",
    changes: [
      { type: "added", text: "Search professors by research topic or name" },
      { type: "added", text: "Professor profile pages with publications, metrics, and co-authors" },
      { type: "added", text: "3D research network explorer with collaboration graphs" },
      { type: "added", text: "Filter by country, citations, and sort order" },
      { type: "added", text: "SEO: sitemap, robots.txt, OpenGraph, JSON-LD structured data" },
      { type: "added", text: "Vercel Web Analytics" },
    ],
  },
];

const TYPE_STYLES = {
  added: "text-green-700 bg-green-50",
  fixed: "text-red-700 bg-red-50",
  improved: "text-blue-700 bg-blue-50",
} as const;

export default function ChangelogPage() {
  return (
    <main className="max-w-[40rem] mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-ink tracking-tight mb-2">Changelog</h1>
        <p className="text-ink-secondary text-sm">
          What&rsquo;s new and improved in ResearchProf.
        </p>
      </div>

      <div className="space-y-10">
        {CHANGELOG.map((entry) => (
          <section key={entry.version}>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-semibold text-ink text-lg tracking-tight">
                v{entry.version}
              </h2>
              <time className="text-xs text-ink-tertiary font-mono">{entry.date}</time>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className={`shrink-0 text-[10px] font-medium uppercase px-1.5 py-0.5 rounded mt-0.5 ${TYPE_STYLES[change.type]}`}
                  >
                    {change.type}
                  </span>
                  <span className="text-ink-secondary">{change.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-rule text-center">
        <Link
          href="/"
          className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
        >
          &larr; Back to search
        </Link>
      </div>
    </main>
  );
}
