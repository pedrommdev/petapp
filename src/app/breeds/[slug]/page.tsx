import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { FactList } from "@/components/FactList";
import { PhotoGallery } from "@/components/PhotoGallery";
import { SimilarBreeds } from "@/components/SimilarBreeds";
import { TraitList } from "@/components/TraitList";
import { getAllBreeds, getBreedBySlug } from "@/lib/catalog";
import { resolveSimilar } from "@/lib/similar";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBreeds().map((breed) => ({ slug: breed.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  if (!breed) return {};

  const kind = breed.species === "cat" ? "Cat" : "Dog";
  return {
    title: `${breed.name} (${kind})`,
    description: breed.shortDescription.slice(0, 160),
  };
}

export default async function BreedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  if (!breed) notFound();

  const paragraphs = breed.description.split("\n\n");
  const similar = resolveSimilar(breed, getAllBreeds());

  return (
    <>
      <AppHeader variant="detail" />
      <article className="pb-8">
        <div className="mt-2">
          <PhotoGallery photos={breed.photos} />
        </div>
        <div className="mt-6">
          <p
            className={`text-xs font-bold tracking-widest uppercase ${
              breed.species === "cat" ? "text-cat" : "text-dog"
            }`}
          >
            {breed.species === "cat" ? "CAT" : "DOG"}
          </p>
          <h1 className="mt-3">{breed.name}</h1>
          {breed.aliases.length > 0 ? (
            <p className="mt-1 text-sm text-muted">
              Also: {breed.aliases.join(", ")}
            </p>
          ) : null}
        </div>
        <div className="mt-8">
          <FactList breed={breed} />
        </div>
        <p className="mt-8 text-lg font-medium">{breed.shortDescription}</p>
        <div className="mt-6 max-w-prose space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            How they live
          </h2>
          <p className="mt-1 text-sm text-muted">
            Typical for the breed — individuals vary.
          </p>
          <div className="mt-4 max-w-lg">
            <TraitList breed={breed} />
          </div>
        </section>
        <SimilarBreeds breeds={similar} />
      </article>
    </>
  );
}
