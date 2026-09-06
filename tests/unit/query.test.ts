import { describe, expect, it } from "vitest";
import type { CatalogQuery } from "@/lib/filters";
import {
  catalogHref,
  isSafeCatalogHref,
  parseCatalogQuery,
  serializeCatalogQuery,
} from "@/lib/query";

describe("parseCatalogQuery", () => {
  it.each([
    {
      name: "reads every known key",
      search: "q=GSD&species=dog&size=small&energy=low&shedding=high&kids=1&apartment=1",
      want: {
        q: "GSD",
        species: "dog",
        size: "small",
        energy: "low",
        shedding: "high",
        kids: true,
        apartment: true,
      },
    },
    {
      name: "ignores invalid species, energy, shedding, and apartment=0",
      search: "q=GSD&species=lizard&size=small&energy=low&shedding=nope&kids=1&apartment=0",
      want: {
        q: "GSD",
        species: undefined,
        size: "small",
        energy: "low",
        shedding: undefined,
        kids: true,
        apartment: undefined,
      },
    },
    {
      name: "ignores invalid size and kids not equal to 1",
      search: "size=tiny&energy=hot&kids=true&apartment=yes",
      want: {
        q: undefined,
        species: undefined,
        size: undefined,
        energy: undefined,
        shedding: undefined,
        kids: undefined,
        apartment: undefined,
      },
    },
    {
      name: "trims q and treats blank as unset",
      search: "q=%20%20%20&species=cat",
      want: {
        q: undefined,
        species: "cat",
        size: undefined,
        energy: undefined,
        shedding: undefined,
        kids: undefined,
        apartment: undefined,
      },
    },
    {
      name: "ignores unknown keys",
      search: "foo=bar&species=cat",
      want: {
        q: undefined,
        species: "cat",
        size: undefined,
        energy: undefined,
        shedding: undefined,
        kids: undefined,
        apartment: undefined,
      },
    },
  ])("$name", ({ search, want }) => {
    expect(parseCatalogQuery(new URLSearchParams(search))).toEqual(want);
  });
});

describe("serializeCatalogQuery", () => {
  it.each([
    {
      name: "only set keys",
      query: { q: "siamese", species: "cat" as const, kids: true, apartment: true },
      want: "q=siamese&species=cat&kids=1&apartment=1",
    },
    {
      name: "empty query",
      query: {},
      want: "",
    },
    {
      name: "false booleans omitted",
      query: { kids: false, apartment: false, q: "" },
      want: "",
    },
    {
      name: "bands and size",
      query: {
        size: "large" as const,
        energy: "medium" as const,
        shedding: "low" as const,
      },
      want: "size=large&energy=medium&shedding=low",
    },
  ])("$name", ({ query, want }) => {
    expect(serializeCatalogQuery(query)).toBe(want);
  });

  it("round-trips a full query", () => {
    const original: CatalogQuery = {
      q: "corgi",
      species: "dog",
      size: "small",
      energy: "high",
      shedding: "medium",
      kids: true,
      apartment: true,
    };
    expect(
      parseCatalogQuery(new URLSearchParams(serializeCatalogQuery(original))),
    ).toEqual(original);
  });
});

describe("catalogHref", () => {
  it("returns pathname when the query is empty", () => {
    expect(catalogHref({})).toBe("/");
  });

  it("joins a query string", () => {
    expect(catalogHref({ species: "cat", kids: true })).toBe(
      "/?species=cat&kids=1",
    );
  });
});

describe("isSafeCatalogHref", () => {
  it.each([
    "/",
    "/?species=cat",
    "/?q=GSD&species=dog&kids=1",
    "/?q=hi%20there",
  ])("allows %s", (value) => {
    expect(isSafeCatalogHref(value)).toBe(true);
  });

  it.each([
    "",
    "/breeds/siamese",
    "//evil.example",
    "/\\evil",
    "/?q=hi there",
    "https://example.com/",
    "/?q=<script>",
  ])("rejects %s", (value) => {
    expect(isSafeCatalogHref(value)).toBe(false);
  });
});
