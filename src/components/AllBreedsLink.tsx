"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isSafeCatalogHref } from "@/lib/query";

export function AllBreedsLink() {
  const [href, setHref] = useState("/");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("cdr:lastCatalog");
      if (stored && isSafeCatalogHref(stored)) {
        setHref(stored);
      }
    } catch {
      // sessionStorage can throw in restricted browsing modes
    }
  }, []);

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-ink"
    >
      <ChevronLeft />
      All breeds
    </Link>
  );
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
