import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { WishlistButton } from "@/components/WishlistButton/WishlistButton";
import { Listing } from "@/data/types";
import { useT } from "@/i18n/client";

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

function ListingCard({ listing, priority = false }: ListingCardProps) {
  const t = useT();
  const { id, title, location, image, pricePerNight, rating } = listing;

  return (
    <article className="group relative flex flex-col">
      {/* The wishlist button stays a sibling of the link – interactive
          elements can't nest – and overlays the image via the article's
          positioning context. */}
      <Link
        href={`/listing/${id}`}
        className="flex flex-col rounded-2xl outline-none focus-ring"
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
          {t("card.homeIn", { location })}
        </h3>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-muted-foreground text-muted-foreground" />
          <span>{rating.toFixed(2)}</span>
          <span aria-hidden="true">·</span>
          <span>{t("card.pricePerNight", { price: pricePerNight })}</span>
        </p>
      </Link>

      <WishlistButton
        id={id}
        title={title}
        className="absolute right-2 top-2"
      />
    </article>
  );
}

// Memoization relies on the feed preserving existing listing object identities.
const MemoizedListingCard = memo(ListingCard);

export { MemoizedListingCard as ListingCard };
