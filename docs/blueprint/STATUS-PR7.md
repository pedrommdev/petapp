# STATUS — PR 7 SSG breed detail

| Field | Value |
|---|---|
| **PR** | 7 — Breed detail page (SSG) |
| **Title** | `feat: SSG breed detail — gallery, facts, copy, trait meters` |
| **Date** | 2026-09-06 |
| **Status** | Done |

## How to run

```bash
export PATH="/home/pedro/.local/bin:$PATH"
cd /home/pedro/Documents/catapp
pnpm dev
```

Open http://localhost:3000/breeds/maine-coon. Header **All breeds** (left, `href="/"` until `cdr:lastCatalog` is a safe catalog URL) + wordmark (right, clean `/`). Then gallery, CAT/DOG eyebrow, name, aliases, facts, copy, **How they live**. Unknown slugs hit **This breed ran off.**

Verified from repo root:

- `pnpm lint` — pass
- `pnpm exec tsc --noEmit` — pass
- `pnpm test` — pass (includes TraitMeter accessible name)
- `pnpm build` — pass. SSG emits all 12 seed slugs, including `/breeds/maine-coon` (`●` in the Next route table; HTML at `.next/server/app/breeds/maine-coon.html`)

Did **not** edit `src/app/page.tsx` or catalog filter components. Did **not** mount SimilarBreeds (PR 8). Did **not** add sitemap/OG/JSON-LD (PR 9).

## Files changed

| Path | Role |
|---|---|
| `src/app/breeds/[slug]/page.tsx` | Server Component. `generateStaticParams` for every slug, `dynamicParams = false`, `notFound()` on miss. Section order: header, gallery, species eyebrow, H1, aliases, facts, lead, `\n\n` paragraphs, How they live. No `dangerouslySetInnerHTML`. |
| `src/components/PhotoGallery.tsx` | Server Component. 4:3, `snap-x snap-mandatory`, 2–5 slides, hero `priority`, dots as in-page links (no carousel lib, no lightbox). Credit under each slide, copy per license. |
| `src/components/FactList.tsx` | `<dl>` Origin / Size / Coat / Lifespan (`12–15 years`). 2×2, `md:` 4-across. |
| `src/components/TraitMeter.tsx` | Five 11px circles, 6px gap. Filled accent / empty sand outline. `aria-label="{label}, {n} out of 5"`. Not interactive. |
| `src/components/TraitList.tsx` | Seven meters in canonical order. |
| `src/app/not-found.tsx` | Headline **This breed ran off.** Body “That link doesn’t match a breed in the repo.” CTA **Browse all breeds** → `/`. |
| `src/components/AppHeader.tsx` | Detail variant unchanged for home. All breeds is a client child. |
| `src/components/AllBreedsLink.tsx` | SSR `href="/"`. After mount, `sessionStorage["cdr:lastCatalog"]` only if `isSafeCatalogHref`. |
| `src/types/breed.ts` | Optional `sourceUrl` / `licenseUrl` on photos so credits can link when present. |
| `scripts/validate-catalog.ts` | Same fields optional on the Zod photo object (type equality). |
| `src/app/globals.css` | `:target` / `:has` rules so gallery dots mark the active slide without JS. |
| `tests/unit/trait-meter.test.ts` | Accessible name + five circles. |
| `vitest.config.ts` | `esbuild.jsx = "automatic"` so the TraitMeter unit test can render. |

## Page contract

1. Header: **All breeds** + wordmark.
2. Gallery: native horizontal snap, dots, license caption. Usable with JS off (scroll + per-slide credit).
3. Species eyebrow `CAT` / `DOG` in `text-cat` / `text-dog` (not the card badge).
4. H1 name. Aliases: “Also: …”.
5. Facts `<dl>`.
6. `shortDescription` as a lead; `description` split on `\n\n`.
7. **How they live** — “Typical for the breed — individuals vary.” then seven TraitMeters.

## What PR 8+ must know

- Do not add SimilarBreeds until PR 8. `src/components/SimilarBreeds.tsx` is unused on purpose.
- Detail OG (hero JPEG in `generateMetadata.images`) and JSON-LD `Thing` are PR 9. This PR only sets title `{Name} (Cat\|Dog)` and a 160-char description.
- `AllBreedsLink` reads `cdr:lastCatalog`; PR 6 still has to **write** it via `persistLastCatalog` / `isSafeCatalogHref` on chip changes.
- Photo JSON may omit `sourceUrl` / `licenseUrl` today; captions then render without links (`licensed` → “{credit}. Used under license.”).
