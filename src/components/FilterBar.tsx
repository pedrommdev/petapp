import type { ReactNode } from "react";
import { FilterChip } from "@/components/FilterChip";
import type { CatalogQuery, EnergyBand } from "@/lib/filters";
import { isCatalogQueryDirty } from "@/lib/filters";
import type { SizeClass } from "@/types/breed";

const SIZES: { value: SizeClass; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const BANDS: { value: EnergyBand; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Med" },
  { value: "high", label: "High" },
];

export function FilterBar({
  query,
  onChange,
  onClear,
}: {
  query: CatalogQuery;
  onChange: (next: CatalogQuery) => void;
  onClear: () => void;
}) {
  const dirty = isCatalogQueryDirty(query);

  function toggleSize(value: SizeClass) {
    onChange({ ...query, size: query.size === value ? undefined : value });
  }

  function toggleEnergy(value: EnergyBand) {
    onChange({ ...query, energy: query.energy === value ? undefined : value });
  }

  function toggleShedding(value: EnergyBand) {
    onChange({
      ...query,
      shedding: query.shedding === value ? undefined : value,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ChipGroup
        label="Size"
        trailing={
          dirty ? (
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-semibold text-accent"
            >
              Clear
            </button>
          ) : null
        }
      >
        {SIZES.map((size) => (
          <FilterChip
            key={size.value}
            label={size.label}
            pressed={query.size === size.value}
            onToggle={() => toggleSize(size.value)}
          />
        ))}
      </ChipGroup>

      <ChipGroup label="Energy">
        {BANDS.map((band) => (
          <FilterChip
            key={`energy-${band.value}`}
            label={band.label}
            ariaLabel={`${band.label} energy`}
            pressed={query.energy === band.value}
            onToggle={() => toggleEnergy(band.value)}
          />
        ))}
      </ChipGroup>

      <ChipGroup label="Shedding">
        {BANDS.map((band) => (
          <FilterChip
            key={`shedding-${band.value}`}
            label={band.label}
            ariaLabel={`${band.label} shedding`}
            pressed={query.shedding === band.value}
            onToggle={() => toggleShedding(band.value)}
          />
        ))}
      </ChipGroup>

      <ChipGroup label="Lifestyle">
        <FilterChip
          label="Good with kids"
          pressed={Boolean(query.kids)}
          onToggle={() =>
            onChange({ ...query, kids: query.kids ? undefined : true })
          }
        />
        <FilterChip
          label="Apartment OK"
          pressed={Boolean(query.apartment)}
          onToggle={() =>
            onChange({
              ...query,
              apartment: query.apartment ? undefined : true,
            })
          }
        />
      </ChipGroup>
    </div>
  );
}

function ChipGroup({
  label,
  children,
  trailing,
}: {
  label: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">
          {label}
        </p>
        {trailing}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
