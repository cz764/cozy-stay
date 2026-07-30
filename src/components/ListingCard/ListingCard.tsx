import Image from "next/image";
import { Star } from "lucide-react";

import { CozyHeart } from "@/components/icons/CozyHeart";
import { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { title, location, image, pricePerNight, rating } = listing;

  return (
    <article className="group flex cursor-pointer flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
          className="object-cover"
        />
        <button
          aria-label="Save to wishlist"
          className="absolute right-2 top-2 rounded-full p-2 text-white/90 transition-transform duration-200 hover:scale-108"
        >
          <CozyHeart className="size-6 fill-black/50 stroke-white [stroke-width:2px]" />
        </button>
      </div>

      <h3 className="mt-2 truncate text-sm font-medium text-foreground">
        Home in {location}
      </h3>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="size-3 fill-muted-foreground text-muted-foreground" />
        <span>{rating.toFixed(2)}</span>
        <span aria-hidden="true">·</span>
        <span>${pricePerNight} night</span>
      </p>
    </article>
  );
}
