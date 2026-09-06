import type { Species } from "@/types/breed";

const OPTIONS: { value: Species | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "cat", label: "Cats" },
  { value: "dog", label: "Dogs" },
];

export function SpeciesSegment({
  value,
  onChange,
}: {
  value: Species | undefined;
  onChange: (value: Species | undefined) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Species"
      className="grid h-11 grid-cols-3 rounded-full border border-ink bg-cream p-0.5"
    >
      {OPTIONS.map((option) => {
        const checked = value === option.value;
        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.value)}
            className={`rounded-full text-sm font-bold transition-colors duration-150 ease-out motion-reduce:transition-none ${
              checked ? "bg-accent text-white" : "text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
