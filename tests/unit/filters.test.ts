import { describe, expect, it } from "vitest";
import { filterBreeds, matchesFilters, scoreToBand } from "@/lib/filters";
import type { Breed, BreedTraits, TraitScore } from "@/types/breed";
import fixture from "../fixtures/breeds.json";

const breeds = fixture.breeds as unknown as Breed[];

function bySlug(slug: string): Breed {
  const breed = breeds.find((b) => b.slug === slug);
  if (!breed) throw new Error(`missing fixture ${slug}`);
  return breed;
}

function withTraits(breed: Breed, traits: Partial<BreedTraits>): Breed {
  return { ...breed, traits: { ...breed.traits, ...traits } };
}

describe("scoreToBand", () => {
  it.each([
    { score: 1, want: "low" },
    { score: 2, want: "low" },
    { score: 3, want: "medium" },
    { score: 4, want: "high" },
    { score: 5, want: "high" },
  ] satisfies { score: TraitScore; want: "low" | "medium" | "high" }[])(
    "$score → $want",
    ({ score, want }) => {
      expect(scoreToBand(score)).toBe(want);
    },
  );
});

describe("matchesFilters", () => {
  it.each([
    { name: "species dog", slug: "german-shepherd", query: { species: "dog" as const }, want: true },
    { name: "species cat rejects dog", slug: "german-shepherd", query: { species: "cat" as const }, want: false },
    { name: "size small", slug: "french-bulldog", query: { size: "small" as const }, want: true },
    { name: "size small rejects large", slug: "german-shepherd", query: { size: "small" as const }, want: false },
    { name: "size medium", slug: "siamese", query: { size: "medium" as const }, want: true },
    { name: "size large", slug: "maine-coon", query: { size: "large" as const }, want: true },
    { name: "energy high", slug: "german-shepherd", query: { energy: "high" as const }, want: true },
    { name: "energy high rejects medium", slug: "french-bulldog", query: { energy: "high" as const }, want: false },
    { name: "energy low", slug: "ragdoll", query: { energy: "low" as const }, want: true },
    { name: "energy medium", slug: "maine-coon", query: { energy: "medium" as const }, want: true },
    { name: "shedding low", slug: "siamese", query: { shedding: "low" as const }, want: true },
    { name: "shedding low rejects high", slug: "german-shepherd", query: { shedding: "low" as const }, want: false },
    { name: "shedding high", slug: "golden-retriever", query: { shedding: "high" as const }, want: true },
    { name: "kids ≥ 4", slug: "french-bulldog", query: { kids: true }, want: true },
    { name: "apartment ≥ 4", slug: "french-bulldog", query: { apartment: true }, want: true },
    { name: "apartment rejects score 2", slug: "german-shepherd", query: { apartment: true }, want: false },
    { name: "apartment rejects score 3", slug: "maine-coon", query: { apartment: true }, want: false },
  ])("$name", ({ slug, query, want }) => {
    expect(matchesFilters(bySlug(slug), query)).toBe(want);
  });

  it("treats kids as score ≥ 4, not a band", () => {
    const three = withTraits(bySlug("siamese"), { goodWithKids: 3 });
    expect(matchesFilters(three, { kids: true })).toBe(false);
    expect(matchesFilters(withTraits(three, { goodWithKids: 4 }), { kids: true })).toBe(
      true,
    );
  });

  it("ignores kids/apartment when unset", () => {
    expect(matchesFilters(bySlug("german-shepherd"), {})).toBe(true);
  });
});

describe("filterBreeds", () => {
  it.each([
    {
      name: "AND species + size + apartment",
      query: { species: "dog" as const, size: "small" as const, apartment: true },
      want: ["french-bulldog"],
    },
    {
      name: "AND combo with no matches",
      query: { species: "cat" as const, size: "small" as const },
      want: [],
    },
    {
      name: "search alias AND species",
      query: { q: "gsd", species: "dog" as const },
      want: ["german-shepherd"],
    },
    {
      name: "search alias AND wrong species",
      query: { q: "gsd", species: "cat" as const },
      want: [],
    },
    {
      name: "empty query keeps all, sorted by name",
      query: {},
      want: [
        "french-bulldog",
        "german-shepherd",
        "golden-retriever",
        "maine-coon",
        "ragdoll",
        "siamese",
      ],
    },
    {
      name: "shedding low sorted by name",
      query: { shedding: "low" as const },
      want: ["french-bulldog", "siamese"],
    },
    {
      name: "kids chip keeps ≥ 4",
      query: { kids: true },
      want: [
        "french-bulldog",
        "german-shepherd",
        "golden-retriever",
        "maine-coon",
        "ragdoll",
        "siamese",
      ],
    },
  ])("$name", ({ query, want }) => {
    expect(filterBreeds(breeds, query).map((b) => b.slug)).toEqual(want);
  });
});
