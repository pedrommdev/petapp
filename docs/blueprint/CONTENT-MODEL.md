# Content model — Cat & Dog Repo

| Field | Value |
|---|---|
| **Author** | Project / Design |
| **Date** | 2026-09-06 |
| **Status** | Draft |

This is the editorial and data contract. Engineering validates it (`scripts/validate-catalog.ts`). Designers and writers fill it. Product: [PRODUCT.md](./PRODUCT.md). Types: [ENGINEERING.md](./ENGINEERING.md).

Source of truth: `/home/pedro/Documents/catapp/data/breeds.json`. Photos: `/home/pedro/Documents/catapp/public/images/breeds/{slug}/`.

---

## Breed record

Each object in `breeds[]`:

| Field | Type | Rules |
|---|---|---|
| `id` | string | **Must equal** `` `${species}-${slug}` `` e.g. `cat-maine-coon`. Unique. Stable (do not recycle). |
| `slug` | string | ASCII kebab. Unique. Folder name for photos. URL `/breeds/{slug}`. |
| `species` | `cat` \| `dog` | Required. |
| `name` | string | Common display name, Title Case. |
| `origin` | string | Country or region, short (“Thailand”, “United States”). |
| `aliases` | string[] | 0–8. Nicknames/abbreviations people type. Not equal to `name`. Not every typo. |
| `sizeClass` | `small` \| `medium` \| `large` | See size rubric below. |
| `coat` | `short` \| `medium` \| `long` \| `hairless` \| `double` \| `curly` | Primary coat. |
| `lifespanYears` | `{ min, max }` | Integers, `max >= min`, typical range 5–25. |
| `shortDescription` | string | **140–220 characters**, 1–2 sentences. |
| `description` | string | **180–350 words**, paragraphs separated by `\n\n`. No markdown. |
| `traits` | object | Seven scores, each integer **1–5**. |
| `photos` | array | **2–5**. First is hero `01.jpg`. |
| `similarBreedIds` | string[] | **2–4** other `id`s, **same species**, not self. |

Root file:

```json
{
  "version": 1,
  "generatedAt": "2026-09-06T00:00:00.000Z",
  "breeds": []
}
```

Catalog size: **40–60** at launch, target **50** (25/25). Seed era (PR 3): **8–10** breeds, slugs subset of the starter 50, `MIN_BREEDS=8`, `MAX_BREEDS=10`. **PR 11a** sets `MAX_BREEDS=60` and leaves `MIN_BREEDS=8`. **PR 11b** sets `MIN_BREEDS=40`. Do not land JSON without the validator.

### Photo object

| Field | Rules |
|---|---|
| `src` | `/images/breeds/{slug}/0n.jpg` |
| `alt` | Specific to the frame, not just the breed name on every slide |
| `width`, `height` | Intrinsic pixels (required for CLS) |
| `credit` | Photographer or source name |
| `license` | `CC0` \| `CC BY` \| `CC BY-SA` \| `licensed` \| `public-domain` |
| `sourceUrl` | **Required.** Page where the file was obtained. Durable ledger (not a PR description). |
| `licenseUrl` | Required unless `CC0` or `public-domain`. **Required for `licensed`.** |

Hero (`01`) must read at card size: face or full body, uncluttered. Launch is blocked on attribution completeness, not only files on disk.

Caption: CC0/PD → `{credit}. Public domain.` (name links `sourceUrl`). CC BY/SA → `{credit} ({license})` with name → `sourceUrl`, license → `licenseUrl`. `licensed` → `{credit}. Used under license.` with both links.

### Example

This object is **validator-valid** (same bytes as the canonical doc and ENGINEERING.md).

