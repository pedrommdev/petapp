import type { Breed, CoatType, SizeClass } from "@/types/breed";

const SIZE_LABEL: Record<SizeClass, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

const COAT_LABEL: Record<CoatType, string> = {
  short: "Short coat",
  medium: "Medium coat",
  long: "Long coat",
  hairless: "Hairless",
  double: "Double coat",
  curly: "Curly coat",
};

export function cardTags(breed: Breed): [string, string] {
  const size = SIZE_LABEL[breed.sizeClass];
  const { apartmentFriendly, goodWithKids, shedding, energy } = breed.traits;

  if (apartmentFriendly >= 4) return [size, "Apartment OK"];
  if (goodWithKids >= 4) return [size, "Good with kids"];
  if (shedding <= 2) return [size, "Low shed"];
  if (energy >= 4) return [size, "High energy"];
  return [size, COAT_LABEL[breed.coat]];
}
