import type { Breed, SizeClass, Species, TraitScore } from "@/types/breed";
import { matchesQuery } from "@/lib/search";

export type EnergyBand = "low" | "medium" | "high";

export type CatalogQuery = {
  q?: string;
  species?: Species;
  size?: SizeClass;
  energy?: EnergyBand;
  shedding?: EnergyBand;
  kids?: boolean;
  apartment?: boolean;
};

export function scoreToBand(score: TraitScore): EnergyBand {
  if (score <= 2) return "low";
  if (score === 3) return "medium";
  return "high";
}

export function matchesFilters(breed: Breed, query: CatalogQuery): boolean {
  if (query.species && breed.species !== query.species) return false;
  if (query.size && breed.sizeClass !== query.size) return false;
  if (query.energy && scoreToBand(breed.traits.energy) !== query.energy)
    return false;
  if (query.shedding && scoreToBand(breed.traits.shedding) !== query.shedding)
    return false;
  if (query.kids && breed.traits.goodWithKids < 4) return false;
  if (query.apartment && breed.traits.apartmentFriendly < 4) return false;
  return true;
}

export function filterBreeds(breeds: Breed[], query: CatalogQuery): Breed[] {
  return breeds
    .filter((b) => matchesQuery(b, query.q ?? "") && matchesFilters(b, query))
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

export function isCatalogQueryDirty(query: CatalogQuery): boolean {
  return Boolean(
    query.q ||
      query.species ||
      query.size ||
      query.energy ||
      query.shedding ||
      query.kids ||
      query.apartment,
  );
}
