# 3D Research Network Explorer — Design

## Summary

A new `/explore` page with an interactive 3D force-directed graph showing research collaboration networks. Users can search by topic (see top 30 authors in a field and their co-authorship connections) or by author (see a professor's co-author network colored by research topic). Clicking a node expands that author's co-authors into the graph and opens a side panel with details.

## Decisions

- **Library:** `react-force-graph-3d` (Three.js/WebGL, native React, 29K weekly downloads, actively maintained)
- **Entry points:** Topic search (top 30 authors + cross-collaboration edges) AND author search (co-author network)
- **Graph depth:** 1 level on initial load; expand on click
- **Node click behavior:** Expand co-authors into graph + show side panel with author details
- **Node design:** Size by h-index, color by primary research domain
- **Edge design:** Thickness by co-authorship count (number of shared papers)
- **Homepage:** Announcement card + hero integration ("Explore Networks" alongside existing search)
- **Caching:** Browser-level cache for API responses to minimize redundant calls

## Architecture

### New Files

```
src/app/explore/page.tsx          — Server component, page shell
src/components/NetworkGraph.tsx    — Client component wrapping react-force-graph-3d (dynamic import, ssr: false)
src/components/ExploreSearch.tsx   — Client search bar for graph page
src/components/NodeDetailPanel.tsx — Slide-out panel for clicked node details
src/lib/graph.ts                  — Graph data building functions + browser cache layer
```

### Data Flow

1. User searches topic/author on `/explore`
2. `ExploreSearch` triggers client-side fetch to build graph data
3. For **topic search**: calls OpenAlex topics API → gets top 30 authors → fetches their works → extracts co-authorship edges between those 30 authors
4. For **author search**: calls getAuthor → getAuthorWorks (50 works) → extracts co-authors + builds edges
5. Graph data is cached in browser (Map-based cache with 15-min TTL)
6. `NetworkGraph` renders 3D force-directed graph
7. Click node → fetch that author's co-authors → merge into graph + show `NodeDetailPanel`

### Graph Data Types

```typescript
interface GraphNode {
  id: string;          // OpenAlex author ID (e.g., "A1234567")
  name: string;
  institution: string;
  country: string;
  hIndex: number;
  citedByCount: number;
  worksCount: number;
  domain: string;      // Primary research domain (for coloring)
  val: number;         // Node size (derived from h-index)
}

interface GraphLink {
  source: string;      // Author ID
  target: string;      // Author ID
  weight: number;      // Number of co-authored papers
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
```

### Browser Cache Strategy

- Cache key: API URL string
- Cache value: response JSON + timestamp
- TTL: 15 minutes
- Storage: in-memory Map (survives page navigation within session, clears on tab close)
- Prevents duplicate API calls when expanding nodes or re-searching similar queries

### Homepage Changes

1. **Announcement card** between hero description and search bar: "NEW: Explore Research Networks" with brief description and CTA link
2. **Hero modification**: Add "Explore Networks" link/button near the search, linking to `/explore`

### Node Visualization

- **Size:** `val = Math.max(3, Math.sqrt(hIndex) * 2)` — ensures minimum visibility, scales with impact
- **Color:** Auto-colored by `domain` field (d3 categorical scheme built into react-force-graph)
- **Label:** Author name shown on hover
- **Center node:** Slightly larger when viewing an author's ego network

### Edge Visualization

- **Width:** `Math.max(1, Math.log2(weight + 1))` — logarithmic scale so 1 paper = thin, 10+ papers = thick
- **Color:** Semi-transparent gray (`rgba(150, 150, 150, 0.3)`), brightens on hover
- **Particles:** Optional animated particles flowing along edges on hover (built into react-force-graph)

### Side Panel (NodeDetailPanel)

When a node is clicked:
- Slide-in panel from right (~320px wide)
- Shows: name, institution, country, h-index, citations, works count, primary domain
- "View Full Profile" link → `/professor/[id]`
- "Close" button
- Panel overlays the graph, doesn't resize it

## Performance Considerations

- `react-force-graph-3d` loaded via `next/dynamic` with `ssr: false` — zero impact on other pages
- Initial cap of ~100 nodes; expanding a node adds its co-authors but doesn't re-fetch the entire graph
- Browser cache prevents redundant API calls during exploration session
- Force simulation auto-pauses after convergence (built-in behavior)