```json
{
  "id": "cat-maine-coon",
  "slug": "maine-coon",
  "species": "cat",
  "name": "Maine Coon",
  "origin": "United States",
  "aliases": ["Coon Cat", "Gentle Giant"],
  "sizeClass": "large",
  "coat": "long",
  "lifespanYears": { "min": 12, "max": 15 },
  "shortDescription": "A big, dog-like cat with tufted ears, a heavy ruff, and a friendly, easygoing manner — often called the gentle giant of the cat world, happiest when trailing you from room to room.",
  "description": "Maine Coons come from New England farm stock: big-boned, water-resistant, and famously social. They are the cats that greet guests at the door, follow a laptop from desk to sofa, and chirp instead of yowl when they want your attention. The look is unmistakable — lynx-tufted ears, a square muzzle, and a ruff that makes even a teenager look like a lion in winter.\n\nLiving with one means planning for hair. They shed, especially in spring, and a weekly session with a steel comb keeps the long coat from matting behind the ears and along the britches. Energy is moderate: they sprint down a hallway, then sprawl across a keyboard for an hour. They are usually patient with respectful kids and often easy with dogs, but they are still cats, not babysitters. A Maine Coon can live in an apartment if you give them height, puzzle play, and a window; they are happier when they can patrol more than one room.\n\nExpect a slow-growing cat that may not finish filling out until year four, and a lifespan commonly quoted in the low-to-mid teens. They are not a hypoallergenic breed. Individuals vary, as with every breed in this repo; the scores below describe a typical adult, not a promise about the animal on your couch.",
  "traits": {
    "energy": 3,
    "shedding": 4,
    "trainability": 4,
    "goodWithKids": 5,
    "goodWithOtherPets": 4,
    "apartmentFriendly": 3,
    "groomingNeed": 4
  },
  "photos": [
    {
      "src": "/images/breeds/maine-coon/01.jpg",
      "alt": "Maine Coon cat sitting, showing ear tufts and ruff",
      "width": 1600,
      "height": 1200,
      "credit": "Wikimedia Commons contributor",
      "license": "CC0",
      "sourceUrl": "https://commons.wikimedia.org/"
    },
    {
      "src": "/images/breeds/maine-coon/02.jpg",
      "alt": "Maine Coon walking in grass, full tail visible",
      "width": 1600,
      "height": 1200,
      "credit": "Wikimedia Commons contributor",
      "license": "CC0",
      "sourceUrl": "https://commons.wikimedia.org/"
    }
  ],
  "similarBreedIds": ["cat-norwegian-forest", "cat-ragdoll", "cat-siberian"]
}
```

---

## Size class rubric

Use **adult typical**, not kittens/puppies, not extreme show outliers.

**Dogs**

| Class | Guide |
|---|---|
| small | Roughly under 25 lb / 11 kg (Chihuahua, Pomeranian, French Bulldog). Beagle = small. |
| medium | Roughly 25–55 lb (Border Collie, Australian Shepherd). |
| large | Roughly 55 lb+ (Labrador, GSD, Husky, Great Dane, Bernese, Standard Poodle). |

**Cats** (most are medium)

| Class | Guide |
|---|---|
| small | Clearly petite (default medium unless obviously small; some Rex). |
| medium | Default for the majority. |
| large | Maine Coon, Norwegian Forest, Siberian, Ragdoll. |

If unsure, **medium**. Size is a filter; don’t invent a fourth class.

---

## Coat

Pick the **primary** living-with-the-coat experience:

- `short` — Siamese, Beagle, Labrador
- `medium` — many mixed-length
- `long` — Persian, Maine Coon, Yorkie
- `hairless` — Sphynx
- `double` — Husky, German Shepherd, Pomeranian
- `curly` — Poodle, some Rex

One value only.

---

## Trait definitions (what 1 vs 5 means)

Scores are **editorial typical-breed tendencies**, not a guarantee about an individual, not a veterinary assessment. When scoring, ask: “What should an honest catalog tell a casual owner?” Bias toward the **median well-bred pet**, not the working-trial extreme or the couch-potato outlier.

Use the **full 1–5 scale**. If everything is a 3, filters die.

### Energy

| Score | Meaning |
|---|---|
| 1 | Sedentary. Short indoor play; unhappy if forced into long activity. |
| 2 | Low. Daily light play or a short outing is enough. |
| 3 | Moderate. Enjoys a solid play session or a daily walk; also naps. |
| 4 | High. Needs substantial daily exercise; bored without it. |
| 5 | Very high. Bred for work/sport; needs a job, long run, or equivalent. |

**Filter bands:** Low = 1–2, Medium = 3, High = 4–5.

### Shedding

| Score | Meaning |
|---|---|
| 1 | Minimal. Wipe-down; you forget they shed. |
| 2 | Low. Occasional hair; weekly vacuum is plenty. |
| 3 | Noticeable / seasonal. You will lint-roll. |
| 4 | Heavy. Hair on clothes and furniture most weeks. |
| 5 | Extreme / year-round blow. Plan around it (Husky, German Shepherd, Persian). |

