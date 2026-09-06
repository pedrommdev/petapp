import Link from "next/link";
import { AllBreedsLink } from "@/components/AllBreedsLink";
import { LogoMark } from "@/components/LogoMark";

export function AppHeader({ variant = "default" }: { variant?: "default" | "detail" }) {
  if (variant === "detail") {
    return (
      <header className="flex h-14 items-center justify-between gap-4">
        <AllBreedsLink />
        <Link
          href="/"
          className="inline-flex items-center gap-2"
          aria-label="Cat & Dog Repo home"
        >
          <LogoMark className="size-7" />
          <span className="hidden font-bold sm:inline">Cat & Dog Repo</span>
        </Link>
      </header>
    );
  }

  return (
    <header className="flex h-14 items-center">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2.5 rounded-sm text-ink"
        aria-label="Cat & Dog Repo home"
      >
        <LogoMark />
        <span className="font-display text-lg font-semibold tracking-tight">
          Cat & Dog Repo
        </span>
      </Link>
    </header>
  );
}
