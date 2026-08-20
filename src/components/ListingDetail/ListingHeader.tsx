import { Star } from "lucide-react";

interface ListingHeaderProps {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
}

/** Title plus the rating · reviews · location subline. */
export function ListingHeader({
  title,
  location,
  rating,
  reviewCount,
}: ListingHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Star className="size-3.5 fill-muted-foreground text-muted-foreground" />
        <span>{rating.toFixed(2)}</span>
        <span aria-hidden="true">·</span>
        <span>
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
        <span aria-hidden="true">·</span>
        <span>{location}</span>
      </p>
    </header>
  );
}