**Filter bands:** Low = 1–2, Medium = 3, High = 4–5.

Hairless ≠ automatically 1 if skin care is intense — **shedding** is hair; put skin work in **grooming need**.

### Trainability

| Score | Meaning |
|---|---|
| 1 | Independent / aloof to cues. Not “stupid” — not eager to perform. |
| 2 | Slow or selective. |
| 3 | Average, usually food-motivated. |
| 4 | Eager, learns quickly with normal practice. |
| 5 | Highly biddable (Border Collie, Poodle, many herding/retrieving dogs). |

**Not a v1 filter.** Shown on detail only.

### Good with kids

| Score | Meaning |
|---|---|
| 1 | Poor fit for young children; easily overstimulated or fragile. |
| 2 | Better with older, careful kids only. |
| 3 | OK with respectful kids and supervision. |
| 4 | Typically patient; a common family choice. |
| 5 | Famous for it; still not a babysitter. |

**Filter:** chip “Good with kids” keeps scores **≥ 4**.

Never imply a breed makes children safe around animals unsupervised.

### Good with other pets

| Score | Meaning |
|---|---|
| 1 | Typically unhappy sharing the home (high prey drive / same-sex intolerance as the *typical* story). |
| 2 | Needs very careful, experienced intros. |
| 3 | Can coexist with a slow introduction. |
| 4 | Usually fine with other cats/dogs. |
| 5 | Typically easy in multi-pet homes. |

**Not a v1 filter.** Individuals vary more here than anywhere — stay conservative (don’t hand out 5s lightly).

### Apartment-friendly

| Score | Meaning |
|---|---|
| 1 | Needs space, yard, or is a voice/size problem in close quarters. |
| 2 | Possible but a stretch. |
| 3 | Manageable with dedicated exercise and neighbors in mind. |
| 4 | Fits apartments if needs are met. |
| 5 | Thrives in small spaces (size + energy + vocality considered). |

**Filter:** chip “Apartment OK” keeps scores **≥ 4**.

A calm giant can still score low (space, hallways). A small yappy dog can score low (noise). This is **not** “small = 5”.

### Grooming need

| Score | Meaning |
|---|---|
| 1 | Wipe / rare brush. |
| 2 | Occasional brush. |
| 3 | Weekly coat work. |
| 4 | Several times a week, or regular professional help. |
| 5 | Daily coat or skin work (Persian, Poodle clips, Sphynx baths). |

**Not a v1 filter.** Shown on detail only.

Canonical on-page order: energy, shedding, trainability, good with kids, good with other pets, apartment-friendly, grooming need.

---

## Filter mapping (catalog chips → fields)

| Chip group | Query | Predicate |
|---|---|---|
| Species | `species=cat\|dog` | `breed.species ===` |
| Size | `size=small\|medium\|large` | `breed.sizeClass ===` |
| Energy | `energy=low\|medium\|high` | `scoreToBand(traits.energy) ===` |
| Shedding | `shedding=low\|medium\|high` | `scoreToBand(traits.shedding) ===` |
| Good with kids | `kids=1` | `traits.goodWithKids >= 4` |
| Apartment OK | `apartment=1` | `traits.apartmentFriendly >= 4` |

Search `q` is independent and ANDed: normalized substring of `name` or any `alias`.

**Not filters in v1:** trainability, other pets, grooming, coat, origin, lifespan. They remain visible on the detail page.

AND across groups. Within size / energy / shedding, at most one chip.

---

## Similar-breed rules

**Product meaning:** “If you like this” = same species, close in **lifestyle and looks**, not a ranking, not personalized.

**Editorial rules**

1. 2–4 ids, prefer **3**.
2. Same species only. Never a cat next to a dog.
3. Not self.
4. Prefer a mix that is recognizable: one “looks related” (Maine Coon → Norwegian Forest) and one “lives similarly” (energy/size), if possible.
5. Do not only link mega-popular breeds to each other (avoid a Labrador↔Golden-only clique). Cross-link at least one less obvious cousin when honest.
6. Symmetry is **nice** (if A lists B, B lists A) but not required. CI **warns**, does not fail.
7. Order is display order; put the closest cousin first.

**Engineering fallback** (if a record is under-linked): Manhattan distance on the seven trait scores, same species, then name. Fill to 3. Editors should not rely on this — fill the field.

**UX copy:** heading “If you like this”; sub “Close in lifestyle and looks, not a ranking.” Do not say “recommended for you.”

