import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="flex min-h-[60vh] flex-col items-start justify-center py-16">
        <h1 className="font-display text-[32px] leading-tight font-semibold md:text-5xl">
          This breed ran off.
        </h1>
        <p className="mt-3 max-w-md text-muted">
          That link doesn’t match a breed in the repo.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-bold text-white hover:bg-accent-hover"
        >
          Browse all breeds
        </Link>
      </main>
    </>
  );
}
