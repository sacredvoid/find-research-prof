# Only Research - Project Instructions

## Overview
Next.js 16 app (App Router) for searching academic professors via OpenAlex API. Deployed on Vercel.

## Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm test             # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright, requires build)
```

## Before Pushing to Main
1. Run `npm test` and confirm all unit tests pass
2. Run `npm run build` and confirm no build errors
3. Run `npm run test:e2e` and confirm E2E tests pass
4. Update `src/app/changelog/page.tsx` with a new version entry if there are user-facing changes
   - Bug fixes: describe as "Major/Minor bug fix" without implementation details
   - Features: can be described in detail

## Architecture
- **Pages**: `src/app/` (App Router with server components by default)
- **Components**: `src/components/` (client components marked with "use client")
- **API layer**: `src/lib/openalex.ts` (all OpenAlex API calls)
- **Storage**: `src/lib/storage.ts` (localStorage with caching for useSyncExternalStore)
- **Config**: `src/lib/config.ts` (constants, env vars)
- **Types**: `src/types/index.ts`

## Key Patterns

### useSyncExternalStore Caching
Any function used as a `getSnapshot` in `useSyncExternalStore` MUST return a stable reference when data hasn't changed. Always cache parsed results from localStorage and only re-parse when the raw string changes. See `storage.ts` for the pattern.

### Testing
- Unit tests: `src/lib/__tests__/` (Vitest)
- E2E tests: `e2e/` (Playwright)
- CI: `.github/workflows/ci.yml` (TypeScript check, unit tests, build, E2E)

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- Vitest (unit tests)
- Playwright (E2E tests)
- Vercel (deployment)
- OpenAlex API (data source)