---

## Card tags (derived, not stored)

Do not add a `tags` array to JSON. UI derives two labels:

1. Size class display name (Small / Medium / Large).
2. First match: apartment ≥ 4 → “Apartment OK”; else kids ≥ 4 → “Good with kids”; else shedding ≤ 2 → “Low shed”; else energy ≥ 4 → “High energy”; else coat label.

---

## Copy rules

| Field | Length | Notes |
|---|---|---|
| `shortDescription` | 140–220 chars | Party one-liner. No laundry list of traits. |
| `description` | 180–350 words | Three short paragraphs: personality/hook; living with them; origin/notable fact. |
| Aliases | 0–8 × ≤40 chars | GSD, Coon Cat, Alsatian — things people type. |

- Third person. Concrete. Wit at most once. Never mean.
- Forbidden: hypoallergenic guarantees, prices, breeder URLs, markdown, emoji, “best first pet” as a fact, aggression as destiny.
- One honest health sentence is allowed (brachycephaly, folded ears, etc.). Not a monograph.
- Popular controversial breeds **stay in** the v1 list unless photo rights fail.

Voice examples:

- Good short (180 characters, validator-valid): “A big, dog-like cat with tufted ears, a heavy ruff, and a friendly, easygoing manner — often called the gentle giant of the cat world, happiest when trailing you from room to room.”
- Bad short: “The Maine Coon is a large cat that is good with kids, sheds a lot, and has a medium energy level and long hair.”

---

## Starter list (50)

**Cats (25):** Abyssinian, American Shorthair, Bengal, Birman, British Shorthair, Burmese, Chartreux, Cornish Rex, Devon Rex, Egyptian Mau, Exotic Shorthair, Himalayan, Maine Coon, Manx, Norwegian Forest Cat, Oriental Shorthair, Persian, Ragdoll, Russian Blue, Scottish Fold, Siamese, Siberian, Sphynx, Tonkinese, Turkish Angora.

**Dogs (25):** Australian Shepherd, Beagle, Bernese Mountain Dog, Border Collie, Boston Terrier, Boxer, Bulldog, Cavalier King Charles Spaniel, Chihuahua, Dachshund, French Bulldog, German Shepherd, German Shorthaired Pointer, Golden Retriever, Great Dane, Labrador Retriever, Pembroke Welsh Corgi, Pomeranian, Poodle (one record: Standard; mention varieties in copy), Pug, Rottweiler, Shiba Inu, Shih Tzu, Siberian Husky, Yorkshire Terrier.

Substitutions of similar popularity are OK if rights fail. Keep ≥40 and both species represented (≥15 each at launch).

Suggested aliases (non-exhaustive): German Shepherd → GSD, Alsatian; Pembroke Welsh Corgi → Corgi, Pembroke; Labrador Retriever → Lab; Siamese → Meezer; Maine Coon → Coon Cat; French Bulldog → Frenchie; Siberian Husky → Husky.

---

## Editorial checklist — adding a breed

Ship as one PR: JSON object + `public/images/breeds/{slug}/` files.

- [ ] `id` = `{species}-{slug}`, unique, not recycled.
- [ ] `slug` kebab, unique, matches folder, no collision with existing URLs.
- [ ] `name`, `origin`, `coat`, `sizeClass` using the rubrics above.
- [ ] Aliases people will actually type; none duplicate `name`.
- [ ] `shortDescription` 140–220 characters.
- [ ] `description` 180–350 words, `\n\n` paragraphs, no markdown.
- [ ] All seven traits scored 1–5 with the tables above (not all 3s).
- [ ] Lifespan typical range, `max >= min`.
- [ ] 2–5 JPEGs, `01` is hero, ≤1600px long edge, compressed, 4:3-ish, no watermark.
- [ ] Each photo: alt, width, height, credit, license, **sourceUrl**, and **licenseUrl** unless CC0/public-domain (`licensed` requires both URLs).
- [ ] `similarBreedIds`: 2–4 existing same-species ids; consider updating those breeds to point back.
- [ ] `pnpm validate` passes.
- [ ] Spot-check: card tags look right; detail reads aloud without medical overclaim.
- [ ] If replacing a breed, grep other `similarBreedIds` for the old `id`.

Removing a breed: delete JSON object + image folder; repair every similar link; add a redirect in `next.config.ts` only if the slug was already public.
