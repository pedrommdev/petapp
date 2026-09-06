import Image from "next/image";
import Link from "next/link";
import { SpeciesBadge } from "@/components/SpeciesBadge";
import { TagChip } from "@/components/TagChip";
import { cardTags } from "@/lib/tags";
import type { Breed } from "@/types/breed";

export function BreedCard({
  breed,
  priority = false,
  compact = false,
}: {
  breed: Breed;
  priority?: boolean;
  compact?: boolean;
}) {
  const hero = breed.photos[0];
  const [size, extra] = cardTags(breed);

  return (
    <Link
      href={`/breeds/${breed.slug}`}
      className="block overflow-hidden rounded-2xl bg-surface shadow-[0_1px_2px_rgba(28,25,23,0.06)] ring-1 ring-sand/80 transition-transform duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <div className="relative aspect-[4/3] bg-cream">
        {hero ? (
          <Image
            src={hero.src}
            alt={`${breed.name} ${breed.species}`}
            width={hero.width}
            height={hero.height}
            sizes={
              compact
                ? "(max-width: 768px) 70vw, 240px"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            }
            className="h-full w-full object-cover"
            priority={priority}
          />
        ) : null}
        <SpeciesBadge
          species={breed.species}
          className="absolute top-2 left-2"
        />
      </div>
      <div className={compact ? "px-3 py-2.5" : "px-3 py-3"}>
        <p className="truncate text-base font-bold">{breed.name}</p>
        <p className="mt-0.5 truncate">
          <TagChip>{size}</TagChip>
          <span className="text-sm text-muted"> · </span>
          <TagChip>{extra}</TagChip>
        </p>
      </div>
    </Link>
  );
}
