# Product Improvement Research: ResearchProf

## Research Summary

Analysis of pain points from r/gradadmissions (333k members), r/GradSchool (924k members), r/AskAcademia, r/PhD, GradCafe, Student Doctor Network, and Quora — mapped to product opportunities.

---

## Top User Pain Points & Feature Opportunities

### 1. "Is This Professor Even Taking Students?" (HIGHEST demand)

**Pain point:** The #1 frustration across all communities. Students waste weeks emailing professors who aren't accepting students. There's no centralized way to know. Federal funding freezes (e.g., NSF turmoil) make this unpredictable.

**Opportunity:** Add an **"Accepting Students" crowdsourced signal**. Users can flag professors as "accepting students for Fall 2026" with a timestamp. Even partial data is hugely valuable — no competitor has this.

**Evidence:**
- Quora thread: "During graduate school application, how do I know if a professor has a spot for incoming PhD student?" — common unanswered question
- Multiple guides (UC Davis Luck Lab, Rice University) all say "email to ask if they're taking students" as the only option
- NSF funding uncertainty makes openings even more volatile and unpredictable

---

### 2. Cold Email Is Terrifying and Gets No Response

**Pain point:** Students describe cold emailing as "nerve-wracking." Response rates are abysmal — one student emailed an entire chemistry department and got ONE reply. Generic emails get professors to blacklist applicants. UPenn career services confirms "you might never hear back."

**Opportunity:** Build a **context-aware cold email draft generator** that auto-fills professor-specific details (recent papers, research topics, institution) from existing OpenAlex data. Not a generic AI template — a draft that references their actual published work.

**Evidence:**
- Tools like GPTina exist but lack research data integration
- Scholastic Babe: reaching out is "not an optional part of the process and it was a silent expectation"
- University of Rochester: emails must "sound authentic" — templates alone aren't enough, context matters

---

### 3. No Way to Vet Lab Culture / Toxic Advisors

**Pain point:** Reddit users report advisors who block graduation despite 20+ publications, gaslight students, isolate them from collaborations, and exploit labor. Former students are the only reliable source, but they're hard to find and won't speak openly.

**Opportunity:** Add **anonymous lab reviews** (Glassdoor for labs). Show mentoring style, work-life balance, graduation rate, funding stability. Even surfacing "average PhD completion time" from OpenAlex data (time between first and last publication under an advisor) would be novel and data-driven.

**Evidence:**
- AcademicHelp.net compiled Reddit experiences of toxic advisors
- 8 documented red flags of toxic lab culture (Jadson Jall, PhD)
- She Sciences: "Signs of a Toxic Research Advisor and Research Group in STEM"
- Multiple sources say: "Talk to FORMER (not current) students" — but finding them is extremely hard

---

### 4. Application Tracking Is Manual Chaos

**Pain point:** Students maintain complex 16-column spreadsheets to track professors, programs, deadlines, and email correspondence. Reddit's gradadmissions community has created shared tracking spreadsheets. Multiple Etsy sellers offer paid templates.

**Opportunity:** Add a **"My List" / Saved Professors** feature with notes, email tracking (sent/replied/no response), and side-by-side comparison. This drives repeat visits and retention — currently the biggest weakness (transactional "search once, leave" pattern).

**Evidence:**
- Science Latte: "My 16-Column Ph.D. Application Information Spreadsheet"
- Scholastic Babe: free tracker downloads with professor outreach lists
- The Daily Psych: multi-tab spreadsheet with color-coded faculty correspondence
- Roger Williams University: official sample tracking spreadsheet
- Etsy: paid Google Sheets templates for grad school tracking

---

### 5. Comparing Professors Is Hard

**Pain point:** Students agonize over choosing between advisors. They juggle research fit, career stage, funding, mentoring style, graduation rates, and the classic "superstar vs. hands-on advisor" tradeoff. MetaFilter thread: people sharing regret stories from both sides of the "better funding vs. better advisor" dilemma.

**Opportunity:** Build a **side-by-side professor comparison** view. Show h-index, citation count, publication recency, co-author count (proxy for lab size), topic overlap, and institution. All data already available in OpenAlex.

**Evidence:**
- APA: "The superstar professor may not be your best bet"
- Inside Higher Ed (GradHacker): "Choosing the Right Advisor"
- MetaFilter: "Choosing between grad schools: better funding or better advisor?"
- SWE: "Choosing the Right Ph.D. Advisor: The Control Freak, the Ghost, and the Rare Gem"

---

### 6. Google Scholar Is Showing Its Age

**Pain point:** No quality filter, vulnerable to AI-generated spam, black-box algorithm, controlled by a single for-profit company. Researchers increasingly prefer alternatives. Google Scholar is paper-first, not professor-first.

**Opportunity:** Double down on advantages over Google Scholar:
- **Recency filtering**: only show actively publishing professors (last 2 years)
- **Research trend indicators**: is this topic growing or declining?
- **Institution-level search**: "all ML researchers at MIT"
- **Quality signals**: h-index, citation metrics already shown

**Evidence:**
- LSE Impact Blog: "Google Scholar is not broken yet, but there are alternatives"
- PaperGuide: 2026 guide to Google Scholar alternatives
- Consensus.app: "Top 10 Alternatives to Google Scholar"

