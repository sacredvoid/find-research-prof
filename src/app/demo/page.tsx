"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const STEPS = [
  {
    id: "01-homepage",
    title: "Search for researchers",
    caption: "Search by topic, name, or institution across 240M+ academic works.",
  },
  {
    id: "02-search-typing",
    title: "Enter your research interest",
    caption: "Type any topic - like \"Machine Learning\" - and hit search.",
  },
  {
    id: "03-search-results",
    title: "Browse results with real metrics",
    caption:
      "See h-index, citations, works count, and research topics for every professor. Filter by country or sort by relevance.",
  },
  {
    id: "04-save-professor",
    title: "Save to your shortlist",
    caption: "One click to bookmark a professor. Build your list as you browse.",
  },
  {
    id: "05-professor-profile",
    title: "Explore professor profiles",
    caption:
      "Full profile with publications, research topics, co-authors, and links to Google Scholar, ORCID, and lab pages.",
  },
  {
    id: "06-email-generator",
    title: "Draft a cold email instantly",
    caption:
      "Generate a personalized email draft based on their research. Choose your purpose - PhD application, collaboration, or inquiry.",
  },
  {
    id: "07-my-list",
    title: "Track your outreach",
    caption:
      "Manage your saved professors, add private notes, and track email status from \"Not contacted\" to \"Replied\".",
  },
];

export default function DemoPage() {
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(STEPS.length - 1, c + 1));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-link hover:text-link-hover transition-colors"
        >
          &larr; Back to home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-3 mb-1">
          See how it works
        </h1>
        <p className="text-ink-secondary text-sm">
          A quick walkthrough of Only Research in action.
          Use arrow keys or the buttons to navigate.
        </p>
      </div>

      {/* Step counter */}
      <div className="flex items-center gap-2 mb-4">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-accent"
                : i < current
                ? "w-4 bg-accent/40"
                : "w-4 bg-ink/10"
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
        <span className="ml-auto text-xs text-ink-tertiary font-medium">
          {current + 1} / {STEPS.length}
        </span>
      </div>

      {/* Screenshot */}
      <div className="relative rounded-xl border border-rule overflow-hidden bg-white shadow-sm">
        <Image
          src={`/demo/${step.id}.png`}
          alt={step.title}
          width={1280}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Caption */}
      <div className="mt-6 mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs font-semibold text-accent bg-accent-bg px-2 py-0.5 rounded-full">
            Step {current + 1}
          </span>
          <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed ml-0 sm:ml-[calc(3.5rem)]">
          {step.caption}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-rule text-ink hover:bg-ink/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Previous
        </button>

        {current === STEPS.length - 1 ? (
          <Link
            href="/search"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Try it now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        ) : (
          <button
            onClick={next}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </main>
  );
}
