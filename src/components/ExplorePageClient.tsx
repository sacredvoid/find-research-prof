"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExploreSearch from "@/components/ExploreSearch";
import NetworkGraph from "@/components/NetworkGraph";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { GraphData, GraphNode } from "@/types";
import { buildAuthorGraph, buildTopicGraph, expandNode } from "@/lib/graph";
import { OPENALEX_BASE_URL, OPENALEX_MAILTO, MAX_GRAPH_NODES } from "@/lib/config";
import Link from "next/link";

export default function ExplorePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [searchInfo, setSearchInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restore search from URL on mount
  const urlQuery = searchParams.get("q") || "";
  const urlType = (searchParams.get("type") as "topic" | "author") || "topic";

  const handleSearch = useCallback(async (query: string, type: "topic" | "author") => {
    setIsLoading(true);
    setError(null);
    setSelectedNode(null);
    setSearchInfo(null);

    // Persist search to URL
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("type", type);
    router.replace(`/explore?${params.toString()}`);

    try {
      if (type === "author") {
        const res = await fetch(
          `${OPENALEX_BASE_URL}/authors?search=${encodeURIComponent(query)}&per_page=1&mailto=${OPENALEX_MAILTO}`
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
  }, [router]);

  // Auto-search from URL params on mount
  useEffect(() => {
    if (urlQuery && graphData.nodes.length === 0 && !isLoading) {
      handleSearch(urlQuery, urlType);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleExpand = useCallback(
    async (nodeId: string) => {
      setIsExpanding(true);
      setError(null);
      try {
        const existingIds = new Set(graphData.nodes.map((n) => n.id));
        const expansion = await expandNode(nodeId, existingIds);

        if (expansion.nodes.length === 0) {
          setError("No new co-authors found for this researcher.");
          return;
        }

        setGraphData((prev) => ({
          nodes: [...prev.nodes, ...expansion.nodes],
          links: [...prev.links, ...expansion.links],
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to expand node. Please try again.");
      } finally {
        setIsExpanding(false);
      }
    },
    [graphData.nodes]
  );

  const handleReset = useCallback(() => {
    setGraphData({ nodes: [], links: [] });
    setSelectedNode(null);
    setSearchInfo(null);
    setError(null);
    router.replace("/explore");
  }, [router]);

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
          <ExploreSearch
            onSearch={handleSearch}
            isLoading={isLoading}
            defaultQuery={urlQuery}
            defaultType={urlType}
          />
          {graphData.nodes.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors shrink-0"
              title="Reset graph"
            >
              Reset
            </button>
          )}
        </div>
        <div className="max-w-xl mx-auto">
          {searchInfo && (
            <p className="text-[10px] sm:text-xs text-ink-tertiary text-center mt-1.5 sm:mt-2 line-clamp-1">
              {searchInfo}
              {graphData.nodes.length > 0 && (
                <span className="ml-2 font-mono">
                  ({graphData.nodes.length}/{MAX_GRAPH_NODES} nodes)
                </span>
              )}
            </p>
          )}
          {error && (
            <p className="text-[10px] sm:text-xs text-red-600 text-center mt-1.5 sm:mt-2">{error}</p>
          )}
        </div>
      </div>

      {/* Graph area */}
      <div className="flex-1 min-h-0 relative">
        <ErrorBoundary
          fallback={
            <div className="w-full h-full flex items-center justify-center text-ink-tertiary">
              <div className="text-center">
                <p className="mb-2">The 3D graph failed to load.</p>
                <p className="text-sm">Your browser may not support WebGL. Try refreshing the page.</p>
              </div>
            </div>
          }
        >
          <NetworkGraph
            graphData={graphData}
            onNodeClick={handleNodeClick}
            highlightedNodeId={selectedNode?.id}
          />
        </ErrorBoundary>
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
