export function ClearFiltersButton({
  onClick,
  fullWidth = false,
}: {
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-bold text-white transition-colors duration-150 ease-out hover:bg-accent-hover motion-reduce:transition-none ${
        fullWidth ? "w-full" : ""
      }`}
    >
      Clear filters
    </button>
  );
}
