# Cat & Dog Repo — Blueprint pack

Handoff for two people who were **not** in discovery: an **engineering lead** who needs to implement without pinging the PM, and a **UX / product designer** who needs to design screens, IA, components, and content without pinging the PM.

Working name: **Cat & Dog Repo**. Date: 2026-09-06. Status: Draft. Author: Project / Design.

Canonical design: [DESIGN.md](./DESIGN.md) (full system + product spec, Key Decisions, PR Plan). This folder is a **derived** pack. **If they disagree, DESIGN.md wins until a dated revision of both.** After implementation starts, application code plus DESIGN.md still win over stale blueprint prose; update this pack in the same revision.

Workspace: `/home/pedro/Documents/catapp`. App is bootstrapped; catalog is not launched. Follow [PR-PLAN.md](./PR-PLAN.md). This folder is the design pack only — no implementation status logs.

---

## How to read this pack

### If you are the engineering lead

Read in this order:

1. **This README** — locked decisions table, file map.
2. **[PRODUCT.md](./PRODUCT.md)** — what we are building and what we are not.
3. **[ENGINEERING.md](./ENGINEERING.md)** — stack, file tree, schema, algorithms, routing, images, SEO, perf, test, deploy.
4. **[CONTENT-MODEL.md](./CONTENT-MODEL.md)** — JSON shape, trait meanings, filter mapping, similar-breed rules, editorial checklist (you will implement the validator from this).
5. **[PR-PLAN.md](./PR-PLAN.md)** — sequence of mergeable PRs.
6. Skim **[UX.md](./UX.md)** so card anatomy, chips, empty states, and a11y match what you ship. You do not wait on mockups to start PRs 1–4.

Implement from ENGINEERING + CONTENT-MODEL + PR-PLAN. Do not invent a CMS, an API, or auth.

### If you are the UX / product designer

Read in this order:

1. **This README** — locked decisions table, file map.
2. **[PRODUCT.md](./PRODUCT.md)** — job, audience, voice, v1 screens, success.
3. **[UX.md](./UX.md)** — principles, IA, flows, screen specs, chips, cards, traits, visual direction, components, a11y, responsive, copy.
4. **[CONTENT-MODEL.md](./CONTENT-MODEL.md)** — what a breed *is*, what 1 vs 5 means, what “similar” means in the UI.
5. Skim **[ENGINEERING.md](./ENGINEERING.md)** “Routing”, “Image handling”, and “Performance budgets” so designs are buildable (SSG, local photos, mobile LCP).
6. **[PR-PLAN.md](./PR-PLAN.md)** — when visual review happens (PR 2 shell, PR 5 cards, PR 6 filters, PR 7 detail).

You can design all three v1 screens from UX.md without waiting on engineering. Do not add a fourth primary screen. Do not design login, favorites, or photo-identify.

---

## Files in this folder

| File | Role |
|---|---|
| [README.md](./README.md) | Start here. Reading order. Locked decisions. |
| [DESIGN.md](./DESIGN.md) | Full canonical spec (architecture, UX, Key Decisions, PR Plan). |
| [PRODUCT.md](./PRODUCT.md) | Product brief: problem, audience, jobs, scope, glossary. |
| [UX.md](./UX.md) | Designer brief: IA, flows, screens, visual, components, a11y. |
| [ENGINEERING.md](./ENGINEERING.md) | Engineering lead brief: stack, tree, schema, algorithms, deploy. |
| [CONTENT-MODEL.md](./CONTENT-MODEL.md) | Breed schema, traits, filters, similar rules, editorial checklist. |
| [PR-PLAN.md](./PR-PLAN.md) | Ordered, independently mergeable pull requests. |
| [HANDOFF-ENG.md](./HANDOFF-ENG.md) | Thin pointer to PR-PLAN. Not a second plan. |

---

## Locked decisions (short)

Do not reopen these without a product reason. Full rationale lives in PRODUCT / ENGINEERING / UX.

| Topic | Lock |
|---|---|
| Job | Breed encyclopedia only (not adoption, lost & found, pet profiles) |
| “Find yours” | Search + filter. No photo match, no AI identify |
| Catalog | Admin-curated, ~50 breeds (40–60), 25 cat / 25 dog target |
| Audience | Casual browsers and pet owners, anonymous |
| Auth | None in v1 |
| Detail must include | Photos, facts, descriptions, trait scores, similar breeds |
| Success | Public production app on the open web |
| Constraint | Mobile-first, playful (not shelter-serious, not Wikipedia-dry) |
| v1 filters | Species, size, energy, shedding, good with kids, apartment-friendly |
| Search | Breed name + aliases (substring, case/diacritic-insensitive) |
| Data | In-app JSON `data/breeds.json` — not live TheCatAPI / Dog API |
| Photos | Local files in `public/images/breeds/{slug}/`; JSON is the rights ledger (`sourceUrl`, `licenseUrl`) |
| Stack | Next.js App Router + TypeScript, Vercel. Detail SSG; home dynamic `searchParams` + client island |
| Accent | Ink on `#FADCD6` selected chips; white on `#C2410C` CTA (measured AA) |
| Editing | No CMS UI; catalog changes are PRs to JSON + images |
| Routes | `/` catalog, `/breeds/[slug]` detail |
| Filter UI | Chips / pills, not dropdowns |
| Similar | Editorial `similarBreedIds` (same species); trait-distance fallback |
| v1 screens | Home/catalog, breed detail, empty/no-results (on `/`) |
| Out of v1 | Login, favorites, comments, AI, submissions, adoption, messaging, CMS |

---

## v1 sitemap (one glance)

```
/                    catalog: search, chips, cards
/breeds/[slug]       detail
empty results        same `/`, different UI
/404                 unknown path or slug
```

---

## What “done” looks like

A phone user can open the production URL, type an alias or tap chips, land on a breed page with a gallery and trait dots, tap a similar breed, and share that URL. No account. Lighthouse-mobile budgets in ENGINEERING.md hold. Catalog validator is green for 40–60 breeds.
