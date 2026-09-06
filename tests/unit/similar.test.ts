import { describe, expect, it } from "vitest";
import { resolveSimilar } from "@/lib/similar";
import type { Breed } from "@/types/breed";
import fixture from "../fixtures/breeds.json";

const breeds = fixture.breeds as unknown as Breed[];

function bySlug(slug: string): Breed {
  const breed = breeds.find((b) => b.slug === slug);
  if (!breed) throw new Error(`missing fixture ${slug}`);
  return breed;
}

describe("resolveSimilar", () => {
  it.each([
    {
      slug: "german-shepherd",
      want: ["dog-golden-retriever", "dog-french-bulldog"],
    },
    {
      slug: "maine-coon",
      want: ["cat-ragdoll", "cat-siamese"],
    },
    {
      slug: "siamese",
      want: ["cat-maine-coon", "cat-ragdoll"],
    },
  ])("keeps editorial order for $slug", ({ slug, want }) => {
    expect(resolveSimilar(bySlug(slug), breeds).map((b) => b.id)).toEqual(want);
  });

  it("drops missing, self, and other-species ids before counting editorial", () => {
    const gsd = bySlug("german-shepherd");
    const isolated: Breed = {
      ...gsd,
      similarBreedIds: ["missing", gsd.id, "cat-siamese", "dog-golden-retriever"],
    };
    expect(resolveSimilar(isolated, breeds).map((b) => b.id)).toEqual([
      "dog-golden-retriever",
      "dog-french-bulldog",
    ]);
  });

  it("fills with manhattan distance to 3 when fewer than 2 editorial ids", () => {
    const gsd = bySlug("german-shepherd");
    const isolated: Breed = { ...gsd, similarBreedIds: [] };
    const extra: Breed = {
      ...bySlug("french-bulldog"),
      id: "dog-beagle",
      slug: "beagle",
      name: "Beagle",
      similarBreedIds: [],
      traits: { ...gsd.traits },
    };
    const ids = resolveSimilar(isolated, [...breeds, extra]).map((b) => b.id);
    expect(ids).toEqual([
      "dog-beagle",
      "dog-golden-retriever",
      "dog-french-bulldog",
    ]);
  });

  it("breaks manhattan ties by name", () => {
    const gsd = bySlug("german-shepherd");
    const isolated: Breed = { ...gsd, similarBreedIds: [] };
    const clone = (id: string, name: string): Breed => ({
      ...bySlug("french-bulldog"),
      id,
      slug: id.replace(/^dog-/, ""),
      name,
      similarBreedIds: [],
      traits: { ...gsd.traits },
    });
    const pool = [isolated, clone("dog-beagle", "Beagle"), clone("dog-airedale", "Airedale")];
    expect(resolveSimilar(isolated, pool).map((b) => b.id)).toEqual([
      "dog-airedale",
      "dog-beagle",
    ]);
  });

  it("never mixes species", () => {
    for (const breed of breeds) {
      const similar = resolveSimilar(breed, breeds);
      expect(similar.every((other) => other.species === breed.species)).toBe(
        true,
      );
      expect(similar.map((other) => other.id)).not.toContain(breed.id);
    }
  });
});
