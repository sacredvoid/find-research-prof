"use client";

import Link from "next/link";
import { GraphNode, GraphLink } from "@/types";
import { formatNumber } from "@/lib/utils";

interface Collaborator {
  id: string;
  name: string;
  weight: number;
}

function getCollaborators(
  nodeId: string,
  links: GraphLink[],
  nodes: GraphNode[]
): Collaborator[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const collabs: Collaborator[] = [];

  for (const link of links) {
    const sourceId = typeof link.source === "object" ? (link.source as GraphNode).id : link.source;
    const targetId = typeof link.target === "object" ? (link.target as GraphNode).id : link.target;

    if (sourceId === nodeId) {
      const other = nodeMap.get(targetId);
      if (other) collabs.push({ id: other.id, name: other.name, weight: link.weight });
    } else if (targetId === nodeId) {
      const other = nodeMap.get(sourceId);
      if (other) collabs.push({ id: other.id, name: other.name, weight: link.weight });
    }
  }

  return collabs.sort((a, b) => b.weight - a.weight).slice(0, 5);
}

export default function NodeDetailPanel({
  node,
  onClose,
  onExpand,
  onNodeSelect,
  isExpanding,
  links,
  nodes,
}: {
  node: GraphNode | null;
  onClose: () => void;
  onExpand: (id: string) => void;
  onNodeSelect: (node: GraphNode) => void;
  isExpanding: boolean;
  links: GraphLink[];
  nodes: GraphNode[];
}) {
  if (!node) return null;

  const collaborators = getCollaborators(node.id, links, nodes);

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-40 sm:hidden"
        onClick={onClose}
      />

      {/* Panel: bottom sheet on mobile, side panel on desktop */}
      <div className="fixed z-50 bg-paper border-rule shadow-lg overflow-y-auto animate-slide-in
        inset-x-0 bottom-0 max-h-[70vh] rounded-t-2xl border-t
        sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-0 sm:h-full sm:w-80 sm:max-h-none sm:rounded-t-none sm:rounded-none sm:border-t-0 sm:border-l">
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-ink-muted" />
        </div>

        <div className="p-4 sm:p-5">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-ink-tertiary hover:text-ink transition-colors"
            aria-label="Close panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>

          <h3 className="text-lg font-bold text-ink pr-6 leading-snug">
            {node.name}
          </h3>

          {node.institution !== "Unknown" && (
            <p className="text-sm text-ink-secondary mt-1">
              {node.institution}
              {node.country && (
                <span className="text-ink-tertiary"> · {node.country}</span>
              )}
            </p>
          )}

          {node.field && node.field !== "Other" && (
            <p className="text-xs text-ink-tertiary mt-0.5">{node.field}</p>
          )}

          {/* Metrics */}
          <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 font-mono text-sm tabular-nums">
            <span className="bg-gold-bg px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
              <span className="text-gold font-semibold">{node.hIndex}</span>
              <span className="text-gold-muted font-sans text-xs ml-1">h-index</span>
            </span>
            <span className="bg-gold-bg px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
              <span className="text-gold font-semibold">{formatNumber(node.citedByCount)}</span>
              <span className="text-gold-muted font-sans text-xs ml-1">citations</span>
            </span>
            <span className="bg-gold-bg px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
              <span className="text-gold font-semibold">{formatNumber(node.worksCount)}</span>
              <span className="text-gold-muted font-sans text-xs ml-1">works</span>
            </span>
          </div>

          {/* Mobile: two-column layout for topics + collaborators */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-0">
            {/* Research Topics */}
            {node.topics.length > 0 && (
              <div className="sm:mt-5">
                <h4 className="text-[0.65rem] font-medium text-ink-tertiary uppercase tracking-widest mb-1.5 sm:mb-2">
                  Research Areas
                </h4>
                <div className="space-y-1 sm:space-y-1.5">
                  {node.topics.map((topic) => (
                    <div key={topic.name} className="flex items-baseline justify-between text-sm gap-1">
                      <span className="text-ink-secondary truncate">{topic.name}</span>
                      <span className="text-[10px] sm:text-xs text-ink-tertiary font-mono tabular-nums shrink-0">
                        {topic.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frequent Collaborators */}
            {collaborators.length > 0 && (
              <div className="sm:mt-5">
                <h4 className="text-[0.65rem] font-medium text-ink-tertiary uppercase tracking-widest mb-1.5 sm:mb-2">
                  Collaborators
                </h4>
                <div className="space-y-1 sm:space-y-1.5">
                  {collaborators.map((collab) => {
                    const collabNode = nodes.find((n) => n.id === collab.id);
                    return (
                      <button
                        key={collab.id}
                        onClick={() => collabNode && onNodeSelect(collabNode)}
                        className="w-full flex items-baseline justify-between text-sm text-left hover:bg-paper-elevated rounded px-1 py-0.5 -mx-1 transition-colors gap-1"
                      >
                        <span className="text-link truncate">{collab.name}</span>
                        <span className="text-[10px] sm:text-xs text-ink-tertiary font-mono tabular-nums shrink-0">
                          {collab.weight}p
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <hr className="border-rule my-4 sm:my-5" />

          {/* Actions */}
          <div className="flex gap-2 sm:flex-col">
            <button
              onClick={() => onExpand(node.id)}
              disabled={isExpanding}
              className="flex-1 sm:w-full text-sm font-medium bg-accent text-white rounded-lg px-4 py-2.5 hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {isExpanding ? "Expanding..." : "Expand co-authors"}
            </button>
            <Link
              href={`/professor/${node.id}`}
              className="flex-1 sm:w-full text-sm font-medium text-accent bg-accent-bg hover:bg-accent-border rounded-lg px-4 py-2.5 transition-colors text-center"
            >
              View full profile →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
