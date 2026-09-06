import { describe, expect, it } from "vitest";
import { matchesQuery, normalize } from "@/lib/search";
import type { Breed } from "@/types/breed";
import fixture from "../fixtures/breeds.json";

const breeds = fixture.breeds as unknown as Breed[];

function bySlug(slug: string): Breed {
  const breed = breeds.find((b) => b.slug === slug);
  if (!breed) throw new Error(`missing fixture ${slug}`);
  return breed;
}

describe("normalize", () => {
  it.each([
    { name: "NFD diacritics", input: "CAFÉ", want: "cafe" },
    { name: "lowercase", input: "GSD", want: "gsd" },
    { name: "trim and collapse space", input: "  Maine   Coon  ", want: "maine coon" },
    { name: "marks on Siamese", input: "Siamèsé", want: "siamese" },
    { name: "whitespace only", input: "   ", want: "" },
  ])("$name", ({ input, want }) => {
    expect(normalize(input)).toBe(want);
  });
});

describe("matchesQuery", () => {
  it.each([
    { name: "alias GSD", slug: "german-shepherd", q: "GSD", want: true },
    { name: "alias gsd lowercase", slug: "german-shepherd", q: "gsd", want: true },
    { name: "name case-insensitive", slug: "german-shepherd", q: "german shepherd", want: true },
    { name: "alias Alsatian uppercase", slug: "german-shepherd", q: "ALSATIAN", want: true },
    { name: "alias Meezer", slug: "siamese", q: "meezer", want: true },
    { name: "alias Coon Cat", slug: "maine-coon", q: "coon cat", want: true },
    { name: "name substring", slug: "siamese", q: "iam", want: true },
    { name: "empty query", slug: "german-shepherd", q: "", want: true },
    { name: "whitespace query", slug: "maine-coon", q: "   ", want: true },
    { name: "non-match", slug: "german-shepherd", q: "Siamese", want: false },
    { name: "description is not searched", slug: "golden-retriever", q: "gundog", want: false },
  ])("$name", ({ slug, q, want }) => {
    expect(matchesQuery(bySlug(slug), q)).toBe(want);
  });

  it.each([
    { name: "diacritic query vs plain alias", q: "café", want: true },
    { name: "plain query vs diacritic alias", q: "cafe", want: true },
    { name: "uppercase diacritics", q: "CAFÉ", want: true },
  ])("$name", ({ q, want }) => {
    const breed = { ...bySlug("maine-coon"), aliases: ["Café Cat"] };
    expect(matchesQuery(breed, q)).toBe(want);
  });

  it("matches every breed on an empty query", () => {
    expect(breeds.every((b) => matchesQuery(b, ""))).toBe(true);
  });
});
