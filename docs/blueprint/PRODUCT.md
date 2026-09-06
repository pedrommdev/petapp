# Product brief — Cat & Dog Repo

| Field | Value |
|---|---|
| **Author** | Project / Design |
| **Date** | 2026-09-06 |
| **Status** | Draft |
| **Working name** | Cat & Dog Repo (placeholder) |

This is the product contract for v1. Engineering and design execute this, they do not re-litigate it.

---

## Problem

Someone who is curious about a cat or dog breed — because they saw one, live with one, or might get one — has no fast, friendly, **comparable** place to look.

- Wikipedia is uneven, dry, and not built for “how much do they shed in an apartment?”
- Shelter and rescue sites are doing a different job (place an animal, often urgently).
- Social posts are anecdotal and not comparable across breeds.
- Live pet APIs are incomplete as an encyclopedia (photos rotate, traits don’t match).

The job is **understanding breeds**, not finding a specific homeless animal, not diagnosing a photo, not building a pet social graph.

---

## Audience

Two anonymous groups, both on phones first:

1. **Casual browsers** — arrived from a link or search, high photo sensitivity, will bounce if the first screen is a wall of text or a login gate.
2. **Pet owners / prospective owners** — comparing a handful of breeds on lifestyle fit (energy, shedding, kids, apartment).

Not in v1: breeders, vets, shelter staff, logged-in “members.”

No onboarding. No account. No personalization beyond what they type and tap **right now**.

---

## Job to be done

> When I am curious about cat or dog breeds, I want to search and filter a trustworthy, photo-rich catalog and open a clear breed page so I can understand what that breed is like to live with.

“Find yours” in v1 means **search + filters**, not a quiz and not a camera.

Success moment: “I get this breed, and I can send the page to someone.”

---

## Locked decisions

| Decision | Lock | Why |
|---|---|---|
| Job | Encyclopedia only | Adjacent jobs change legal posture and IA |
| Find yours | Search and filter only | Photo/AI is a different product |
| Catalog | Fixed, admin-curated | Quality, photo rights, comparable traits |
| Size | **50** target (25 cat / 25 dog), allowed **40–60** | Feels complete; still client-side-searchable; reviewable |
| Filters | Species, size, energy, shedding, good with kids, apartment-friendly | Maps to the household-fit question |
| Search | Name + aliases | “GSD”, “Siamese”, “Coon Cat” |
| Data | JSON in git | Reviewable source of truth; no API rot |
| Photos | Files in-repo | Stable, licensable, optimizable |
| Stack | Next.js + TS, Vercel; detail SSG, home dynamic | Image optimizer + shareable filter URLs without hydration mismatch |
| Auth | None | Job doesn’t need identity |
| CMS | None; edit by PR | 50 rows |
| Voice | Playful, not shelter-serious, not Wikipedia-dry | Discovery constraint |
| Language | English only | Scope |
| Theme | Light only | Scope; tokens may still be CSS variables |

---

## v1 scope

### Screens (only these)

1. **Home / catalog** — search, filters, breed cards (photo, name, species, two tags).
2. **Breed detail** — gallery, facts, short + long description, trait scores, similar breeds.
3. **Empty / no results** — playful, primary action **Clear filters**. (Same URL as home.)

System: a playful **404** for unknown paths/slugs. Footer disclaimer. That’s it.

### A breed record includes

- Species: `cat` \| `dog`
- Name, origin, aliases
- Size class, coat, lifespan
- Short description + longer description
- Trait scores 1–5: energy, shedding, trainability, good with kids, good with other pets, apartment-friendly, grooming need
- Photos (2–5)
- Similar breed ids (2–4, same species)

### Success criteria

