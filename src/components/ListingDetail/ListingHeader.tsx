import { Star } from "lucide-react";

import { getT } from "@/i18n/server";

interface ListingHeaderProps {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export async function ListingHeader({
  title,
  location,
  rating,
  reviewCount,
}: ListingHeaderProps) {
  const t = await getT();

  return (
    <header>
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Star className="size-3.5 fill-muted-foreground text-muted-foreground" />
        <span>{rating.toFixed(2)}</span>
        <span aria-hidden="true">·</span>
        <span>{t("listing.reviews", { count: reviewCount })}</span>
        <span aria-hidden="true">·</span>
        <span>{location}</span>
      </p>
    </header>
  );
}
