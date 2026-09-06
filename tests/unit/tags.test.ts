import { describe, expect, it } from "vitest";
import { cardTags } from "@/lib/tags";
import type { Breed, BreedTraits, CoatType } from "@/types/breed";
import fixture from "../fixtures/breeds.json";

const breeds = fixture.breeds as unknown as Breed[];

function bySlug(slug: string): Breed {
  const breed = breeds.find((b) => b.slug === slug);
  if (!breed) throw new Error(`missing fixture ${slug}`);
  return breed;
}

function overlay(
  slug: string,
  traits: Partial<BreedTraits>,
  extra: Partial<Pick<Breed, "coat" | "sizeClass">> = {},
): Breed {
  const breed = bySlug(slug);
  return { ...breed, ...extra, traits: { ...breed.traits, ...traits } };
}

describe("cardTags", () => {
  it.each([
    {
      name: "apartment before kids",
      slug: "french-bulldog",
      want: ["Small", "Apartment OK"],
    },
    {
      name: "apartment on a medium cat",
      slug: "siamese",
      want: ["Medium", "Apartment OK"],
    },
    {
      name: "kids when apartment is below 4",
      slug: "maine-coon",
      want: ["Large", "Good with kids"],
    },
    {
      name: "kids on GSD (apartment 2, energy high)",
      slug: "german-shepherd",
      want: ["Large", "Good with kids"],
    },
    {
      name: "kids on Golden",
      slug: "golden-retriever",
      want: ["Large", "Good with kids"],
    },
    {
      name: "apartment on Ragdoll",
      slug: "ragdoll",
      want: ["Large", "Apartment OK"],
    },
  ])("$name", ({ slug, want }) => {
    expect(cardTags(bySlug(slug))).toEqual(want);
  });

  it.each([
    {
      name: "low shed when apartment and kids miss",
      breed: overlay("siamese", {
        apartmentFriendly: 2,
        goodWithKids: 2,
        shedding: 2,
      }),
      want: ["Medium", "Low shed"],
    },
    {
      name: "high energy when shed is not low",
      breed: overlay("german-shepherd", {
        apartmentFriendly: 2,
        goodWithKids: 2,
        shedding: 3,
        energy: 5,
      }),
      want: ["Large", "High energy"],
    },
    {
      name: "long coat fallback",
      breed: overlay(
        "maine-coon",
        {
          apartmentFriendly: 2,
          goodWithKids: 2,
          shedding: 3,
          energy: 3,
        },
        { coat: "long" satisfies CoatType },
      ),
      want: ["Large", "Long coat"],
    },
    {
      name: "hairless fallback",
      breed: overlay(
        "siamese",
        {
          apartmentFriendly: 1,
          goodWithKids: 1,
          shedding: 3,
          energy: 3,
        },
        { coat: "hairless" },
      ),
      want: ["Medium", "Hairless"],
    },
    {
      name: "double coat fallback",
      breed: overlay(
        "golden-retriever",
        {
          apartmentFriendly: 1,
          goodWithKids: 1,
          shedding: 3,
          energy: 3,
        },
        { coat: "double" },
      ),
      want: ["Large", "Double coat"],
    },
  ])("$name", ({ breed, want }) => {
    expect(cardTags(breed)).toEqual(want);
  });
});
