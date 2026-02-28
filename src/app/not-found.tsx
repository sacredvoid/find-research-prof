import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-49px)] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-ink-muted font-mono mb-4">404</p>
        <h1 className="text-xl font-semibold text-ink mb-2">Page not found</h1>
        <p className="text-ink-tertiary text-sm mb-6">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="text-sm font-medium text-accent bg-accent-bg hover:bg-accent-border px-4 py-2 rounded-lg transition-all"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-ink-secondary hover:text-ink bg-paper-elevated hover:bg-paper-inset px-4 py-2 rounded-lg transition-all"
          >
            Search professors
          </Link>
        </div>
      </div>
    </main>
  );
}
