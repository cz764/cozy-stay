import Image from "next/image";
import { Star, Heart } from "lucide-react";

import { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { title, location, image, pricePerNight, rating, reviewCount, maxGuests } =
    listing;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 rounded-full p-2 text-white/90 transition-transform hover:scale-110"
        >
          <Heart className="size-6 drop-shadow [&:hover]:fill-primary [&:hover]:text-primary" />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug text-foreground">{title}</h3>
        <span className="flex shrink-0 items-center gap-1 text-sm">
          <Star className="size-4 fill-foreground text-foreground" />
          {rating.toFixed(2)}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{location}</p>
      <p className="text-sm text-muted-foreground">
        Up to {maxGuests} guests · {reviewCount} reviews
      </p>

      <p className="mt-1 text-sm">
        <span className="font-semibold text-foreground">${pricePerNight}</span>{" "}
        <span className="text-muted-foreground">night</span>
      </p>
    </article>
  );
}
