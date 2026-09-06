import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import type { CatalogFile } from "../src/types/breed";

/** Seed era minimum. PR 11 raises this to 40. */
export const MIN_BREEDS = 8;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = path.join(ROOT, "data", "breeds.json");
const PUBLIC_DIR = path.join(ROOT, "public");

const ID_PATTERN = /^(cat|dog)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const speciesSchema = z.enum(["cat", "dog"]);
const sizeClassSchema = z.enum(["small", "medium", "large"]);
const coatTypeSchema = z.enum([
  "short",
  "medium",
  "long",
  "hairless",
  "double",
  "curly",
]);
const traitScoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
const licenseSchema = z.enum([
  "CC0",
  "CC BY",
  "CC BY-SA",
  "licensed",
  "public-domain",
]);

const breedTraitsSchema = z.object({
  energy: traitScoreSchema,
  shedding: traitScoreSchema,
  trainability: traitScoreSchema,
  goodWithKids: traitScoreSchema,
  goodWithOtherPets: traitScoreSchema,
  apartmentFriendly: traitScoreSchema,
  groomingNeed: traitScoreSchema,
});

const breedPhotoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.int().positive(),
  height: z.int().positive(),
  credit: z.string().min(1),
  license: licenseSchema,
});

const lifespanRangeSchema = z
  .object({
    min: z.int().positive(),
    max: z.int().positive(),
  })
  .refine((range) => range.max >= range.min, {
    message: "lifespanYears.max must be >= min",
    path: ["max"],
  });

function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const breedSchema = z
  .object({
    id: z.string().regex(ID_PATTERN, "id must match ^(cat|dog)-[a-z0-9]+(?:-[a-z0-9]+)*$"),
    slug: z.string().regex(SLUG_PATTERN, "slug must be kebab-case"),
    species: speciesSchema,
    name: z.string().min(1),
    origin: z.string().min(1),
    aliases: z.array(z.string().min(1).max(40)).max(8),
    sizeClass: sizeClassSchema,
    coat: coatTypeSchema,
    lifespanYears: lifespanRangeSchema,
    shortDescription: z
      .string()
      .min(140, "shortDescription must be 140–220 characters")
      .max(220, "shortDescription must be 140–220 characters"),
    description: z.string().min(1),
    traits: breedTraitsSchema,
    photos: z.array(breedPhotoSchema).min(2).max(5),
    similarBreedIds: z.array(z.string().regex(ID_PATTERN)).min(2).max(4),
  })
  .superRefine((breed, ctx) => {
    if (breed.id !== `${breed.species}-${breed.slug}`) {
      ctx.addIssue({
        code: "custom",
        path: ["id"],
        message: `id must be {species}-{slug} (${breed.species}-${breed.slug})`,
      });
    }

    for (const [index, alias] of breed.aliases.entries()) {
      if (alias.localeCompare(breed.name, "en", { sensitivity: "base" }) === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["aliases", index],
          message: "alias must not equal name",
        });
      }
    }

    const words = wordCount(breed.description);
    if (words < 180 || words > 350) {
      ctx.addIssue({
        code: "custom",
        path: ["description"],
        message: `description must be 180–350 words (got ${words})`,
      });
    }

    const heroSrc = `/images/breeds/${breed.slug}/01.jpg`;
    if (breed.photos[0]?.src !== heroSrc) {
      ctx.addIssue({
        code: "custom",
        path: ["photos", 0, "src"],
        message: `first photo must be ${heroSrc}`,
      });
    }

    const seenSrc = new Set<string>();
    const srcPattern = new RegExp(
      `^/images/breeds/${breed.slug}/0[1-5]\\.jpg$`,
    );
    for (const [index, photo] of breed.photos.entries()) {
      if (!srcPattern.test(photo.src)) {
        ctx.addIssue({
          code: "custom",
          path: ["photos", index, "src"],
          message: `src must be /images/breeds/${breed.slug}/0n.jpg (01–05)`,
        });
      }
      if (seenSrc.has(photo.src)) {
        ctx.addIssue({
          code: "custom",
          path: ["photos", index, "src"],
          message: `duplicate photo src ${photo.src}`,
        });
      }
      seenSrc.add(photo.src);
    }

    const seenSimilar = new Set<string>();
    for (const [index, otherId] of breed.similarBreedIds.entries()) {
      if (otherId === breed.id) {
        ctx.addIssue({
          code: "custom",
          path: ["similarBreedIds", index],
          message: "similarBreedIds must not include self",
        });
      }
      if (seenSimilar.has(otherId)) {
        ctx.addIssue({
          code: "custom",
          path: ["similarBreedIds", index],
          message: `duplicate similarBreedId ${otherId}`,
        });
      }
      seenSimilar.add(otherId);
    }
  });

