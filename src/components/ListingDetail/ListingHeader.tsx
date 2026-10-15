import { Star } from "lucide-react";

import { WishlistButton } from "@/components/WishlistButton/WishlistButton";
import { getT } from "@/i18n/server";

interface ListingHeaderProps {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export async function ListingHeader({
  id,
  title,
  location,
  rating,
  reviewCount,
}: ListingHeaderProps) {
  const t = await getT();

  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-3.5 fill-muted-foreground text-muted-foreground" />
          <span>{rating.toFixed(2)}</span>
          <span aria-hidden="true">·</span>
          <span>{t("listing.reviews", { count: reviewCount })}</span>
          <span aria-hidden="true">·</span>
          <span>{location}</span>
        </p>
      </div>
      <WishlistButton id={id} title={title} variant="inline" />
    </header>
  );
}
