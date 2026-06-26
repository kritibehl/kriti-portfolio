# 20/10 Upgrade Notes

## Experience improvements

- Rebalanced the hero so the engineering story and live observatory share the first fold on desktop.
- Added clear recruiter actions and an availability signal without turning the page into a generic job-seeker template.
- Tightened section rhythm, project spacing, and oversized outcome typography.
- Kept KubePulse as the flagship WebGL interaction while preserving lightweight motion elsewhere.

## Reliability fixes

- Animated evidence metrics now include deterministic final-value fallbacks.
- Print/PDF exports always show complete values such as `100k+`, `1,500+`, `0.0%`, and `+608%`.
- WebGL is replaced by a print-safe static diagnostic topology during PDF export.
- Print styles remove fixed navigation, viewport heights, transform effects, and oversized blank pages.
- Project sections use compact print layouts and intentional page breaks.

## Engineering quality

- Added keyboard focus states and button types.
- Added polite live regions for changing system decisions.
- Pinned dependency versions and included a public-registry lockfile.
- Added `npm run typecheck` and `npm run check`.
- Verified a clean `npm ci`, TypeScript check, and production Next.js build.
