import type { TraitScore } from "@/types/breed";

export function TraitMeter({
  label,
  value,
}: {
  label: string;
  value: TraitScore;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-semibold">{label}</span>
      <div
        className="flex gap-1.5"
        role="img"
        aria-label={`${label}, ${value} out of 5`}
      >
        {([1, 2, 3, 4, 5] as const).map((n) => {
          const filled = n <= value;
          return (
            <span
              key={n}
              aria-hidden="true"
              className={`inline-block size-[11px] rounded-full ${
                filled ? "bg-accent" : "border border-sand bg-transparent"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
