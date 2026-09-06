import { Suspense } from "react";
import { CatalogFallback, CatalogView } from "@/components/CatalogView";
import { getAllBreeds } from "@/lib/catalog";
import type { CatalogQuery } from "@/lib/filters";
import { parseCatalogQuery } from "@/lib/query";

export const dynamic = "force-dynamic";

function fromNextSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      const last = value.at(-1);
      if (last !== undefined) params.set(key, last);
    }
  }
  return params;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const breeds = getAllBreeds();
  const initialQuery: CatalogQuery = parseCatalogQuery(
    fromNextSearchParams(await searchParams),
  );

  return (
    <main>
      <Suspense
        fallback={<CatalogFallback breeds={breeds} query={initialQuery} />}
      >
        <CatalogView breeds={breeds} initialQuery={initialQuery} />
      </Suspense>
    </main>
  );
}
