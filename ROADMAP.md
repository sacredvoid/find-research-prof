# Only Research — Feature Roadmap

## Overview

This roadmap outlines planned features and improvements for Only Research, organized by priority tier. Each item links to a GitHub issue with full implementation details.

---

## Tier 1: High Priority (Low-Medium Effort, High Impact)

### Search History & Saved Filters — [#4](https://github.com/sacredvoid/find-research-prof/issues/4)
Store recent searches in localStorage and let users save named filter presets for quick re-use. Follows the existing `useSyncExternalStore` pattern.

### Search Autocomplete & Topic Suggestions — [#7](https://github.com/sacredvoid/find-research-prof/issues/7)
Show real-time topic suggestions as users type, powered by OpenAlex's autocomplete endpoint. Include related topics after search to improve discoverability.

---

## Tier 2: Medium Priority (Moderate Effort, Strong Impact)

### Dark Mode — [#5](https://github.com/sacredvoid/find-research-prof/issues/5)
Add light/dark/system theme toggle using Tailwind CSS 4 dark variants. Persist preference in localStorage, default to system setting.

### Publication Timeline Visualization — [#6](https://github.com/sacredvoid/find-research-prof/issues/6)
Interactive chart on professor profiles showing publications and citations per year. Helps users evaluate research trajectory at a glance.

### Advanced Search Filters — [#8](https://github.com/sacredvoid/find-research-prof/issues/8)
Add year range, research domain hierarchy, open access percentage, and h-index range filters. All natively supported by the OpenAlex API.

### Similar Researchers Recommendations — [#11](https://github.com/sacredvoid/find-research-prof/issues/11)
Show researchers with overlapping topics (but different institutions) on professor profiles. Complements the existing co-authors section.

---

## Tier 3: Lower Priority (Higher Effort, Strategic Value)

### Trending Topics & Field Analytics — [#10](https://github.com/sacredvoid/find-research-prof/issues/10)
Discovery page showing topics with highest recent publication growth, filterable by domain. Includes field-level analytics like geographic distribution and publication trends.

### Institution Comparison & Department Browsing — [#9](https://github.com/sacredvoid/find-research-prof/issues/9)
Institution profile pages with affiliated researchers, research strengths, and side-by-side institution comparison. Phase 1: institution page. Phase 2: comparison tool.

---

## Implementation Notes

- All features use localStorage for persistence (no auth required)
- Follow existing patterns: `useSyncExternalStore` caching, URL query param sync, skeleton loading states
- Chart features (#6, #10) should share a common chart component to reduce bundle size
- All new filters must be reflected in URL params for shareability
- New pages need corresponding E2E smoke tests in `e2e/`
- User-facing changes require a changelog entry in `src/app/changelog/page.tsx`
