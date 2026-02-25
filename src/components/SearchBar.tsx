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
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setType("topic")}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            type === "topic"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Search by topic
        </button>
        <button
          type="button"
          onClick={() => setType("name")}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            type === "name"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              ? 'Search a research topic... e.g. "computational neuroscience"'
              : 'Search a professor name... e.g. "Geoffrey Hinton"'
          }
          className={`w-full border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isLarge ? "px-5 py-4 text-lg" : "px-4 py-2.5 text-base"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
            isLarge ? "top-2 px-6 py-2 text-base" : "top-1 px-4 py-1.5 text-sm"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
