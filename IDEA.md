# Only Research — Find Professors Researching in Your Field

## The Problem

Finding professors to do research with is painful. Whether you're an undergrad looking for a lab, a prospective PhD student finding an advisor, or a researcher seeking collaborators — the process today is:

1. Search Google Scholar for papers in your area
2. Manually check each author's profile
3. Visit individual university department pages (every school has a different format)
4. Piece together info from scattered sources (lab websites, ORCID, ResearchGate)
5. Cold-email professors with limited context

This especially hurts international students, first-generation students, and anyone without an existing academic network. Professors receive hundreds of low-effort emails a year because students lack the tools to do proper research before reaching out.

## The Gap

No single platform lets you:
- Search by research topic and see professors worldwide who actively publish in that area
- View their recent papers, citation metrics, institution, and lab info in one place
- Filter by country, university, field, seniority
- Get direct links to their lab page, Google Scholar, ORCID, email
- All in a clean, readable interface

### Existing Tools and Why They Don't Solve This

| Tool | What It Does | What It Doesn't Do |
|---|---|---|
| Google Scholar | Search papers, see author profiles | Not professor-centric. No filtering by institution, field, availability. |
| ResearchGate / Academia.edu | Social networks for academics | Opt-in only. Cluttered UI. Designed for researchers, not students discovering professors. |
| Semantic Scholar | AI-powered paper search (214M papers) | Paper-first, not person-first. |
| Connected Papers / Research Rabbit / Litmaps | Citation mapping & visualization | Find related papers, not professors to work with. |
| University faculty directories | Per-school faculty listings | Completely fragmented — every school has a different format, no cross-university search. |
| Rate My Professors | Teaching quality ratings | Zero research information. |

## The Solution

A Wikipedia-style website where anyone can search a research topic and instantly find professors working in that field, with direct links to their work.

### Core Experience

```
User types: "computational neuroscience"
                    |
                    v
    Clean results page showing professors:
    ┌─────────────────────────────────────────────────┐
    │  Dr. Jane Smith                                 │
    │  MIT — Department of Brain & Cognitive Sciences  │
    │  Topics: computational neuroscience, neural      │
    │          coding, Bayesian brain models            │
    │  h-index: 45  |  Papers: 120  |  Citations: 8.2k │
    │  Recent: "Neural population dynamics..." (2025)  │
    │  [Scholar] [Lab Page] [ORCID] [Email]            │
    └─────────────────────────────────────────────────┘
```

### Each Professor Gets a Wikipedia-Style Page

- **Header**: Name, title, institution, department, location
- **Research Overview**: Auto-generated summary of their research focus areas
- **Topic Tags**: Clickable tags linking to other professors in the same area
- **Publications**: Recent papers with titles, links, citation counts
- **Metrics**: h-index, total citations, publication count, years active
- **Links**: Google Scholar, ORCID, lab website, institutional page, email
- **Co-authors**: Network of frequent collaborators (clickable)
- **Institution Info**: Link to the university/department page

## Target Audience

1. **Prospective PhD students** — finding potential advisors worldwide
2. **Undergrads seeking research** — finding labs to join at their own or other institutions
3. **Researchers seeking collaborators** — discovering who else works in their area
4. **International students** — who don't have existing network connections and need structured discovery

## Data Sources

The key insight: **professors don't need to sign up.** All data is publicly available.

| Source | What It Provides | Cost |
|---|---|---|
| **OpenAlex** | 240M+ works, author profiles, institutions, topics. REST API. CC0 license. | Free ($1/day API budget with free key, or self-host the full dataset) |
| **Semantic Scholar API** | 214M papers, AI-generated summaries, author profiles | Free |
| **ORCID** | Unique researcher IDs, career history | Free public API |
| **CrossRef** | DOI metadata, publication details | Free |
| **University websites** | Lab pages, department pages, emails | Scraping (as needed) |

**OpenAlex is the primary data backbone** — it already has structured author, institution, and topic data covering most of the global research system.

## UI Philosophy

**Wikipedia-like: simple, informative, no clutter.**

