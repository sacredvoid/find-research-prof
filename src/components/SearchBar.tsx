"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  defaultValue = "",
  size = "large",
  searchType = "topic",
}: {
  defaultValue?: string;
  size?: "large" | "small";
  searchType?: "topic" | "name";
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [type, setType] = useState(searchType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${type}`);
  }

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-4 mb-3 text-sm">
        <button
          type="button"
          onClick={() => setType("topic")}
          className={`transition-colors ${
            type === "topic"
              ? "text-ink font-medium"
              : "text-ink-tertiary hover:text-ink-secondary"
          }`}
        >
          Search by topic
        </button>
        <span className="text-ink-muted">|</span>
        <button
          type="button"
          onClick={() => setType("name")}
          className={`transition-colors ${
            type === "name"
              ? "text-ink font-medium"
              : "text-ink-tertiary hover:text-ink-secondary"
          }`}
        >
          Search by name
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            type === "topic"
              ? "e.g. computational neuroscience, gene therapy, climate modeling..."
              : "e.g. Geoffrey Hinton, Jennifer Doudna..."
          }
          className={`w-full bg-paper-inset border border-rule rounded text-ink placeholder-ink-tertiary focus:outline-none focus:border-rule-strong focus:ring-1 focus:ring-rule-strong transition-colors ${
            isLarge ? "px-5 py-4 text-lg" : "px-4 py-2.5 text-base"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 text-ink-secondary hover:text-ink transition-colors ${
            isLarge ? "top-3 px-4 py-1.5" : "top-1.5 px-3 py-1"
          }`}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={isLarge ? "w-5 h-5" : "w-4 h-4"}
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
