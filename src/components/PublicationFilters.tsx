"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "cited", label: "Most cited" },
  { value: "oldest", label: "Oldest first" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: "", label: "All years" },
  ...Array.from({ length: 10 }, (_, i) => {
    const y = currentYear - i;
    return { value: y.toString(), label: y.toString() };
  }),
];

export default function PublicationFilters({
  currentSort,
  currentYear,
}: {
  currentSort: string;
  currentYear: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex gap-3">
        {SORT_OPTIONS.map((opt, i) => (
          <span key={opt.value} className="flex items-center gap-3">
            {i > 0 && <span className="text-ink-muted">·</span>}
            <button
              onClick={() => navigate("sort", opt.value === "recent" ? "" : opt.value)}
              className={`transition-colors ${
                currentSort === opt.value
                  ? "text-ink font-medium"
                  : "text-ink-tertiary hover:text-ink-secondary"
              }`}
            >
              {opt.label}
            </button>
          </span>
        ))}
      </div>
      <select
        value={currentYear}
        onChange={(e) => navigate("year", e.target.value)}
        className="text-sm bg-paper-inset border border-rule rounded px-2 py-1 text-ink-secondary focus:outline-none focus:border-rule-strong"
      >
        {YEAR_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
