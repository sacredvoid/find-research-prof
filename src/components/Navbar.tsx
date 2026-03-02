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
        </div>
      </div>
    </nav>
  );
}