---

### 7. International Students Face Extra Barriers

**Pain point:** Finding research experience is "far more difficult as an international student." Visa requirements, timezone differences, and unfamiliarity with US academic systems compound the challenge.

**Opportunity:** Add filters for international-student-friendly labs (professors who have previously advised international students — inferable from co-author nationality patterns in OpenAlex). Add timezone indicator and language of publications filter.

---

## Prioritized Feature Roadmap

| Priority | Feature | Effort | Impact | Retention |
|----------|---------|--------|--------|-----------|
| P0 | Saved Professors / My List | Medium | High | Very High |
| P0 | Cold Email Draft Generator | Medium | Very High | Medium |
| P1 | "Accepting Students" Crowdsourced Signal | High | Very High | Very High |
| P1 | Side-by-Side Professor Comparison | Low | High | Medium |
| P1 | Institution-Level Search | Low | High | Medium |
| P2 | Anonymous Lab Reviews | High | Very High | Very High |
| P2 | Application Tracker (deadlines, status) | Medium | Medium | High |
| P2 | Research Trend Dashboard | Medium | Medium | Medium |
| P3 | Advisor Graduation Rate Estimation | Medium | High | Low |
| P3 | International Student Filters | Low | Medium | Low |

---

## Competitive Landscape

| Feature | Google Scholar | ResearchGate | ResearchProf |
|---------|--------------|--------------|-------------|
| Search by topic → professors | No (paper-first) | Partial | Yes |
| Collaboration network viz | No | No | Yes (3D graph) |
| "Accepting students" signal | No | No | Planned |
| Cold email generator | No | No | Planned |
| Lab reviews | No | No | Planned |
| Side-by-side comparison | No | No | Planned |
| Saved lists + tracking | No | Partial | Planned |
| Open data (CC0) | No | No | Yes (OpenAlex) |

---

## Quick Wins (Ship This Week)

1. **"Active Researcher" badge** — flag professors who published in the last 2 years (publication dates already available)
2. **Institution search** — add search type for "all researchers at [university] in [topic]"
3. **Export to CSV** — let users download search results (they already maintain manual spreadsheets)
4. **"Email this professor" link** — mailto: link with pre-populated subject line referencing their research area
5. **Share professor profile** — copy-link and social sharing buttons on profile pages

---

## Target Subreddits for Marketing & Feedback

| Subreddit | Members | Relevance |
|-----------|---------|-----------|
| r/gradadmissions | 333k | Primary — applicants searching for advisors |
| r/GradSchool | 924k | Current grad students, word of mouth |
| r/AskAcademia | ~1M | Professors + students, credibility |
| r/PhD | ~200k | PhD-specific pain points |
| r/professors | ~200k | Professor-side feedback |
| r/CSCareerQuestions | ~900k | CS research-track students |
| r/labrats | ~400k | Lab culture discussions |

---

## Sources

- [LSE: Google Scholar alternatives](https://blogs.lse.ac.uk/impactofsocialsciences/2024/10/22/google-scholar-is-not-broken-yet-but-there-are-alternatives/)
- [ProFellow: Using Google Scholar to find advisors](https://www.profellow.com/tips/how-to-find-your-ideal-phd-supervisor-using-google-scholar/)
- [APA: Seven steps to finding the right advisor](https://www.apa.org/monitor/2017/01/right-advisor)
- [SWE: Choosing the Right PhD Advisor](https://alltogether.swe.org/2025/04/choosing-phd-advisor/)
- [AcademicHelp: Toxic PhD Advisor experiences on Reddit](https://academichelp.net/blog/student-life/reddit-users-share-experiences-of-surviving-a-toxic-phd-advisor.html)
- [Scholastic Babe: PhD Application Trackers](https://www.scholasticbabe.com/blog/how-to-organize-your-phd-applications-trackers-and-spreadsheets-you-need)
- [Science Latte: 16-Column PhD Spreadsheet](https://science-latte.com/2022/01/03/my-16-column-spreadsheet/)
- [PaperGuide: Google Scholar Alternatives 2026](https://paperguide.ai/blog/google-scholar-alternatives/)
- [GradCafe: Emailing professors](https://forum.thegradcafe.com/topic/60035-emailing-professors-for-grad-school/)
- [EOS: Funding uncertainties and grad admissions](https://eos.org/research-and-developments/funding-uncertainties-hit-undergrad-reus-grad-admissions)
- [Clara Stein: Cold emailing in academia](https://clara-stein.medium.com/cold-emailing-in-academia-1b3f11b77e75)
- [UPenn Career Services: Reaching out to professors](https://careerservices.upenn.edu/blog/2023/11/16/to-reach-out-or-not-to-reach-out/)
- [8 Red Flags of Toxic Lab Culture](https://jadsonjall.com/2023/08/13/8-red-flags-indicating-a-toxic-lab-culture/)
- [UC Davis Luck Lab: Emailing faculty](https://lucklab.ucdavis.edu/blog/2018/9/17/emailing-faculty)
- [Rice University: How to email grad school professors](https://graduate.rice.edu/news/current-news/how-email-graduate-school-professors)
