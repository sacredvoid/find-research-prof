import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-rule">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink font-semibold tracking-tight hover:text-link transition-colors shrink-0"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-accent"
          >
            {/* Connection lines */}
            <line x1="6" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6" y1="6" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="6" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="18" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Nodes */}
            <circle cx="6" cy="6" r="2.5" fill="currentColor" />
            <circle cx="18" cy="6" r="2.5" fill="currentColor" />
            <circle cx="10" cy="18" r="2.5" fill="currentColor" />
            <circle cx="20" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>
          Only Research
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
            href="https://github.com/sacredvoid/find-research-prof"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-tertiary hover:text-ink transition-colors"
            aria-label="GitHub repository"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
