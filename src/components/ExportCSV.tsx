"use client";

import { Professor } from "@/types";

export default function ExportCSV({
  professors,
  filename = "professors",
}: {
  professors: Professor[];
  filename?: string;
}) {
  function handleExport() {
    const headers = [
      "Name",
      "Institution",
      "Country",
      "Department",
      "h-index",
      "Citations",
      "Works",
      "Topics",
      "ORCID",
      "Profile URL",
    ];

    const rows = professors.map((p) => [
      p.name,
      p.institution,
      p.country,
      p.department,
      p.hIndex.toString(),
      p.citedByCount.toString(),
      p.worksCount.toString(),
      p.topics.map((t) => t.name).join("; "),
      p.orcid || "",
      `https://researchprof.com/professor/${p.id}`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (professors.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 text-sm text-ink-tertiary hover:text-accent bg-paper-elevated hover:bg-accent-bg px-3 py-1.5 rounded-md transition-all"
      title="Export results to CSV"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
      </svg>
      Export CSV
    </button>
  );
}
