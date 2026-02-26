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
      <div className="flex gap-1 mb-3 text-sm">
        <button
          type="button"
          onClick={() => setType("topic")}
          className={`px-3 py-1 rounded-full transition-all ${
            type === "topic"
              ? "bg-accent text-white font-medium"
              : "text-ink-tertiary hover:text-ink-secondary hover:bg-paper-elevated"
          }`}
        >
          Search by topic
        </button>
        <button
          type="button"
          onClick={() => setType("name")}
          className={`px-3 py-1 rounded-full transition-all ${
            type === "name"
              ? "bg-accent text-white font-medium"
              : "text-ink-tertiary hover:text-ink-secondary hover:bg-paper-elevated"
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
          className={`w-full bg-paper-inset border border-rule rounded-lg text-ink placeholder-ink-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-border transition-all ${
            isLarge ? "pl-5 pr-14 py-4 text-lg" : "pl-4 pr-12 py-2.5 text-base"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 text-accent hover:text-accent-hover transition-colors ${
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
