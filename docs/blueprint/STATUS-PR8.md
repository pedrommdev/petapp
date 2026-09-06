# STATUS — PR 8 similar breeds on detail

| Field | Value |
|---|---|
| **PR** | 8 — Similar breeds module |
| **Title** | `feat: similar breeds on detail pages` |
| **Date** | 2026-09-06 |
| **Status** | Done |

## How to run

```bash
export PATH="/home/pedro/.local/bin:$PATH"
cd /home/pedro/Documents/catapp
pnpm dev
```

Open http://localhost:3000/breeds/maine-coon. After **How they live**, section **If you like this** with sub “Close in lifestyle and looks, not a ranking.” 2–4 compact `BreedCard`s (editorial `similarBreedIds` via `resolveSimilar`). Tap a card to navigate to that slug. Copy never says “Recommended for you”.

Verified from repo root:

- `pnpm lint` — pass
- `pnpm exec tsc --noEmit` — pass
- `pnpm test` — pass (94 unit tests, including existing `resolveSimilar` editorial + fallback)
- `pnpm build` — pass. SSG still emits every slug. `/breeds/[slug]` first-load JS **128 kB**.
- `pnpm exec playwright test tests/e2e/detail.spec.ts` — pass. Open Maine Coon, click similar, land on another `/breeds/{slug}`. Playwright Chromium already installed; e2e uses port **3001** (`reuseExistingServer: false`).

Full `pnpm test:e2e` (11 tests): **9 passed**, 2 pre-existing failures in `tests/e2e/empty.spec.ts` (`species=cat&size=small` is no longer empty because the catalog already has 50 breeds). Not caused by this PR. Did **not** expand the catalog. Did **not** add sitemap/OG/JSON-LD (PR 9).

## Files changed

| Path | Role |
|---|---|
| `src/components/SimilarBreeds.tsx` | Section **If you like this**. Compact `BreedCard`s, 2–4. Horizontal `snap-x snap-mandatory` on mobile (70% cards); `md:grid-cols-3`. Named region. Hide if empty. |
| `src/app/breeds/[slug]/page.tsx` | After **How they live**, `resolveSimilar(breed, getAllBreeds())` into `<SimilarBreeds />`. |
| `tests/e2e/detail.spec.ts` | Open `/breeds/maine-coon`, assert similar copy, 2–4 cards, click first card, land on a different slug. |
| `docs/blueprint/STATUS-PR8.md` | This file. |

`src/lib/similar.ts` unchanged (PR 4). `BreedCard` compact sizes already cover similar cards.

## Page contract (added)

9. **If you like this** — “Close in lifestyle and looks, not a ranking.” Same-species editorial order; Manhattan fallback only if under-linked. 2–4 compact cards. Tap is full navigation, not a modal.

## What PR 9+ must know

- Detail page now mounts SimilarBreeds. Do not restyle as “Recommended for you” / “People also viewed”.
- Detail OG (hero JPEG in `generateMetadata.images`) and JSON-LD `Thing` are still PR 9. Title remains `{Name} (Cat|Dog)`.
- Empty-state e2e (`cat` + `small`) needs a combo that actually yields 0 matches now that 50 breeds are in `data/breeds.json`. Out of scope here.
