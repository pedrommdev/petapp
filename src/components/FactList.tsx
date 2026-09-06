import type { Breed, CoatType, SizeClass } from "@/types/breed";

const SIZE: Record<SizeClass, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

const COAT: Record<CoatType, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
  hairless: "Hairless",
  double: "Double",
  curly: "Curly",
};

export function FactList({ breed }: { breed: Breed }) {
  const facts = [
    { label: "Origin", value: breed.origin },
    { label: "Size", value: SIZE[breed.sizeClass] },
    { label: "Coat", value: COAT[breed.coat] },
    {
      label: "Lifespan",
      value: `${breed.lifespanYears.min}–${breed.lifespanYears.max} years`,
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="border-t border-sand pt-3">
          <dt className="text-xs font-bold tracking-wide text-muted uppercase">
            {fact.label}
          </dt>
          <dd className="mt-1 font-semibold">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
