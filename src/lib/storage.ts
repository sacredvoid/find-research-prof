"use client";

import { SavedProfessor, Professor, AcceptingSignal } from "@/types";

const SAVED_KEY = "researchprof_saved";
const SIGNALS_KEY = "researchprof_accepting";

// --- Saved Professors ---

// Cache for useSyncExternalStore: must return same reference when data hasn't changed
let _savedCache: SavedProfessor[] = [];
let _savedRaw: string | null = null;

export function getSavedProfessors(): SavedProfessor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw !== _savedRaw) {
      _savedRaw = raw;
      _savedCache = raw ? JSON.parse(raw) : [];
    }
    return _savedCache;
  } catch {
    return [];
  }
}

function writeSaved(list: SavedProfessor[]): void {
  const json = JSON.stringify(list);
  localStorage.setItem(SAVED_KEY, json);
  _savedRaw = json;
  _savedCache = list;
  window.dispatchEvent(new Event("saved-professors-changed"));
}

export function saveProfessor(professor: Professor): void {
  const list = getSavedProfessors();
  if (list.some((p) => p.id === professor.id)) return;
  const saved: SavedProfessor = {
    ...professor,
    savedAt: Date.now(),
    notes: "",
    emailStatus: "none",
  };
  list.push(saved);
  writeSaved(list);
}

export function unsaveProfessor(id: string): void {
  const list = getSavedProfessors().filter((p) => p.id !== id);
  writeSaved(list);
}

export function isProfessorSaved(id: string): boolean {
  return getSavedProfessors().some((p) => p.id === id);
}

export function updateSavedProfessor(
  id: string,
  updates: Partial<Pick<SavedProfessor, "notes" | "emailStatus">>
): void {
  const list = getSavedProfessors();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...updates };
  writeSaved(list);
}

// --- Accepting Students Signals ---

// Cache for useSyncExternalStore: must return same reference when data hasn't changed
let _signalsCache: AcceptingSignal[] = [];
let _signalsRaw: string | null = null;
// Per-professor cache to avoid creating new filtered arrays on every getSnapshot call
let _signalsByProfCache = new Map<string, AcceptingSignal[]>();

export function getSignals(): AcceptingSignal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SIGNALS_KEY);
    if (raw !== _signalsRaw) {
      _signalsRaw = raw;
      _signalsCache = raw ? JSON.parse(raw) : [];
      _signalsByProfCache = new Map();
    }
    return _signalsCache;
  } catch {
    return [];
  }
}

function writeSignals(list: AcceptingSignal[]): void {
  const json = JSON.stringify(list);
  localStorage.setItem(SIGNALS_KEY, json);
  _signalsRaw = json;
  _signalsCache = list;
  _signalsByProfCache = new Map();
  window.dispatchEvent(new Event("signals-changed"));
}

export function addSignal(signal: AcceptingSignal): void {
  const list = getSignals();
  // Replace existing signal for same professor+semester
  const filtered = list.filter(
    (s) => !(s.professorId === signal.professorId && s.semester === signal.semester)
  );
  filtered.push(signal);
  writeSignals(filtered);
}

export function getSignalsForProfessor(professorId: string): AcceptingSignal[] {
  // Ensure cache is fresh
  getSignals();
  const cached = _signalsByProfCache.get(professorId);
  if (cached !== undefined) return cached;
  const filtered = _signalsCache.filter((s) => s.professorId === professorId);
  _signalsByProfCache.set(professorId, filtered);
  return filtered;
}
