import type { Breed, BreedTraits } from "@/types/breed";

const TRAIT_KEYS: (keyof BreedTraits)[] = [
  "energy",
  "shedding",
  "trainability",
  "goodWithKids",
  "goodWithOtherPets",
  "apartmentFriendly",
  "groomingNeed",
];

function manhattan(a: Breed, b: Breed): number {
  return TRAIT_KEYS.reduce(
    (sum, key) => sum + Math.abs(a.traits[key] - b.traits[key]),
    0,
  );
}

export function resolveSimilar(breed: Breed, all: Breed[]): Breed[] {
  const byId = new Map(all.map((b) => [b.id, b]));
  const editorial: Breed[] = [];

  for (const id of breed.similarBreedIds) {
    const other = byId.get(id);
    if (!other) continue;
    if (other.id === breed.id) continue;
    if (other.species !== breed.species) continue;
    if (editorial.some((b) => b.id === other.id)) continue;
    editorial.push(other);
    if (editorial.length === 4) return editorial;
  }

  if (editorial.length >= 2) return editorial;

  const have = new Set(editorial.map((b) => b.id));
  const fallback = all
    .filter(
      (b) =>
        b.species === breed.species && b.id !== breed.id && !have.has(b.id),
    )
    .sort((a, b) => {
      const d = manhattan(breed, a) - manhattan(breed, b);
      if (d !== 0) return d;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });

  for (const other of fallback) {
    editorial.push(other);
    if (editorial.length >= 3) break;
  }

  return editorial;
}
