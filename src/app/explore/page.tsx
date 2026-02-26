"use client";

import { useState, useCallback } from "react";
import ExploreSearch from "@/components/ExploreSearch";
import NetworkGraph from "@/components/NetworkGraph";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import { GraphData, GraphNode } from "@/types";
import { buildAuthorGraph, buildTopicGraph, expandNode } from "@/lib/graph";
import Link from "next/link";

export default function ExplorePage() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [searchInfo, setSearchInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string, type: "topic" | "author") => {
    setIsLoading(true);
    setError(null);
    setSelectedNode(null);
    setSearchInfo(null);

    try {
      if (type === "author") {
        // Search for the author by name first, then build graph from the top result
        const BASE_URL = "https://api.openalex.org";
        const res = await fetch(
          `${BASE_URL}/authors?search=${encodeURIComponent(query)}&per_page=1&mailto=researchprof@example.com`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const author = data.results?.[0];
        if (!author) {
          setError("No author found for that name. Try a different search.");
          setGraphData({ nodes: [], links: [] });
          return;
        }
        const authorId = author.id.replace("https://openalex.org/", "");
        const graph = await buildAuthorGraph(authorId);
        setGraphData(graph);
        setSearchInfo(
          `Showing co-author network for ${author.display_name} · ${graph.nodes.length} researchers · ${graph.links.length} collaborations`
        );
      } else {
        const result = await buildTopicGraph(query);
        setGraphData({ nodes: result.nodes, links: result.links });
        const label = result.topicName || query;
        setSearchInfo(
          `Showing top researchers in "${label}" · ${result.nodes.length} researchers · ${result.links.length} collaborations`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setGraphData({ nodes: [], links: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleExpand = useCallback(
    async (nodeId: string) => {
      setIsExpanding(true);
      try {
        const existingIds = new Set(graphData.nodes.map((n) => n.id));
        const expansion = await expandNode(nodeId, existingIds);

        if (expansion.nodes.length === 0) {
          return;
        }

        setGraphData((prev) => ({
          nodes: [...prev.nodes, ...expansion.nodes],
          links: [...prev.links, ...expansion.links],
        }));
      } catch {
        // Silently fail expansion — node just doesn't expand
      } finally {
        setIsExpanding(false);
      }
    },
    [graphData.nodes]
  );

  return (
    <main className="h-[calc(100vh-49px)] flex flex-col overflow-hidden">
      {/* Top bar with search */}
      <div className="shrink-0 border-b border-rule bg-paper px-3 py-2 sm:px-4 sm:py-3">
        <div className="max-w-xl mx-auto flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-ink-tertiary hover:text-ink transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <ExploreSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>
        {searchInfo && (
          <p className="text-[10px] sm:text-xs text-ink-tertiary text-center mt-1.5 sm:mt-2 line-clamp-1">{searchInfo}</p>
        )}
        {error && (
          <p className="text-[10px] sm:text-xs text-red-600 text-center mt-1.5 sm:mt-2">{error}</p>
        )}
      </div>

      {/* Graph area */}
      <div className="flex-1 min-h-0 relative">
        <NetworkGraph
          graphData={graphData}
          onNodeClick={handleNodeClick}
          highlightedNodeId={selectedNode?.id}
        />
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onExpand={handleExpand}
          onNodeSelect={(node) => setSelectedNode(node)}
          isExpanding={isExpanding}
          links={graphData.links}
          nodes={graphData.nodes}
        />
      </div>
    </main>
  );
}
