"use client";

import { useState, useSyncExternalStore } from "react";
import { SavedProfessor } from "@/types";
import {
  getSavedProfessors,
  unsaveProfessor,
  updateSavedProfessor,
} from "@/lib/storage";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import ExportCSV from "@/components/ExportCSV";

const EMAIL_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  none: { label: "Not contacted", color: "text-ink-tertiary" },
  drafted: { label: "Draft ready", color: "text-gold" },
  sent: { label: "Sent", color: "text-accent" },
  replied: { label: "Replied", color: "text-oa" },
  "no-response": { label: "No response", color: "text-ink-tertiary" },
};

function subscribeSavedProfessors(callback: () => void) {
  window.addEventListener("saved-professors-changed", callback);
  return () => window.removeEventListener("saved-professors-changed", callback);
}

export default function MyListPage() {
  const professors = useSyncExternalStore(
    subscribeSavedProfessors,
    getSavedProfessors,
    () => [] as SavedProfessor[]
  );
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  // Force re-render after updates since useSyncExternalStore relies on referential equality
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  function handleRemove(id: string) {
    unsaveProfessor(id);
  }

  function handleStatusChange(id: string, status: SavedProfessor["emailStatus"]) {
    updateSavedProfessor(id, { emailStatus: status });
    refresh();
  }

  function handleSaveNotes(id: string) {
    updateSavedProfessor(id, { notes: noteText });
    setEditingNotes(null);
    refresh();
  }

  function startEditNotes(prof: SavedProfessor) {
    setEditingNotes(prof.id);
    setNoteText(prof.notes);
  }

  return (
    <main className="max-w-[52rem] mx-auto px-6 py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            My List
          </h1>
          <p className="text-sm text-ink-tertiary mt-0.5">
            {professors.length === 0
              ? "Save professors from search results to track them here."
              : `${professors.length} saved professor${professors.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {professors.length >= 2 && (
            <Link
              href={`/compare?ids=${professors.slice(0, 4).map((p) => p.id).join(",")}`}
              className="inline-flex items-center gap-1.5 text-sm text-accent bg-accent-bg hover:bg-accent-border px-3 py-1.5 rounded-md font-medium transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
              </svg>
              Compare
            </Link>
          )}
          <ExportCSV professors={professors} filename="my-saved-professors" />
        </div>
      </div>

      {professors.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-12 h-12 text-ink-muted mx-auto mb-4"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <p className="text-ink-secondary mb-2">No saved professors yet</p>
          <p className="text-sm text-ink-tertiary mb-4">
            Click the bookmark icon on any professor card to save them here.
          </p>
          <Link
            href="/"
            className="text-accent hover:text-accent-hover font-medium text-sm"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="space-y-0">
          {professors.map((prof) => (
            <div
              key={prof.id}
              className="py-4 border-b border-rule"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/professor/${prof.id}`}
                    className="font-semibold text-ink hover:text-accent transition-colors text-[1.05rem] leading-snug"
                  >
                    {prof.name}
                  </Link>
                  <p className="text-sm text-ink-secondary mt-0.5">
                    {prof.institution}
                    {prof.country && (
                      <span className="text-ink-tertiary"> — {prof.country}</span>
                    )}
                  </p>
                  <div className="flex gap-3 mt-1 font-mono text-sm tabular-nums">
                    <span className="text-gold" title="h-index">
                      h {prof.hIndex}
                    </span>
                    <span className="text-gold" title="Citations">
                      {formatNumber(prof.citedByCount)}
                      <span className="text-ink-tertiary ml-0.5 font-sans text-xs">cited</span>
                    </span>
                    <span className="text-gold" title="Works">
                      {formatNumber(prof.worksCount)}
                      <span className="text-ink-tertiary ml-0.5 font-sans text-xs">works</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(prof.id)}
                  className="text-ink-tertiary hover:text-red-500 p-1 transition-colors"
                  title="Remove from list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              {/* Email status tracker */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-ink-tertiary">Status:</span>
                {Object.entries(EMAIL_STATUS_LABELS).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(prof.id, key as SavedProfessor["emailStatus"])}
                    className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                      prof.emailStatus === key
                        ? `${color} font-medium bg-paper-elevated border border-rule`
                        : "text-ink-muted hover:text-ink-tertiary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Notes */}
              <div className="mt-2">
                {editingNotes === prof.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add notes..."
                      maxLength={500}
                      className="flex-1 bg-paper-inset border border-rule rounded-md px-3 py-1 text-sm focus:outline-none focus:border-accent"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveNotes(prof.id);
                        if (e.key === "Escape") setEditingNotes(null);
                      }}
                    />
                    <button
                      onClick={() => handleSaveNotes(prof.id)}
                      className="text-sm text-accent font-medium px-2"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditNotes(prof)}
                    className="text-sm text-ink-tertiary hover:text-ink-secondary transition-colors"
                  >
                    {prof.notes || "Add notes..."}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
