"use client";

import { useState, useSyncExternalStore } from "react";
import { AcceptingSignal } from "@/types";
import { addSignal, getSignalsForProfessor } from "@/lib/storage";

function useSignals(professorId: string): AcceptingSignal[] {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => getSignalsForProfessor(professorId),
    () => [] as AcceptingSignal[]
  );
}

export default function AcceptingStudents({
  professorId,
}: {
  professorId: string;
}) {
  const signals = useSignals(professorId);
  const [showForm, setShowForm] = useState(false);
  const [semester, setSemester] = useState("Fall 2026");
  const [note, setNote] = useState("");
  const [, setTick] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const signal: AcceptingSignal = {
      professorId,
      semester,
      reportedAt: Date.now(),
      reporterNote: note.trim(),
    };
    addSignal(signal);
    setTick((t) => t + 1);
    setShowForm(false);
    setNote("");
  }

  const semesters = [
    "Spring 2026",
    "Fall 2026",
    "Spring 2027",
    "Fall 2027",
  ];

  // Show all signals for this professor (localStorage is per-user, all entries are relevant)
  const recentSignals = signals;

  return (
    <div className="border border-rule rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-oa"
            >
              <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.572.729 6.016 6.016 0 002.856 0A.75.75 0 0012 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.553 7.553 0 01-2.274 0z" />
            </svg>
            Accepting Students?
          </h3>
          {recentSignals.length > 0 ? (
            <div className="mt-1.5 space-y-1">
              {recentSignals.map((s, i) => (
                <p key={i} className="text-sm text-oa font-medium">
                  Reported accepting for {s.semester}
                  {s.reporterNote && (
                    <span className="text-ink-tertiary font-normal">
                      {" "}
                      &mdash; &ldquo;{s.reporterNote}&rdquo;
                    </span>
                  )}
                  <span className="text-ink-tertiary font-normal text-xs ml-1">
                    ({new Date(s.reportedAt).toLocaleDateString()})
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink-tertiary mt-0.5">
              No reports yet. Know if this professor is taking students?
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="shrink-0 text-sm text-accent bg-accent-bg hover:bg-accent-border px-3 py-1.5 rounded-md font-medium transition-all"
        >
          {showForm ? "Cancel" : "Report"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-rule space-y-3">
          <div>
            <label className="text-xs font-medium text-ink-tertiary block mb-1">
              Semester
            </label>
            <div className="flex flex-wrap gap-1.5">
              {semesters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSemester(s)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    semester === s
                      ? "bg-accent text-white font-medium"
                      : "text-ink-tertiary bg-paper-elevated hover:text-ink-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-tertiary block mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., mentioned on lab website, saw at conference..."
              maxLength={200}
              className="w-full bg-paper-inset border border-rule rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Submit Report
          </button>
        </form>
      )}
    </div>
  );
}
