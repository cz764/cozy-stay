import { Listing } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { ListingCardSkeleton } from "@/components/ListingCardSkeleton";

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
}

const gridClassName =
  "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

export function ListingGrid({ listings, isLoading }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }, (_, i) => (
          <ListingCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        <p className="font-medium text-foreground">
          No stays match your search
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different destination or fewer guests.
        </p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
