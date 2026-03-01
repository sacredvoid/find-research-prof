import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    for (const key of Object.keys(store)) delete store[key];
  }),
  length: 0,
  key: vi.fn(),
};

// Mock window
const eventListeners: Record<string, Set<() => void>> = {};
vi.stubGlobal("window", {
  addEventListener: vi.fn((event: string, cb: () => void) => {
    if (!eventListeners[event]) eventListeners[event] = new Set();
    eventListeners[event].add(cb);
  }),
  removeEventListener: vi.fn((event: string, cb: () => void) => {
    eventListeners[event]?.delete(cb);
  }),
  dispatchEvent: vi.fn((event: Event) => {
    eventListeners[event.type]?.forEach((cb) => cb());
  }),
  localStorage: localStorageMock,
});
vi.stubGlobal("localStorage", localStorageMock);

// Import after mocks are set up
const {
  getSavedProfessors,
  saveProfessor,
  unsaveProfessor,
  isProfessorSaved,
  updateSavedProfessor,
  getSignals,
  addSignal,
  getSignalsForProfessor,
} = await import("@/lib/storage");

const mockProfessor = {
  id: "A123",
  name: "Test Professor",
  institution: "Test University",
  country: "US",
  countryCode: "US",
  department: "Computer Science",
  topics: [{ name: "AI", id: "T1" }],
  hIndex: 50,
  worksCount: 100,
  citedByCount: 5000,
  orcid: null,
  openAlexUrl: "https://openalex.org/A123",
  updatedDate: "2025-01-01",
};

describe("Saved Professors", () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset module-level caches by clearing localStorage and triggering re-read
    for (const key of Object.keys(store)) delete store[key];
  });

  it("returns empty array when no saved professors", () => {
    const result = getSavedProfessors();
    expect(result).toEqual([]);
  });

  it("saves a professor", () => {
    saveProfessor(mockProfessor);
    const saved = getSavedProfessors();
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe("Test Professor");
    expect(saved[0].emailStatus).toBe("none");
    expect(saved[0].notes).toBe("");
  });

  it("does not duplicate saves", () => {
    saveProfessor(mockProfessor);
    saveProfessor(mockProfessor);
    expect(getSavedProfessors()).toHaveLength(1);
  });

  it("unsaves a professor", () => {
    saveProfessor(mockProfessor);
    expect(getSavedProfessors()).toHaveLength(1);
    unsaveProfessor("A123");
    expect(getSavedProfessors()).toHaveLength(0);
  });

  it("checks if professor is saved", () => {
    expect(isProfessorSaved("A123")).toBe(false);
    saveProfessor(mockProfessor);
    expect(isProfessorSaved("A123")).toBe(true);
  });

  it("updates saved professor fields", () => {
    saveProfessor(mockProfessor);
    updateSavedProfessor("A123", { notes: "Great researcher", emailStatus: "sent" });
    const saved = getSavedProfessors();
    expect(saved[0].notes).toBe("Great researcher");
    expect(saved[0].emailStatus).toBe("sent");
  });

  it("getSavedProfessors returns stable reference (same array when data unchanged)", () => {
    saveProfessor(mockProfessor);
    const ref1 = getSavedProfessors();
    const ref2 = getSavedProfessors();
    expect(ref1).toBe(ref2); // Same reference, not just deep-equal
  });

  it("getSavedProfessors reflects updates after write", () => {
    saveProfessor(mockProfessor);
    const before = getSavedProfessors();
    expect(before[0].notes).toBe("");
    updateSavedProfessor("A123", { notes: "updated" });
    const after = getSavedProfessors();
    expect(after[0].notes).toBe("updated");
  });

  it("dispatches saved-professors-changed event on writes", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    saveProfessor(mockProfessor);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "saved-professors-changed" }));
  });
});

describe("Accepting Students Signals", () => {
  beforeEach(() => {
    localStorageMock.clear();
    for (const key of Object.keys(store)) delete store[key];
  });

  it("returns empty array when no signals", () => {
    expect(getSignals()).toEqual([]);
  });

  it("adds a signal", () => {
    addSignal({
      professorId: "A123",
      semester: "Fall 2026",
      reportedAt: Date.now(),
      reporterNote: "Lab website says accepting",
    });
    expect(getSignals()).toHaveLength(1);
  });

  it("replaces duplicate professor+semester signal", () => {
    addSignal({
      professorId: "A123",
      semester: "Fall 2026",
      reportedAt: 1000,
      reporterNote: "first",
    });
    addSignal({
      professorId: "A123",
      semester: "Fall 2026",
      reportedAt: 2000,
      reporterNote: "second",
    });
    const signals = getSignals();
    expect(signals).toHaveLength(1);
    expect(signals[0].reporterNote).toBe("second");
  });

  it("keeps different semester signals", () => {
    addSignal({ professorId: "A123", semester: "Fall 2026", reportedAt: 1000, reporterNote: "" });
    addSignal({ professorId: "A123", semester: "Spring 2027", reportedAt: 2000, reporterNote: "" });
    expect(getSignals()).toHaveLength(2);
  });

  it("getSignalsForProfessor filters correctly", () => {
    addSignal({ professorId: "A123", semester: "Fall 2026", reportedAt: 1000, reporterNote: "" });
    addSignal({ professorId: "A456", semester: "Fall 2026", reportedAt: 2000, reporterNote: "" });
    expect(getSignalsForProfessor("A123")).toHaveLength(1);
    expect(getSignalsForProfessor("A456")).toHaveLength(1);
    expect(getSignalsForProfessor("A999")).toHaveLength(0);
  });

  it("getSignalsForProfessor returns stable reference", () => {
    addSignal({ professorId: "A123", semester: "Fall 2026", reportedAt: 1000, reporterNote: "" });
    const ref1 = getSignalsForProfessor("A123");
    const ref2 = getSignalsForProfessor("A123");
    expect(ref1).toBe(ref2); // Same reference
  });

  it("dispatches signals-changed event on write", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    addSignal({ professorId: "A123", semester: "Fall 2026", reportedAt: 1000, reporterNote: "" });
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "signals-changed" }));
  });
});