- Public production URL, indexable, no login wall.
- A mid-range phone can search, filter, open detail, follow similar, share the URL.
- Catalog has 40–60 curated breeds with licensed photos.
- Detail pages contain every locked content block (photos, facts, copy, traits, similar).
- Empty filter state is never a blank grid.
- Engineering budgets in [ENGINEERING.md](./ENGINEERING.md) (LCP, CLS, JS) hold on mobile.
- Footer states this is not veterinary advice, plus “Anonymous usage via Vercel Analytics.” No `/privacy` page in v1.
- Home meta description (locked): `Find yours among cat and dog breeds. Search by name, filter for shedding, energy, kids, and apartments, and open a photo-rich breed page.`

### Non-goals (out of v1)

Login, accounts, favorites, comments, ratings, messaging, user submissions, photo match, AI identify, lost & found, adoption listings, shelter/breeder directories, pet profiles, admin CMS, quizzes / “best breed for you” engine, i18n, dark-mode toggle, native apps, PWA install prompts, maps, medical diagnosis, video.

PRs that add those are out of scope, not “nice stretch.”

---

## Voice and content posture

- Warm, slightly witty, never mean about a breed.
- Home can be second person (“Find yours”). Breed pages are third person.
- Trait scores are **typical breed tendencies**, not a promise about an individual animal.
- No “best family dog” ranking. No hypoallergenic guarantee. No prices. No breeder CTAs.
- One factual health sentence in a long description is allowed; a veterinary monograph is not.

Copy length and tone details: [UX.md](./UX.md) (guidelines) and [CONTENT-MODEL.md](./CONTENT-MODEL.md) (checklist).

---

## Starter catalog (editorial target)

**25 cats:** Abyssinian, American Shorthair, Bengal, Birman, British Shorthair, Burmese, Chartreux, Cornish Rex, Devon Rex, Egyptian Mau, Exotic Shorthair, Himalayan, Maine Coon, Manx, Norwegian Forest Cat, Oriental Shorthair, Persian, Ragdoll, Russian Blue, Scottish Fold, Siamese, Siberian, Sphynx, Tonkinese, Turkish Angora.

**25 dogs:** Australian Shepherd, Beagle, Bernese Mountain Dog, Border Collie, Boston Terrier, Boxer, Bulldog, Cavalier King Charles Spaniel, Chihuahua, Dachshund, French Bulldog, German Shepherd, German Shorthaired Pointer, Golden Retriever, Great Dane, Labrador Retriever, Pembroke Welsh Corgi, Pomeranian, Poodle (Standard — one card; varieties in copy), Pug, Rottweiler, Shiba Inu, Shih Tzu, Siberian Husky, Yorkshire Terrier.

Substitutions of similar popularity are allowed if photo rights fail. Launch is blocked below 40 breeds. Prefer 25/25.

Popular brachycephalic / folded-ear breeds **stay in** the list; copy may include one honest health sentence. A welfare-exclusion policy is a later editorial decision.

---

## Glossary

| Term | Meaning |
|---|---|
| **Breed** | One catalog record (a named cat or dog breed / standardized variety). |
| **Species** | `cat` or `dog`. |
| **Alias** | Alternate name or abbreviation stored for search (e.g. GSD). |
| **Trait score** | Integer 1–5 editorial rating of a typical tendency. |
| **Band** | Low (1–2), Medium (3), High (4–5) — used by energy and shedding filters. |
| **Chip / pill** | Visible filter control on the catalog. |
| **Card tags** | Two short labels on a catalog card (size + one useful surprise). Not extra filters. |
| **Similar** | Editorially chosen same-species breeds a visitor might also look at. Not “recommended for you.” |
| **Catalog** | The committed JSON + images. Source of truth. |
| **Find yours** | Search + filter UX on home. Not a camera, not a quiz. |
| **SSG** | Static site generation at build time. |

---

## Open product questions (do not block v1)

- Final brand name / domain — ship as Cat & Dog Repo until a rename.
- Production domain — set at deploy via `NEXT_PUBLIC_SITE_URL`.

Everything else in this brief is locked.