export const catalogFileSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "generatedAt must be an ISO date",
  }),
  breeds: z
    .array(breedSchema)
    .min(MIN_BREEDS, `catalog must have at least ${MIN_BREEDS} breeds`),
});

type InferredCatalog = z.infer<typeof catalogFileSchema>;
type AssertEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
const _catalogMatchesTypes: AssertEqual<InferredCatalog, CatalogFile> = true;
void _catalogMatchesTypes;

function formatIssue(issue: z.core.$ZodIssue): string {
  const where = issue.path.length > 0 ? issue.path.join(".") : "(root)";
  return `${where}: ${issue.message}`;
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dups.add(value);
    else seen.add(value);
  }
  return [...dups];
}

function publicFileForSrc(src: string): string {
  return path.join(PUBLIC_DIR, src.replace(/^\//, ""));
}

function crossValidate(catalog: CatalogFile): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { breeds } = catalog;
  const byId = new Map(breeds.map((breed) => [breed.id, breed]));

  for (const id of duplicates(breeds.map((breed) => breed.id))) {
    errors.push(`duplicate id: ${id}`);
  }
  for (const slug of duplicates(breeds.map((breed) => breed.slug))) {
    errors.push(`duplicate slug: ${slug}`);
  }

  for (const breed of breeds) {
    let validSimilar = 0;
    for (const otherId of breed.similarBreedIds) {
      const other = byId.get(otherId);
      if (!other) {
        errors.push(`${breed.id}: similarBreedIds unknown id ${otherId}`);
        continue;
      }
      if (other.species !== breed.species) {
        errors.push(
          `${breed.id}: similarBreedIds ${otherId} is ${other.species}, expected ${breed.species}`,
        );
        continue;
      }
      if (other.id !== breed.id) validSimilar += 1;
    }
    if (validSimilar === 0) {
      errors.push(`${breed.id}: no valid similarBreedIds`);
    }

    for (const photo of breed.photos) {
      const filePath = publicFileForSrc(photo.src);
      if (!existsSync(filePath)) {
        errors.push(`${breed.id}: photo missing on disk ${photo.src}`);
      }
    }
  }

  for (const breed of breeds) {
    for (const otherId of breed.similarBreedIds) {
      const other = byId.get(otherId);
      if (!other) continue;
      if (!other.similarBreedIds.includes(breed.id)) {
        warnings.push(
          `${breed.id} lists ${otherId} but ${otherId} does not list ${breed.id}`,
        );
      }
    }
  }

  return { errors, warnings };
}

function main(): void {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to read ${path.relative(ROOT, CATALOG_PATH)}: ${message}`);
    process.exit(1);
  }

  const parsed = catalogFileSchema.safeParse(raw);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(formatIssue(issue));
    }
  } else {
    const extra = crossValidate(parsed.data);
    errors.push(...extra.errors);
    warnings.push(...extra.warnings);
  }

  for (const warning of warnings) {
    console.log(`warn: ${warning}`);
  }

  if (errors.length > 0) {
    console.error(`Catalog invalid (${errors.length} error${errors.length === 1 ? "" : "s"}):`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  const catalog = parsed.data;
  if (!catalog) {
    process.exit(1);
  }

  const cats = catalog.breeds.filter((breed) => breed.species === "cat").length;
  const dogs = catalog.breeds.filter((breed) => breed.species === "dog").length;
  console.log(
    `Catalog OK: ${catalog.breeds.length} breeds (${cats} cat, ${dogs} dog)`,
  );
}

main();
