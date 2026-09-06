"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BreedGrid } from "@/components/BreedGrid";
import { EmptyResults } from "@/components/EmptyResults";
import { FilterBar } from "@/components/FilterBar";
import { ResultCount } from "@/components/ResultCount";
import { SearchInput } from "@/components/SearchInput";
import { SpeciesSegment } from "@/components/SpeciesSegment";
import {
  filterBreeds,
  isCatalogQueryDirty,
  type CatalogQuery,
} from "@/lib/filters";
import { parseCatalogQuery, serializeCatalogQuery } from "@/lib/query";
import type { Breed } from "@/types/breed";

function CatalogScreen({
  breeds,
  query,
  onQueryChange,
  onClear,
}: {
  breeds: Breed[];
  query: CatalogQuery;
  onQueryChange: (next: CatalogQuery) => void;
  onClear: () => void;
}) {
  const results = filterBreeds(breeds, query);
  const dirty = isCatalogQueryDirty(query);

  return (
    <>
      <div className="sticky top-0 z-30 bg-cream md:static">
        <AppHeader />
      </div>

      <div className="mt-2 md:mt-6 md:flex md:items-end md:justify-between md:gap-6">
        <div>
          <h1 className="font-display text-display italic md:text-[2.75rem]">
            Find yours
          </h1>
          {dirty ? (
            <div className="mt-2 md:hidden">
              <ResultCount
                total={breeds.length}
                matchCount={results.length}
                dirty={dirty}
              />
            </div>
          ) : (
            <p className="mt-2 text-muted">
              A playful encyclopedia of cat and dog breeds.
            </p>
          )}
        </div>
        <div className="mt-3 hidden md:block">
          <ResultCount
            total={breeds.length}
            matchCount={results.length}
            dirty={dirty}
          />
        </div>
      </div>

      {!dirty ? (
        <div className="mt-2 md:hidden">
          <ResultCount
            total={breeds.length}
            matchCount={results.length}
            dirty={dirty}
          />
        </div>
      ) : null}

      <div className="sticky top-14 z-20 -mx-4 bg-cream px-4 pt-3 pb-3 sm:-mx-6 sm:px-6 md:static md:mx-0 md:bg-transparent md:px-0 md:pt-6 md:pb-0">
        <SearchInput
          value={query.q ?? ""}
          onChange={(q) => onQueryChange({ ...query, q: q || undefined })}
        />
        <div className="mt-3">
          <SpeciesSegment
            value={query.species}
            onChange={(species) => onQueryChange({ ...query, species })}
          />
        </div>
      </div>

      <div className="mt-4">
        <FilterBar query={query} onChange={onQueryChange} onClear={onClear} />
      </div>

      <noscript>
        <p className="mt-4 text-sm text-muted">
          Filters need JavaScript. The full catalog is below.
        </p>
      </noscript>

      <div id="breed-grid" className="mt-6">
        {results.length > 0 ? (
          <BreedGrid breeds={results} />
        ) : (
          <EmptyResults onClear={onClear} />
        )}
      </div>
    </>
  );
}

export function CatalogFallback({ breeds }: { breeds: Breed[] }) {
  return (
    <CatalogScreen
      breeds={breeds}
      query={{}}
      onQueryChange={() => {}}
      onClear={() => {}}
    />
  );
}

export function CatalogView({ breeds }: { breeds: Breed[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(
    () => parseCatalogQuery(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  function replaceQuery(next: CatalogQuery) {
    const qs = serializeCatalogQuery(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clear() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <CatalogScreen
      breeds={breeds}
      query={query}
      onQueryChange={replaceQuery}
      onClear={clear}
    />
  );
}
