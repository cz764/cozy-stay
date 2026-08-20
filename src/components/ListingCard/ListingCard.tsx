import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { CozyHeart } from "@/components/icons/CozyHeart";
import { Listing } from "@/data/types";

interface ListingCardProps {
  listing: Listing;
  /** Above-the-fold cards preload their image instead of lazy-loading it. */
  priority?: boolean;
}

/**
 * Memoized so appending a page doesn't re-render the cards already on screen.
 * `ListingFeed` appends with `[...previous, ...next]`, which preserves each
 * existing listing's object identity, so the shallow prop compare hits.
 */
export const ListingCard = memo(function ListingCard({
  listing,
  priority = false,
}: ListingCardProps) {
  const { id, title, location, image, pricePerNight, rating } = listing;

  return (
    <article className="group relative flex flex-col">
      {/* The wishlist button stays a sibling of the link — interactive
          elements can't nest — and overlays the image via the article's
          positioning context. */}
      <Link
        href={`/listing/${id}`}
        className="flex flex-col rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          {/* Decorative: the photo's meaning is carried by the card's text,
              and an empty alt keeps the title from being announced twice. */}
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
            className="object-cover"
          />
        </div>

        <h3 className="mt-2 truncate text-sm font-medium text-foreground">
          <span className="sr-only">{title}, </span>
          Home in {location}
        </h3>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-muted-foreground text-muted-foreground" />
          <span>{rating.toFixed(2)}</span>
          <span aria-hidden="true">·</span>
          <span>${pricePerNight} night</span>
        </p>
      </Link>

      <button
        aria-label={`Save ${title} to wishlist`}
        className="absolute right-2 top-2 rounded-full p-2 text-white/90 outline-none transition-transform duration-200 hover:scale-108 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <CozyHeart className="size-6 fill-black/50 stroke-white [stroke-width:2px]" />
      </button>
    </article>
  );
});
