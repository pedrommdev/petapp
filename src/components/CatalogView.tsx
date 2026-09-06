"use client";

import { useEffect, useState } from "react";
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
import {
  catalogHref,
  parseCatalogQuery,
  persistLastCatalog,
} from "@/lib/query";
import type { Breed } from "@/types/breed";

function focusSearch() {
  document.getElementById("breed-search")?.focus();
}

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
    <div className="grid grid-cols-1 [grid-template-areas:'header'_'search'_'title'_'chips'_'results'] md:[grid-template-areas:'header'_'title'_'search'_'chips'_'results']">
      <div className="sticky top-0 z-30 bg-cream [grid-area:header] md:static">
        <AppHeader />
      </div>

      <div className="sticky top-14 z-20 bg-cream pt-2 pb-3 [grid-area:search] md:static md:pt-6 md:pb-0">
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

      <div className="mt-2 [grid-area:title] md:mt-6 md:flex md:items-end md:justify-between md:gap-6">
        <div>
          <h1 className="italic">Find yours</h1>
          {!dirty ? (
            <p className="mt-2 text-muted">
              A playful encyclopedia of cat and dog breeds.
            </p>
          ) : null}
        </div>
        <div className="mt-2 md:mt-0">
          <ResultCount
            total={breeds.length}
            matchCount={results.length}
            dirty={dirty}
          />
        </div>
      </div>

      <div className="mt-4 [grid-area:chips]">
        <FilterBar query={query} onChange={onQueryChange} onClear={onClear} />
        <noscript>
          <p className="mt-4 text-sm text-muted">
            Filters need JavaScript. Every breed matching this link is listed
            below.
          </p>
        </noscript>
      </div>

      <div id="breed-grid" className="mt-6 [grid-area:results]">
        {results.length > 0 ? (
          <BreedGrid breeds={results} />
        ) : (
          <EmptyResults onClear={onClear} />
        )}
      </div>
    </div>
  );
}

export function CatalogFallback({
  breeds,
  query,
}: {
  breeds: Breed[];
  query: CatalogQuery;
}) {
  return (
    <CatalogScreen
      breeds={breeds}
      query={query}
      onQueryChange={() => {}}
      onClear={() => {}}
    />
  );
}

export function CatalogView({
  breeds,
  initialQuery,
}: {
  breeds: Breed[];
  initialQuery: CatalogQuery;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(parseCatalogQuery(new URLSearchParams(searchParams.toString())));
  }, [searchParams]);

  useEffect(() => {
    persistLastCatalog(catalogHref(query, pathname));
  }, [pathname, query]);

  function replaceQuery(next: CatalogQuery) {
    setQuery(next);
    router.replace(catalogHref(next, pathname), { scroll: false });
  }

  function clear() {
    replaceQuery({});
    requestAnimationFrame(focusSearch);
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
