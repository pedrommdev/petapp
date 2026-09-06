import type { Breed } from "@/types/breed";

export function breedJsonLd(breed: Breed) {
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: breed.name,
    image: breed.photos[0]?.src,
    description: breed.shortDescription,
    additionalType:
      breed.species === "cat"
        ? "https://schema.org/Cat"
        : "https://schema.org/Dog",
  };
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}
