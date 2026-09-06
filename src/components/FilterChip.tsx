export function FilterChip({
  label,
  pressed,
  onToggle,
  ariaLabel,
}: {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={`inline-flex h-10 items-center rounded-full border-2 px-3.5 text-sm font-semibold transition-colors duration-150 ease-out motion-reduce:transition-none ${
        pressed
          ? "border-accent bg-accent-soft text-ink"
          : "border-sand bg-cream text-ink"
      }`}
    >
      {label}
    </button>
  );
}
