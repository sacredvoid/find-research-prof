import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-rule">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-ink font-semibold tracking-tight hover:text-link transition-colors shrink-0"
        >
          ResearchProf
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/my-list"
            className="text-sm text-accent font-medium hover:text-accent-hover transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="hidden sm:inline">My List</span>
          </Link>
          <Link
            href="/explore"
            className="text-sm text-accent font-medium hover:text-accent-hover transition-colors"
          >
            <span className="sm:hidden">Explore</span>
            <span className="hidden sm:inline">Explore Networks</span>
          </Link>
          <Link
            href="/changelog"
            className="text-sm text-ink-secondary hover:text-ink transition-colors hidden sm:inline"
          >
            Changelog
          </Link>
          <Link
            href="/about"
            className="text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            About
          </Link>
          <a
            href="https://openalex.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors hidden lg:inline"
          >
            Powered by OpenAlex
          </a>
        </div>
      </div>
    </nav>
  );
}
