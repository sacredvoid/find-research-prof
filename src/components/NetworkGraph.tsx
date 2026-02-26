"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useEffect, useState } from "react";
import { GraphData, GraphNode } from "@/types";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-ink-tertiary">
      Loading 3D graph...
    </div>
  ),
});

// Field-level color palette — more granular than domain-level
const FIELD_COLORS = [
  "#2563EB", // blue
  "#DC2626", // red
  "#16A34A", // green
  "#D97706", // amber
  "#7C3AED", // violet
  "#0891B2", // cyan
  "#DB2777", // pink
  "#059669", // emerald
  "#4F46E5", // indigo
  "#EA580C", // orange
  "#0D9488", // teal
  "#9333EA", // purple
  "#CA8A04", // yellow
  "#E11D48", // rose
  "#2DD4BF", // turquoise
];

const fieldColorMap = new Map<string, string>();

function getFieldColor(field: string): string {
  if (!field || field === "Other") return "#78716C";
  const existing = fieldColorMap.get(field);
  if (existing) return existing;
  const color = FIELD_COLORS[fieldColorMap.size % FIELD_COLORS.length];
  fieldColorMap.set(field, color);
  return color;
}

const BG_COLOR = "#F5F4F0";

interface NetworkGraphProps {
  graphData: GraphData;
  onNodeClick: (node: GraphNode) => void;
  highlightedNodeId?: string | null;
}

export default function NetworkGraph({
  graphData,
  onNodeClick,
  highlightedNodeId,
}: NetworkGraphProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleNodeClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      onNodeClick(node as GraphNode);
      // Aim camera at clicked node
      if (fgRef.current) {
        const distance = 200;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        fgRef.current.cameraPosition(
          {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          },
          node,
          1000
        );
      }
    },
    [onNodeClick]
  );

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative" style={{ backgroundColor: BG_COLOR }}>
      {graphData.nodes.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-ink-tertiary text-sm">
          Search for a topic or author to visualize their research network
        </div>
      ) : (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor={BG_COLOR}
          nodeLabel={(node: object) => {
            const n = node as GraphNode;
            return `<div style="background: rgba(28,25,23,0.92); color: white; padding: 8px 12px; border-radius: 8px; font-size: 13px; max-width: 250px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <div style="font-weight: 600;">${n.name}</div>
              <div style="opacity: 0.7; font-size: 11px; margin-top: 2px;">${n.institution}</div>
              <div style="opacity: 0.7; font-size: 11px;">h-index: ${n.hIndex} · ${n.citedByCount.toLocaleString()} citations</div>
              <div style="opacity: 0.5; font-size: 10px; margin-top: 2px;">${n.field}</div>
            </div>`;
          }}
          nodeColor={(node: object) => {
            const n = node as GraphNode;
            if (highlightedNodeId && n.id === highlightedNodeId) return "#1C1917";
            return getFieldColor(n.field);
          }}
          nodeVal={(node: object) => (node as GraphNode).val}
          nodeOpacity={0.9}
          linkWidth={(link: object) => {
            const l = link as { weight: number };
            return Math.max(0.5, Math.log2((l.weight || 1) + 1));
          }}
          linkColor={() => "rgba(120, 113, 108, 0.25)"}
          linkOpacity={0.6}
          onNodeClick={handleNodeClick}
          enableNodeDrag={true}
          enableNavigationControls={true}
          showNavInfo={false}
        />
      )}

      {/* Legend */}
      {graphData.nodes.length > 0 && (
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-paper/95 border border-rule rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs text-ink-secondary max-w-[200px] sm:max-w-xs shadow-sm">
          <div className="font-medium text-ink mb-1 sm:mb-2">Research Fields</div>
          <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1">
            {Array.from(new Set(graphData.nodes.map((n) => n.field)))
              .slice(0, 8)
              .map((field) => (
                <span key={field} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: getFieldColor(field) }}
                  />
                  <span className="truncate">{field}</span>
                </span>
              ))}
          </div>
          <div className="mt-1 sm:mt-2 text-ink-tertiary hidden sm:block">
            Click a node to see details · Drag to rotate · Scroll to zoom
          </div>
        </div>
      )}
    </div>
  );
}
