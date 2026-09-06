import { BreedCard } from "@/components/BreedCard";
import type { Breed } from "@/types/breed";

export function SimilarBreeds({ breeds }: { breeds: Breed[] }) {
  const shown = breeds.slice(0, 4);
  if (shown.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="similar-heading">
      <h2
        id="similar-heading"
        className="font-display text-2xl font-semibold md:text-3xl"
      >
        If you like this
      </h2>
      <p className="mt-1 text-sm text-muted">
        Close in lifestyle and looks, not a ranking.
      </p>
      <ul className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {shown.map((breed) => (
          <li
            key={breed.id}
            className="w-[70%] shrink-0 snap-start sm:w-56 md:w-auto"
          >
            <BreedCard breed={breed} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
