export type Species = "cat" | "dog";
export type SizeClass = "small" | "medium" | "large";
export type CoatType =
  | "short"
  | "medium"
  | "long"
  | "hairless"
  | "double"
  | "curly";
export type TraitScore = 1 | 2 | 3 | 4 | 5;

export interface BreedTraits {
  energy: TraitScore;
  shedding: TraitScore;
  trainability: TraitScore;
  goodWithKids: TraitScore;
  goodWithOtherPets: TraitScore;
  apartmentFriendly: TraitScore;
  groomingNeed: TraitScore;
}

export interface BreedPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  license: "CC0" | "CC BY" | "CC BY-SA" | "licensed" | "public-domain";
  sourceUrl?: string;
  licenseUrl?: string;
}

export interface LifespanRange {
  min: number;
  max: number;
}

export interface Breed {
  id: string;
  slug: string;
  species: Species;
  name: string;
  origin: string;
  aliases: string[];
  sizeClass: SizeClass;
  coat: CoatType;
  lifespanYears: LifespanRange;
  shortDescription: string;
  description: string;
  traits: BreedTraits;
  photos: BreedPhoto[];
  similarBreedIds: string[];
}

export interface CatalogFile {
  version: 1;
  generatedAt: string;
  breeds: Breed[];
}
