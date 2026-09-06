import type { Breed } from "@/types/breed";

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function matchesQuery(breed: Breed, q: string): boolean {
  const nq = normalize(q);
  if (!nq) return true;
  return [breed.name, ...breed.aliases].some((h) =>
    normalize(h).includes(nq),
  );
}
