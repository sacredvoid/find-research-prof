"use client";

import { useState } from "react";

export default function ExploreSearch({
  onSearch,
  isLoading,
  defaultQuery = "",
  defaultType = "topic",
}: {
  onSearch: (query: string, type: "topic" | "author") => void;
  isLoading: boolean;
  defaultQuery?: string;
  defaultType?: "topic" | "author";
}) {
  const [query, setQuery] = useState(defaultQuery);
  const [type, setType] = useState<"topic" | "author">(defaultType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim(), type);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-1 mb-2 sm:mb-3 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setType("topic")}
          className={`px-3 py-1 rounded-full transition-all ${
            type === "topic"
              ? "bg-accent text-white font-medium"
              : "text-ink-tertiary hover:text-ink-secondary hover:bg-paper-elevated"
          }`}
        >
          By topic
        </button>
        <button
          type="button"
          onClick={() => setType("author")}
          className={`px-3 py-1 rounded-full transition-all ${
            type === "author"
              ? "bg-accent text-white font-medium"
              : "text-ink-tertiary hover:text-ink-secondary hover:bg-paper-elevated"
          }`}
        >
          By author
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            type === "topic"
              ? "e.g. machine learning, climate change..."
              : "e.g. Geoffrey Hinton, Jennifer Doudna..."
          }
          className="w-full bg-paper-inset border border-rule rounded-lg text-ink placeholder-ink-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-border transition-all pl-3 pr-10 py-2 text-sm sm:pl-4 sm:pr-12 sm:py-2.5 sm:text-base"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1.5 px-3 py-1 text-accent hover:text-accent-hover transition-colors disabled:opacity-50"
          aria-label="Search"
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
