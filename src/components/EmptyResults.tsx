import { ClearFiltersButton } from "@/components/ClearFiltersButton";

export function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-2 py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/empty-no-results.svg"
        alt=""
        width={400}
        height={240}
        className="mb-6 w-full max-w-sm"
      />
      <h2 className="font-display text-3xl font-semibold">No pals in this mix.</h2>
      <p className="mt-3 text-muted">
        Nothing matches those filters. Try fewer chips, or clear them and start
        over.
      </p>
      <div className="mt-6 w-full sm:w-auto">
        <ClearFiltersButton onClick={onClear} fullWidth />
      </div>
    </div>
  );
}
