# ResearchProf — Comprehensive Website Review

**Date**: 2026-02-28
**Scope**: Product, Engineering, Security, Performance

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Review](#product-review)
3. [Engineering Review](#engineering-review)
4. [Security Analysis](#security-analysis)
5. [Performance Analysis](#performance-analysis)
6. [Recommended Feature Roadmap](#recommended-feature-roadmap)

---

## Executive Summary

ResearchProf is a well-executed MVP — a Next.js 16 website that helps students and researchers discover professors by research topic using OpenAlex data. The architecture is lean (no backend, direct API calls), the UX is clean, and the 3D network explorer is a strong differentiator.

However, the codebase has meaningful gaps in **error resilience**, **scalability**, **security hardening**, and **product completeness** that need to be addressed before growth. This document catalogs every issue found and provides a prioritized roadmap.

---

## Product Review

### What Works Well

- **Clear value proposition**: The homepage immediately communicates what the tool does and for whom.
- **Dual search modes**: Topic search (via OpenAlex topics) and name search cover the two primary use cases.
- **3D Network Explorer**: A compelling differentiator. Interactive graph visualization is engaging and useful for mapping collaborations.
- **Professor profiles**: Clean, information-dense pages with metrics, publications, co-authors, and external links.
- **No login required**: Lowers the barrier to entry significantly.
- **SEO**: JSON-LD structured data, OpenGraph tags, sitemap, and robots.txt are all in place.

### Product Gaps & Issues

#### P0 — Critical UX Gaps

| Issue | Location | Impact |
|-------|----------|--------|
| **No loading states on search page** | `src/app/search/page.tsx` | User sees nothing while server-side search runs. No skeleton, no spinner. Feels broken on slow connections. |
| **No URL state for explore search** | `src/components/ExplorePageClient.tsx` | Refreshing the /explore page loses the current search. Users can't share or bookmark a network view. |
| **Silent failure on node expansion** | `ExplorePageClient.tsx:81` | When expanding a node fails, the catch block is empty. User gets no feedback. |
| **Professor page shows only 20 works** | `src/app/professor/[id]/page.tsx:74` | No "load more" or pagination for publications. Professors with 500+ papers only show 20. |
| **Co-authors derived from only 20 works** | `professor/[id]/page.tsx:208` | The co-authors section is built from the 20 displayed works, not the full publication history. This gives a misleading view. |

#### P1 — Missing Features (from IDEA.md)

| Feature | Status | Notes |
|---------|--------|-------|
| Email/contact info | Not implemented | IDEA.md mentions "[Email]" in the mockup but no email is shown. OpenAlex doesn't provide emails, so scraping or ORCID integration would be needed. |
| Research overview / AI summary | Not implemented | IDEA.md calls for "auto-generated summary of research focus areas." |
| "Accepting Students" signals | Not implemented | Future feature in IDEA.md. Would be a major differentiator. |
| Saved professor lists | Not implemented | Requires user accounts. |
| Topic pages | Not implemented | IDEA.md mentions "Wikipedia-style pages for research topics showing top professors, key papers, related fields." |
| Compare professors | Not implemented | Side-by-side comparison view. |
| Institution search/filter | Partially done | Filter by country exists, but not by specific institution. |
| Recent work preview in search | Not implemented | `Professor` type has `recentWork` and `recentWorkYear` fields but they are always `null`. Never populated in `authorToProfessor()`. |

#### P2 — UX Polish Issues

| Issue | Details |
|-------|---------|
| **No dark mode** | The "paper" theme is hardcoded. No dark mode toggle. |
| **No search history** | No autocomplete or recent searches. |
| **Graph can grow unbounded** | Repeated node expansion can add hundreds of nodes, making the graph unusable. No "reset" or "clear" button. |
| **Filter sidebar doesn't show active count** | Desktop sidebar shows "(active)" only on mobile. Desktop has no visual indicator of how many filters are applied. |
| **About page is text-heavy** | Could benefit from illustrations, screenshots, or a video walkthrough. |
| **No 404 page** | Missing custom not-found page. |
| **Explore page has no keyboard shortcuts** | No escape-to-close for the detail panel, no keyboard navigation of nodes. |
| **Country filter is limited** | Only 16 countries in the dropdown. Missing many (e.g., Mexico, Argentina, Russia, Turkey, South Africa, etc.). |
| **No breadcrumbs** | Professor pages have no back-to-search navigation beyond browser back. |

---

## Engineering Review

### Architecture Assessment

**Strengths:**
- Clean separation: `lib/` for data, `components/` for UI, `types/` for interfaces, `app/` for pages.
- Server components by default, with `"use client"` only where needed (SearchBar, ExplorePageClient, NetworkGraph, NodeDetailPanel, PublicationFilters).
- TypeScript strict mode enabled.
- Clean, consistent code style.

**Weaknesses:**
- No backend — every user request hits OpenAlex directly. No rate limit management.
- No database — no ability to store user data, bookmarks, or analytics beyond Vercel's.
- No API layer — search logic lives in server components, making it hard to reuse or test.

### Code Quality Issues

#### Duplicated Code

| Duplication | Locations | Fix |
|-------------|-----------|-----|
| `formatNumber()` function | `src/app/search/page.tsx:8`, `src/app/professor/[id]/page.tsx:8`, `src/components/NodeDetailPanel.tsx:6`, `src/components/ProfessorCard.tsx:4` | Extract to `src/lib/utils.ts` |
| `countryCodeToName()` function | `src/lib/openalex.ts:218`, `src/app/professor/[id]/page.tsx:14` | Already in `openalex.ts` but not exported. Duplicate in professor page. |
| `BASE_URL` and `MAILTO` constants | `src/lib/openalex.ts:3-4`, `src/lib/graph.ts:3-4` | Extract to shared config |
| `COUNTRY_OPTIONS` array | `src/app/search/page.tsx:103` | Hardcoded inline. Should be in a shared constants file. |

#### Missing Error Boundaries

- No React error boundary wrapping the 3D graph. If `react-force-graph-3d` crashes (WebGL failures, GPU limits), the entire explore page goes white.
- No error boundary on professor pages. A malformed OpenAlex response crashes the page.

#### Type Safety Gaps

| Issue | Location |
|-------|----------|
| `any` casts in NetworkGraph | `NetworkGraph.tsx:60,80` — `fgRef` and `node` parameter use `any` |
| Unsafe type assertion for search params | `search/page.tsx:85` — casts `params.sortBy` to `SearchFilters["sortBy"]` without validation |
| `OpenAlexWork.primary_location` can be null | `types/index.ts:40-44` — correctly typed as nullable, but `professor/[id]/page.tsx:248` accesses `work.primary_location?.source?.display_name` without fallback in all paths |

#### Missing Tests

- **Zero test files** in the entire project.
- No unit tests for `openalex.ts` (API client).
- No unit tests for `graph.ts` (graph building logic).
- No integration/E2E tests for search or professor pages.
- No test runner configured (no Jest, Vitest, Playwright, or Cypress in `package.json`).

#### Missing Development Infrastructure

| Missing | Impact |
|---------|--------|
| **No testing framework** | No automated verification of behavior |
| **No CI/CD pipeline** | No `.github/workflows/` or equivalent |
| **No `.env` / env management** | `MAILTO` is hardcoded. `SITE_URL` is hardcoded. No environment variables used. |
| **No Prettier** | Only ESLint for code consistency |
| **No pre-commit hooks** | No Husky/lint-staged |
| **No Storybook** | No component development in isolation |

### Dependency Concerns

| Package | Issue |
|---------|-------|
| `react-force-graph-3d` | Bundles Three.js (~600KB min). Heavy dependency for a single page feature. |
| `next: 16.1.6` | Very recent version. Ensure stability before production. |
| `react: 19.2.3` | React 19 — ensure all libraries are compatible. |
| No lockfile validation | No `npm audit` in CI. |

---

## Security Analysis

### Critical Issues

#### SEC-1: Potential XSS via `dangerouslySetInnerHTML`

**Severity: HIGH**
**Locations:**
- `src/app/layout.tsx:100` — JSON-LD injection
- `src/app/professor/[id]/page.tsx:107` — JSON-LD with user-controlled data

**Details:** The professor page builds a JSON-LD object containing `author.display_name` and `institution.display_name` from OpenAlex API responses, then injects it via `dangerouslySetInnerHTML`. If OpenAlex ever returns a name containing `</script>`, it would break out of the JSON-LD block.

**Fix:** Use `JSON.stringify()` with proper escaping, or use a library like `serialize-javascript` that escapes `</script>` and `<!--` sequences.

#### SEC-2: Potential XSS in 3D Graph Tooltips

**Severity: HIGH**
**Location:** `src/components/NetworkGraph.tsx:115-120`

**Details:** The `nodeLabel` callback constructs raw HTML strings with user data (`n.name`, `n.institution`, `n.field`) that comes from the OpenAlex API. If any of these fields contain HTML/script tags, they will be rendered in the tooltip.

```typescript
// Current (vulnerable):
return `<div>...<div style="font-weight: 600;">${n.name}</div>...`;
```

**Fix:** Escape HTML entities in node data before interpolation, or use a safe rendering approach.

#### SEC-3: OpenAlex API as a Trust Boundary

**Severity: MEDIUM**

**Details:** The application treats all OpenAlex API responses as trusted data. Author names, institution names, topic names, and work titles are rendered directly into HTML without sanitization. While OpenAlex is a reputable source, treating any external API response as safe HTML content is a security anti-pattern.

**Fix:** Sanitize all string fields from API responses before rendering.

### Medium Issues

#### SEC-4: No Rate Limiting on Client-Side Requests

**Severity: MEDIUM**
**Location:** `src/components/ExplorePageClient.tsx:28-33`

**Details:** The explore page makes direct client-side `fetch()` calls to OpenAlex with no rate limiting. A user (or bot) could rapidly trigger searches, potentially getting the application's `mailto` identifier rate-limited by OpenAlex.

**Fix:** Add debouncing to search inputs and rate-limit graph expansion.

#### SEC-5: No Content Security Policy (CSP)

**Severity: MEDIUM**
**Location:** `next.config.ts` (empty config)

**Details:** No CSP headers are configured. The application loads WebGL content and external fonts, making a CSP important for defense-in-depth against XSS.

**Fix:** Add CSP headers in `next.config.ts` or via middleware.

#### SEC-6: Missing Security Headers

**Severity: MEDIUM**
**Location:** `next.config.ts`

**Details:** No `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` headers configured. Next.js doesn't set all of these by default.

**Fix:** Add security headers via `next.config.ts` headers config or middleware.

### Low Issues

#### SEC-7: Hardcoded Mailto Identifier

**Severity: LOW**
**Locations:** `src/lib/openalex.ts:4`, `src/lib/graph.ts:4`, `src/components/ExplorePageClient.tsx:29`

**Details:** `researchprof@example.com` is hardcoded in three places. This isn't a secret, but it should be an environment variable for configuration management.

#### SEC-8: No Input Length Limits

**Severity: LOW**
**Location:** `src/components/SearchBar.tsx:54`

**Details:** The search input has no `maxLength` attribute. Extremely long queries would be passed to the API.

#### SEC-9: ID Validation Inconsistency

**Severity: LOW**

**Details:** `getAuthor()` and `getAuthorWorks()` validate the author ID format (`/^A\d+$/`), but `buildTopicGraph()` doesn't validate topic IDs. The `searchByTopic()` function passes user-controlled topic IDs directly to API filters.

---

## Performance Analysis

### Critical Performance Issues

#### PERF-1: 3D Graph Library Bundle Size

**Severity: HIGH**
**Impact:** ~600KB+ added to client bundle

**Details:** `react-force-graph-3d` depends on Three.js, which is a very large library. Although it's dynamically imported (only loaded on `/explore`), this still means:
- First visit to `/explore` downloads ~600KB of JavaScript.
- Three.js is not tree-shakeable in this context.

**Mitigations already in place:** Dynamic import with `ssr: false`.
**Potential improvement:** Consider `react-force-graph-2d` as a lighter alternative (~100KB) for users who don't need 3D, with 3D as an opt-in.

#### PERF-2: No Debouncing on Search

**Severity: MEDIUM**
**Location:** `src/components/SearchBar.tsx`, `src/components/ExploreSearch.tsx`

**Details:** Search is form-submit based (not debounced autocomplete), which is fine for the main search. However, the explore search triggers heavy API calls (topic search + 30 authors + 200 works) with no protection against rapid re-submission.

#### PERF-3: Graph Data Grows Without Bound

**Severity: MEDIUM**
**Location:** `src/components/ExplorePageClient.tsx:77-78`

**Details:** Every node expansion appends nodes and links to the graph without limit:
```typescript
setGraphData((prev) => ({
  nodes: [...prev.nodes, ...expansion.nodes],
  links: [...prev.links, ...expansion.links],
}));
```

After 10+ expansions, the graph could have 150+ nodes and thousands of links. `react-force-graph-3d` performance degrades significantly beyond ~200 nodes.

**Fix:** Add a node limit (e.g., 150) and warn the user, or implement node pruning.

#### PERF-4: Waterfall API Calls in Topic Search

**Severity: MEDIUM**
**Location:** `src/lib/openalex.ts:43-83`

**Details:** `searchByTopic()` makes sequential API calls:
1. First searches topics (`/topics?search=...`)
2. Then searches authors (`/authors?filter=topics.id:...`)

These could potentially be parallelized or the topic lookup cached more aggressively.

#### PERF-5: No Image Optimization

**Severity: LOW**

**Details:** The site uses no images currently (no professor photos, no institutional logos). This is actually a performance win for now, but adding photos in the future should use Next.js `<Image>` component.

### Caching Assessment

| Layer | Status | Notes |
|-------|--------|-------|
| Server-side (ISR) | `revalidate: 3600` (1 hour) | Applied to all `fetchOpenAlex` calls. Good. |
| Browser cache (graph.ts) | 15-minute Map cache | Client-only, not persisted across tabs or sessions. |
| CDN caching | Vercel default | Static assets cached, dynamic pages ISR'd. |
| Service Worker | Not implemented | Could cache professor profiles for offline use. |

### Lighthouse Concerns (Estimated)

| Metric | Expected Score | Bottleneck |
|--------|---------------|------------|
| Performance (Home) | 90+ | Minimal JS, SSR |
| Performance (Search) | 85+ | Server-side rendering, some layout shift possible |
| Performance (Explore) | 60-70 | Three.js bundle, WebGL initialization |
| Performance (Professor) | 90+ | SSR, minimal client JS |
| Accessibility | 80-85 | Missing skip-to-content, some contrast issues possible |
| SEO | 95+ | Strong metadata, JSON-LD, sitemap |

---

## Recommended Feature Roadmap

### Phase 1 — Stability & Hardening (Weeks 1-2)

Priority: Fix what exists before adding new things.

1. **Add error boundaries** — Wrap the 3D graph and professor page in error boundaries.
2. **Fix XSS vectors** — Sanitize OpenAlex data in JSON-LD and graph tooltips.
3. **Add security headers** — CSP, X-Frame-Options, etc.
4. **Add loading states** — Skeleton loaders for search results page.
5. **Extract duplicated code** — `formatNumber`, `countryCodeToName`, constants.
6. **Add environment variables** — Move `MAILTO`, `SITE_URL` to `.env`.
7. **Set up testing** — Add Vitest for unit tests, Playwright for E2E.
8. **Add CI pipeline** — GitHub Actions with lint, type-check, test, build.

### Phase 2 — Product Polish (Weeks 3-4)

1. **Publication pagination** — "Load more" on professor pages.
2. **URL state for explore** — Persist search query in URL params on `/explore`.
3. **Graph node limit** — Cap at 150 nodes, add a "reset graph" button.
4. **Expand country list** — Add all countries with research output.
5. **Populate `recentWork`** — Fill in the unused Professor fields from the API.
6. **Custom 404 page** — Branded not-found experience.
7. **Keyboard shortcuts** — Escape to close panels, search focus.
8. **Breadcrumbs** — Navigation trail on professor and search pages.

### Phase 3 — New Features (Weeks 5-8)

1. **Institution filter** — Search/filter by specific university.
2. **Topic pages** — Dedicated pages for research topics with stats and top professors.
3. **AI research summaries** — Use an LLM to generate plain-language summaries from publication titles/abstracts.
4. **Professor comparison** — Side-by-side comparison view.
5. **Search autocomplete** — Suggest topics and names as user types.
6. **Dark mode** — Theme toggle with system preference detection.
7. **2D graph option** — Lighter alternative to 3D for lower-powered devices.

### Phase 4 — Growth Features (Weeks 9-12+)

1. **User accounts** — Authentication for personalization.
2. **Saved professor lists** — Bookmark and organize professors.
3. **"Accepting Students" signals** — Crowdsourced or scraped indicators.
4. **Email outreach templates** — Pre-filled email drafts based on professor's work.
5. **Trending research topics** — Dashboard showing fastest-growing fields.
6. **Notification alerts** — Email alerts when new professors publish in a saved topic.
7. **API access** — Public API for programmatic access to aggregated data.

---

## Summary of All Issues by Priority

### Must Fix (P0)

| # | Category | Issue | Location |
|---|----------|-------|----------|
| 1 | Security | XSS via `dangerouslySetInnerHTML` in JSON-LD | `layout.tsx:100`, `professor/[id]/page.tsx:107` |
| 2 | Security | XSS in 3D graph HTML tooltips | `NetworkGraph.tsx:115-120` |
| 3 | Product | No loading states on search | `search/page.tsx` |
| 4 | Product | Silent failure on node expansion | `ExplorePageClient.tsx:81` |
| 5 | Engineering | Zero test coverage | Entire project |

### Should Fix (P1)

| # | Category | Issue | Location |
|---|----------|-------|----------|
| 6 | Security | No CSP or security headers | `next.config.ts` |
| 7 | Security | No rate limiting on client API calls | `ExplorePageClient.tsx` |
| 8 | Performance | Graph grows without bound | `ExplorePageClient.tsx:77` |
| 9 | Engineering | Duplicated utility functions (4 copies) | Multiple files |
| 10 | Engineering | Hardcoded config (MAILTO, SITE_URL) | `openalex.ts`, `graph.ts`, `layout.tsx` |
| 11 | Engineering | No CI/CD pipeline | Missing entirely |
| 12 | Product | No URL state on explore page | `ExplorePageClient.tsx` |
| 13 | Product | Co-authors derived from only 20 works | `professor/[id]/page.tsx` |
| 14 | Product | Only 20 publications shown, no pagination | `professor/[id]/page.tsx` |

### Nice to Have (P2)

| # | Category | Issue | Location |
|---|----------|-------|----------|
| 15 | Security | No input length limits | `SearchBar.tsx` |
| 16 | Security | Inconsistent ID validation | `graph.ts` vs `openalex.ts` |
| 17 | Performance | Three.js bundle (~600KB) on explore | `NetworkGraph.tsx` |
| 18 | Performance | Sequential API calls in topic search | `openalex.ts:43-83` |
| 19 | Engineering | Missing error boundaries | All pages |
| 20 | Product | Limited country filter (16 countries) | `search/page.tsx:103` |
| 21 | Product | `recentWork` fields always null | `openalex.ts:38-39` |
| 22 | Product | No dark mode | `globals.css` |
| 23 | Product | No 404 page | Missing |
| 24 | Product | No breadcrumbs | All pages |

---

*This review covers the codebase as of 2026-02-28. All file references are relative to the project root.*