- Clean typography, lots of whitespace
- Information density without visual noise
- Search-first experience (big search bar, immediate results)
- No login required to browse
- No ads cluttering the experience
- Mobile-friendly
- Fast — pages should load instantly

## Key Features (MVP)

1. **Topic Search** — Search any research area, get a list of active professors
2. **Professor Profiles** — Clean page per professor with all info aggregated
3. **Filters** — By country, institution, field, citation count, recency of publications
4. **Direct Links** — One-click access to their Google Scholar, papers, lab page, email
5. **Topic Pages** — Wikipedia-style pages for research topics showing top professors, key papers, related fields
6. **Co-author Network** — See who collaborates with whom

## Key Features (Future)

- **"Accepting Students" signals** — Crowdsourced or scraped from lab websites
- **Saved lists** — Save professors you're interested in (requires account)
- **Email templates** — Help students write better cold emails based on the professor's work
- **Compare** — Side-by-side comparison of professors/institutions
- **Trending topics** — What research areas are growing fastest
- **Funding info** — Which professors have active grants
- **Lab reviews** — Anonymous reviews from former students/postdocs

## Technical Architecture (High Level)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Frontend   │────>│   Backend API    │────>│   Database   │
│  Next.js +   │     │   (Node/Python)  │     │  PostgreSQL  │
│  Tailwind    │     │                  │     │              │
└──────────────┘     └────────┬─────────┘     └──────────────┘
                              │
                    ┌─────────┴──────────┐
                    │   Data Pipeline    │
                    │                    │
                    │  OpenAlex API      │
                    │  Semantic Scholar  │
                    │  ORCID             │
                    │  CrossRef          │
                    └────────────────────┘
```

### Tech Stack (Proposed)

- **Frontend**: Next.js + Tailwind CSS (fast, SEO-friendly with SSR)
- **Backend**: Node.js or Python (FastAPI)
- **Database**: PostgreSQL (structured relational data fits perfectly)
- **Search**: Elasticsearch or Typesense (fast full-text search across topics, names, institutions)
- **Data Pipeline**: Python scripts to ingest from OpenAlex/Semantic Scholar APIs, run on a schedule
- **Hosting**: Vercel (frontend) + Railway/Fly.io (backend) or a single VPS
- **Cache**: Redis (cache API responses, hot professor profiles)

### Data Pipeline Flow

```
1. Initial bulk import from OpenAlex dataset (downloadable)
2. Daily incremental sync via OpenAlex API (~50k new works/day)
3. Enrich with Semantic Scholar (AI summaries)
4. Enrich with ORCID (career history, education)
5. Store normalized data in PostgreSQL
6. Index in Elasticsearch for search
```

## Monetization (If Desired)

- **Freemium**: Free browsing, paid features (saved lists, alerts, advanced filters)
- **University partnerships**: Universities pay to feature/verify their faculty profiles
- **Promoted profiles**: Labs pay for visibility when recruiting
- **API access**: Charge for programmatic access to aggregated data
- **Job board**: Research position postings

## Competitive Moat

1. **Aggregation** — No one else combines OpenAlex + Semantic Scholar + ORCID into a professor-centric view
2. **UX** — Wikipedia-clean UI vs. the cluttered academic tools that exist today
3. **SEO** — Professor profile pages would rank highly for "[professor name] research"
4. **Network effects** — As students use it, crowdsourced data (reviews, "accepting students" flags) adds value
5. **No opt-in required** — Works from day one because data is public

## Open Questions

- How to handle data accuracy? Professors change institutions, retire, etc.
- How to distinguish active researchers from inactive ones? (Filter by recency of publications)
- Legal considerations for aggregating public academic data?
- How to handle name disambiguation? (OpenAlex and ORCID help here)
- Should the MVP focus on a specific field (e.g., CS, biology) or go broad?
- How to get initial traction? (Reddit, Twitter/X academic communities, university forums)

## Success Metrics

- Number of searches per day
- Number of unique visitors
- Time spent on professor profiles
- Click-through rate to external links (Scholar, lab pages)
- Return visitor rate
- Number of research fields covered with meaningful results
