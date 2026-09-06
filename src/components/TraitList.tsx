import { TraitMeter } from "@/components/TraitMeter";
import type { Breed } from "@/types/breed";

const TRAITS = [
  { key: "energy", label: "Energy" },
  { key: "shedding", label: "Shedding" },
  { key: "trainability", label: "Trainability" },
  { key: "goodWithKids", label: "Good with kids" },
  { key: "goodWithOtherPets", label: "Good with other pets" },
  { key: "apartmentFriendly", label: "Apartment-friendly" },
  { key: "groomingNeed", label: "Grooming need" },
] as const;

export function TraitList({ breed }: { breed: Breed }) {
  return (
    <div>
      {TRAITS.map((trait) => (
        <TraitMeter
          key={trait.key}
          label={trait.label}
          value={breed.traits[trait.key]}
        />
      ))}
    </div>
  );
}
