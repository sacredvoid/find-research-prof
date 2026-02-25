"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "cited", label: "Most cited" },
  { value: "oldest", label: "Oldest first" },
];

const BASE_YEAR = 2026;
const YEAR_OPTIONS = [
  { value: "", label: "All years" },
  ...Array.from({ length: 10 }, (_, i) => {
    const y = BASE_YEAR - i;
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
      <div className="flex gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => navigate("sort", opt.value === "recent" ? "" : opt.value)}
            className={`px-2.5 py-1 rounded-md transition-all ${
              currentSort === opt.value
                ? "text-accent font-medium bg-accent-bg"
                : "text-ink-tertiary hover:text-ink-secondary hover:bg-paper-elevated"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <select
        value={currentYear}
        onChange={(e) => navigate("year", e.target.value)}
        className="text-sm bg-paper-inset border border-rule rounded-md px-2.5 py-1 text-ink-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-border transition-all"
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
