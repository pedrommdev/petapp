export function ResultCount({
  total,
  matchCount,
  dirty,
}: {
  total: number;
  matchCount: number;
  dirty: boolean;
}) {
  let text: string;
  if (!dirty) {
    text = `${total} breeds`;
  } else if (matchCount === 1) {
    text = "1 breed matches";
  } else {
    text = `${matchCount} breeds match`;
  }

  return (
    <p
      id="catalog-status"
      className="text-sm text-muted"
      aria-live="polite"
      aria-atomic="true"
    >
      {text}
    </p>
  );
}
