import Image from "next/image";
import type { BreedPhoto } from "@/types/breed";

function Credit({ photo }: { photo: BreedPhoto }) {
  const name = photo.sourceUrl ? (
    <a
      href={photo.sourceUrl}
      rel="noreferrer"
      className="underline underline-offset-2"
    >
      {photo.credit}
    </a>
  ) : (
    photo.credit
  );

  if (photo.license === "CC0" || photo.license === "public-domain") {
    return (
      <>
        {name}. Public domain.
      </>
    );
  }

  if (photo.license === "licensed") {
    const licenseWord = photo.licenseUrl ? (
      <a
        href={photo.licenseUrl}
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        license
      </a>
    ) : (
      "license"
    );
    return (
      <>
        {name}. Used under {licenseWord}.
      </>
    );
  }

  const licenseLabel = photo.licenseUrl ? (
    <a
      href={photo.licenseUrl}
      rel="noreferrer"
      className="underline underline-offset-2"
    >
      {photo.license}
    </a>
  ) : (
    photo.license
  );

  return (
    <>
      {name} ({licenseLabel})
    </>
  );
}

export function PhotoGallery({ photos }: { photos: BreedPhoto[] }) {
  return (
    <div className="photo-gallery">
      <div
        className="-mx-4 flex snap-x snap-mandatory overflow-x-auto sm:-mx-6 lg:mx-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Breed photos"
      >
        {photos.map((photo, i) => (
          <figure
            key={photo.src}
            id={`breed-photo-${i + 1}`}
            className="photo-slide w-full shrink-0 snap-center snap-always"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream lg:rounded-2xl">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 768px) 100vw, 800px"
                className="h-full w-full object-cover"
                priority={i === 0}
              />
            </div>
            <figcaption className="mt-2 px-4 text-center text-xs text-muted sm:px-6 lg:px-0">
              <Credit photo={photo} />
            </figcaption>
          </figure>
        ))}
      </div>

      {photos.length > 1 ? (
        <nav
          aria-label="Photo slides"
          className="mt-3 flex justify-center gap-1"
        >
          {photos.map((photo, i) => (
            <a
              key={photo.src}
              href={`#breed-photo-${i + 1}`}
              aria-label={`Photo ${i + 1} of ${photos.length}`}
              className="flex size-11 items-center justify-center"
            >
              <span
                data-index={i}
                className="photo-dot block size-2 rounded-full bg-sand"
              />
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
