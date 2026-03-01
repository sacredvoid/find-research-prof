"use client";

import { useSyncExternalStore } from "react";
import { Professor } from "@/types";
import {
  saveProfessor,
  unsaveProfessor,
  isProfessorSaved,
} from "@/lib/storage";

function useSavedStatus(id: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("saved-professors-changed", callback);
      return () => window.removeEventListener("saved-professors-changed", callback);
    },
    () => isProfessorSaved(id),
    () => false
  );
}

export default function SaveButton({
  professor,
  size = "default",
}: {
  professor: Professor;
  size?: "default" | "small";
}) {
  const saved = useSavedStatus(professor.id);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      unsaveProfessor(professor.id);
    } else {
      saveProfessor(professor);
    }
  }

  const isSmall = size === "small";

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from My List" : "Save to My List"}
      className={`shrink-0 transition-all ${
        isSmall ? "p-1" : "p-1.5"
      } rounded-md ${
        saved
          ? "text-accent bg-accent-bg"
          : "text-ink-tertiary hover:text-accent hover:bg-accent-bg"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={saved ? 0 : 1.5}
        className={isSmall ? "w-4 h-4" : "w-5 h-5"}
      >
        <path
          fillRule="evenodd"
          d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
