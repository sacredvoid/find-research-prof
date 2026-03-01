# Landing Page Redesign

Date: 2026-03-01
Status: Approved

## Problem

The current landing page is a search box with minimal context. Visitors don't learn about saved lists, email drafting, professor comparison, CSV export, 3D network exploration, or filtering capabilities until they stumble into them. The page needs to communicate the full breadth of features.

## Audience

All academics equally: students, faculty, researchers, organizers.

## Design: Sectioned Scroll (Approach A)

Clean, editorial style. Typography-driven, generous whitespace. No heavy assets - CSS-only abstract visuals for feature illustrations.

### Section 1: Hero

- Layout: Centered, max-w-2xl, generous vertical padding
- Tagline (small, accent): "Search 240M+ academic works across every field and country."
- Headline (large, bold): "Find the right researcher, faster."
- Subtitle (secondary): "Search by topic, name, or institution. Save professors, draft emails, compare candidates, and explore collaboration networks - all in one place."
- SearchBar component (unchanged, has topic/name/institution tabs)
- Example topics row (unchanged)

### Section 2: Feature Grid (3 columns)

Three pillars, no card borders, just icon + text:

1. Search & Discover (search icon) - Find professors by research topic, name, or institution. Filter by country, citations, and sort by relevance.
2. Save & Track (bookmark icon) - Build your shortlist, add notes, track email status, compare up to 4 professors side by side, and export to CSV.
3. Explore Networks (network icon) - Visualize collaboration graphs in 3D. See how researchers in a field connect, expand nodes to discover new collaborators.

### Section 3: Feature Deep-Dives (4 alternating sections)

Each section: text on one side, abstract CSS illustration on the other. Alternating left/right layout.

#### 3a. Professor Profiles
- Topics, publications, citation metrics, co-authors
- Links to Google Scholar, ORCID, lab pages
- Cold email drafting, accepting-students reporting

#### 3b. Save, Compare & Export
- Saved list with notes and email status tracking
- Side-by-side comparison (up to 4 professors)
- CSV export for offline tracking

#### 3c. Smart Filtering
- Filter by country, minimum citations
- Sort by most cited or most published
- Multi-page export options

#### 3d. 3D Network Explorer
- Full-width, slightly tinted background to stand out
- Brief text + prominent link to /explore
- Describes collaboration graph visualization

### Section 4: Who It's For (2x2 grid)

| Audience | Use case |
|----------|----------|
| Students | Find research assistantships, PhD advisors, or labs to join |
| Faculty | Identify reviewers, panelists, or collaborators in any niche |
| Researchers | Audit your network and discover adjacent collaborators |
| Organizers | Map who's actively publishing when planning events |

### Section 5: Footer

Same as current - OpenAlex attribution, CC0 license, 240M+ works stat.

## Implementation Notes

- page.tsx is a server component, SearchBar is the only client component
- Existing design tokens in globals.css (paper, ink, accent, etc.)
- Tailwind CSS 4 with @theme inline
- Max-width shifts from max-w-2xl (hero) to wider max-w-4xl or max-w-5xl for feature sections
- Mobile: all grids stack to single column, deep-dives stack text above visual
- Abstract illustrations are CSS-only (colored shapes, dots, lines) to avoid image maintenance

## Separate Task: 3D Mesh Background

Add a subtle mesh/grid background to the Explore Networks page (/explore) to reinforce the 3D spatial feel. This is a separate implementation task.

## Task IDs

- Task #1: Explore project context (completed)
- Task #2: Ask clarifying questions (completed)
- Task #3: Propose approaches (completed)
- Task #4: Present design (completed)
- Task #5: Write design doc (this doc)
- Task #6: Transition to implementation
