# STATUS — PR 6 search, chips, URL state, empty results

| Field | Value |
|---|---|
| **PR** | 6 — Search, filter chips, shareable query URLs, empty state |
| **Title** | `feat: search, filter chips, shareable query URLs, empty state` |
| **Date** | 2026-09-06 |
| **Status** | Done |

## How to run

```bash
export PATH="/home/pedro/.local/bin:$PATH"
cd /home/pedro/Documents/catapp
pnpm dev
```

Open http://localhost:3000. Sticky header + search + species on mobile. H1 **Find yours**, chips, live count, grid. Shared `/?species=cat` first-paints cats only.

Verified from repo root:

- `pnpm lint` — pass
- `pnpm exec tsc --noEmit` — pass
- `pnpm build` — pass. Home is dynamic (`ƒ /`). First-load JS **132 kB** (route 13.3 kB + shared). Under the 150 kB gzip budget even before gzip.
- `pnpm test` — pass (94 unit tests)
- `pnpm test:e2e` — pass (10 Playwright tests)

Playwright `install --with-deps` failed here (sudo password). `pnpm exec playwright install chromium` succeeded. E2E uses port **3001** so it does not reuse a stale `next start` on 3000.

## Files changed

| Path | Role |
|---|---|
| `src/app/page.tsx` | Dynamic Server Component. Awaits `searchParams`, `parseCatalogQuery`, passes all `breeds` + `initialQuery` into `<Suspense><CatalogView /></Suspense>`. Fallback uses the same query so shared URLs do not flash the full catalog. |
| `src/components/CatalogView.tsx` | Client island. First render uses `initialQuery`. Chip/search changes `router.replace(..., { scroll: false })` (never push / `history.replaceState`). Writes `sessionStorage["cdr:lastCatalog"]` after `isSafeCatalogHref`. Mobile sticky: header + search + species. |
| `src/components/SearchInput.tsx` | Height 48, type 16px, `type=search`, placeholder **Search breeds (try GSD or Siamese)**, `aria-label="Search breeds"`, `id="breed-search"`, clear-X when `q` non-empty. No submit. |
| `src/components/SpeciesSegment.tsx` | All · Cats · Dogs radiogroup. |
| `src/components/FilterChip.tsx` / `FilterBar.tsx` | Wrapping chips, 40px, radius 999. Size S/M/L, Energy L/M/H, Shedding L/M/H, Lifestyle toggles. Single-select bands tap-again-to-clear. Selected: accent-soft fill, ink label, accent border, `aria-pressed`. Optional **Clear**. |
| `src/components/ResultCount.tsx` | “N breeds” / “N breeds match” / “1 breed matches”, `id="catalog-status"`, `aria-live="polite"`. |
| `src/components/EmptyResults.tsx` / `ClearFiltersButton.tsx` | Headline **No pals in this mix.** Body from UX.md. Primary **Clear filters**. Keeps `id="breed-grid"`. Focuses `#breed-search` after clear. |
| `public/images/empty-no-results.svg` | Line-drawn cat and dog looking under a rug. `alt=""`. |
| `src/lib/query.ts` | `catalogHref`, `isSafeCatalogHref`, `persistLastCatalog`. |
| `src/app/globals.css` | Accent tokens to locked AA (`#C2410C` / `#FADCD6`). |
| `tests/e2e/catalog.spec.ts` | Cards, search siamese, search GSD, URL hydrates `q`. |
| `tests/e2e/filters.spec.ts` | species=cat, combo hydrates chips, tap-again clears size, `/?species=cat` first HTML cats-only and no hydration error. |
| `tests/e2e/empty.spec.ts` | cat+small → empty → **Clear filters** + focus search. |
| `.github/workflows/ci.yml` | Unit tests + Playwright Chromium job. |
| `playwright.config.ts` | Dedicated port 3001, no reuse of an existing server. |

Did **not** add `src/app/breeds/`, `not-found.tsx`, similar module, or SEO files.

## Locked copy

- H1 **Find yours**
- Empty **No pals in this mix.**
- CTA **Clear filters**
- Search placeholder **Search breeds (try GSD or Siamese)**
- Noscript **Filters need JavaScript. Every breed matching this link is listed below.**

## What PR 7+ must know

- Home already awaits `searchParams` and hydrates from `initialQuery` + full `Breed[]`. Later chips filter in memory.
- `sessionStorage["cdr:lastCatalog"]` is written on each catalog query change iff `isSafeCatalogHref`. Detail **All breeds** should read it after mount; SSR `href="/"`.
- Skip link still targets `#breed-grid` (empty panel keeps the id).
- Chip selected style is accent-soft + ink, never white-on-deco-coral.
- Do not put H1 between header and search on mobile (grid areas keep the sticky stack contiguous).
