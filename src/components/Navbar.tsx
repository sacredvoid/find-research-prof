import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-rule">
      <div className="max-w-[52rem] mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-ink font-semibold tracking-tight hover:text-link transition-colors"
        >
          ResearchProf
        </Link>
        <a
          href="https://openalex.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          Powered by OpenAlex
        </a>
      </div>
    </nav>
  );
}
