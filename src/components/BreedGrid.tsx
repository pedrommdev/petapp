import { BreedCard } from "@/components/BreedCard";
import type { Breed } from "@/types/breed";

export function BreedGrid({ breeds }: { breeds: Breed[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {breeds.map((breed, index) => (
        <li key={breed.id}>
          <BreedCard breed={breed} priority={index < 2} />
        </li>
      ))}
    </ul>
  );
}
