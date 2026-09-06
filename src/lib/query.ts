import type { CatalogQuery, EnergyBand } from "@/lib/filters";
import type { SizeClass, Species } from "@/types/breed";

const SAFE_QUERY = /^\/\?[A-Za-z0-9._~=&%-]+$/;

function isBand(value: string | null): value is EnergyBand {
  return value === "low" || value === "medium" || value === "high";
}

function isSpecies(value: string | null): value is Species {
  return value === "cat" || value === "dog";
}

function isSize(value: string | null): value is SizeClass {
  return value === "small" || value === "medium" || value === "large";
}

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const q = params.get("q")?.trim() || undefined;
  const species = params.get("species");
  const size = params.get("size");
  const energy = params.get("energy");
  const shedding = params.get("shedding");
  const kids = params.get("kids");
  const apartment = params.get("apartment");

  return {
    q,
    species: isSpecies(species) ? species : undefined,
    size: isSize(size) ? size : undefined,
    energy: isBand(energy) ? energy : undefined,
    shedding: isBand(shedding) ? shedding : undefined,
    kids: kids === "1" ? true : undefined,
    apartment: apartment === "1" ? true : undefined,
  };
}

export function serializeCatalogQuery(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.species) params.set("species", query.species);
  if (query.size) params.set("size", query.size);
  if (query.energy) params.set("energy", query.energy);
  if (query.shedding) params.set("shedding", query.shedding);
  if (query.kids) params.set("kids", "1");
  if (query.apartment) params.set("apartment", "1");
  return params.toString();
}

export function catalogHref(query: CatalogQuery, pathname = "/"): string {
  const qs = serializeCatalogQuery(query);
  return qs ? `${pathname}?${qs}` : pathname;
}

export function isSafeCatalogHref(value: string): boolean {
  if (value !== "/" && !SAFE_QUERY.test(value)) return false;
  if (/\s/.test(value)) return false;
  if (value.includes("//") || value.includes("/\\")) return false;
  try {
    return new URL(value, "https://example.invalid").pathname === "/";
  } catch {
    return false;
  }
}

export function persistLastCatalog(href: string): void {
  if (typeof window === "undefined") return;
  if (!isSafeCatalogHref(href)) return;
  sessionStorage.setItem("cdr:lastCatalog", href);
}

const CATALOG_HREF = /^\/(?:\?[A-Za-z0-9._~=&%-]+)?$/;

export function isSafeCatalogHref(value: string): boolean {
  if (!value) return false;
  if (/\s/.test(value)) return false;
  if (value.includes("//") || value.includes("/\\")) return false;
  if (!CATALOG_HREF.test(value)) return false;
  try {
    const url = new URL(value, "https://catapp.local");
    return url.pathname === "/";
  } catch {
    return false;
  }
}
