import catalogFile from "../../data/breeds.json";
import type { Breed, CatalogFile } from "@/types/breed";

const catalog = catalogFile as CatalogFile;

function byName(a: Breed, b: Breed): number {
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
}

export function getAllBreeds(): Breed[] {
  return [...catalog.breeds].sort(byName);
}

export function getBreedBySlug(slug: string): Breed | undefined {
  return catalog.breeds.find((breed) => breed.slug === slug);
}

export function getBreedById(id: string): Breed | undefined {
  return catalog.breeds.find((breed) => breed.id === id);
}
