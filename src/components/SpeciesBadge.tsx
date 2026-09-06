import type { Species } from "@/types/breed";

export function SpeciesBadge({
  species,
  className = "",
}: {
  species: Species;
  className?: string;
}) {
  const isCat = species === "cat";

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[11px] font-bold tracking-wider text-white ${
        isCat ? "bg-cat" : "bg-dog"
      } ${className}`}
    >
      {isCat ? "CAT" : "DOG"}
    </span>
  );
}
